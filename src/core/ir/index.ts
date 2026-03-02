import type { AstProgram, AstStatement, FlowGraph, FlowNode, FlowEdge } from "@/shared/types/flow.types";

let nodeCount = 0;
function newId(prefix: string) {
  return `${prefix}_${++nodeCount}`;
}

function transformStatements(
  stmts: AstStatement[],
  nodes: FlowNode[],
  edges: FlowEdge[],
  entryId: string
): string {
  let currentId = entryId;

  for (const stmt of stmts) {
    switch (stmt.kind) {
      case "define": {
        const id = newId("process");
        nodes.push({ id, type: "process", label: `Definir ${stmt.name} Como ${stmt.varType}` });
        edges.push({ from: currentId, to: id });
        currentId = id;
        break;
      }
      case "read": {
        const id = newId("io");
        nodes.push({ id, type: "io", label: `Leer ${stmt.variable}` });
        edges.push({ from: currentId, to: id });
        currentId = id;
        break;
      }
      case "write": {
        const id = newId("io");
        nodes.push({ id, type: "io", label: `Escribir ${stmt.expression}` });
        edges.push({ from: currentId, to: id });
        currentId = id;
        break;
      }
      case "assign": {
        const id = newId("process");
        nodes.push({ id, type: "process", label: `${stmt.variable} <- ${stmt.expression}` });
        edges.push({ from: currentId, to: id });
        currentId = id;
        break;
      }
      case "if": {
        const decId = newId("decision");
        nodes.push({ id: decId, type: "decision", label: stmt.condition });
        edges.push({ from: currentId, to: decId });

        const mergeId = newId("merge");
        nodes.push({ id: mergeId, type: "process", label: "" });

        // Then branch
        if (stmt.then.length > 0) {
          const thenEntry = newId("then_entry");
          nodes.push({ id: thenEntry, type: "process", label: "" });
          edges.push({ from: decId, to: thenEntry, label: "v" });
          const thenExit = transformStatements(stmt.then, nodes, edges, thenEntry);
          edges.push({ from: thenExit, to: mergeId });
        } else {
          edges.push({ from: decId, to: mergeId, label: "v" });
        }

        // Else branch
        if (stmt.else.length > 0) {
          const elseEntry = newId("else_entry");
          nodes.push({ id: elseEntry, type: "process", label: "" });
          edges.push({ from: decId, to: elseEntry, label: "f" });
          const elseExit = transformStatements(stmt.else, nodes, edges, elseEntry);
          edges.push({ from: elseExit, to: mergeId });
        } else {
          edges.push({ from: decId, to: mergeId, label: "f" });
        }

        currentId = mergeId;
        break;
      }
      case "while": {
        const decId = newId("decision");
        nodes.push({ id: decId, type: "decision", label: stmt.condition });
        edges.push({ from: currentId, to: decId });

        const afterId = newId("after_while");
        nodes.push({ id: afterId, type: "process", label: "" });
        edges.push({ from: decId, to: afterId, label: "f" });

        const bodyEntry = newId("while_body");
        nodes.push({ id: bodyEntry, type: "process", label: "" });
        edges.push({ from: decId, to: bodyEntry, label: "v" });
        const bodyExit = transformStatements(stmt.body, nodes, edges, bodyEntry);
        // back edge
        edges.push({ from: bodyExit, to: decId });

        currentId = afterId;
        break;
      }
    }
  }

  return currentId;
}

export function astToFlowGraph(ast: AstProgram): FlowGraph {
  nodeCount = 0;
  const nodes: FlowNode[] = [];
  const edges: FlowEdge[] = [];

  const startId = "start";
  nodes.push({ id: startId, type: "start", label: `Inicio: ${ast.name}` });

  const exitId = transformStatements(ast.body, nodes, edges, startId);

  const endId = "end";
  nodes.push({ id: endId, type: "end", label: "Fin" });
  edges.push({ from: exitId, to: endId });

  return cleanGraph({ nodes, edges });
}

function cleanGraph(graph: FlowGraph): FlowGraph {
  const inEdges = new Map<string, FlowEdge[]>();
  const outEdges = new Map<string, FlowEdge[]>();

  for (const node of graph.nodes) {
    inEdges.set(node.id, []);
    outEdges.set(node.id, []);
  }
  for (const edge of graph.edges) {
    outEdges.get(edge.from)?.push(edge);
    inEdges.get(edge.to)?.push(edge);
  }

  const toRemove = new Set<string>();
  const edgesToRemove = new Set<FlowEdge>();
  const edgesToAdd: FlowEdge[] = [];

  for (const node of graph.nodes) {
    if (node.type === "process" && node.label === "" && node.id !== "start" && node.id !== "end") {
      const ins = inEdges.get(node.id) ?? [];
      const outs = outEdges.get(node.id) ?? [];
      if (ins.length === 1 && outs.length === 1) {
        toRemove.add(node.id);
        edgesToRemove.add(ins[0]);
        edgesToRemove.add(outs[0]);
        edgesToAdd.push({ from: ins[0].from, to: outs[0].to, label: ins[0].label ?? outs[0].label });
      }
    }
  }

  return {
    nodes: graph.nodes.filter((n) => !toRemove.has(n.id)),
    edges: [...graph.edges.filter((e) => !edgesToRemove.has(e)), ...edgesToAdd],
  };
}
