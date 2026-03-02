import type { AstProgram, AstStatement } from "@/core/parser/parsePseudocode";
import type { FlowEdge, FlowGraph, FlowNode } from "@/shared/types/flow";

let idCounter = 0;
const newId = () => `n${++idCounter}`;

type StmtGraph = {
  entry: string;
  exit: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
};

// ── helpers ──────────────────────────────────────────────
function node(id: string, label: string, type: FlowNode["type"]): FlowNode {
  return { id, label, type };
}

/** Link a sequence of StmtGraphs so exit(i) → entry(i+1). Returns
 *  a composite StmtGraph covering the whole chain. If the list is
 *  empty, a transparent "merge" node is created. */
function chainBlocks(blocks: StmtGraph[]): StmtGraph {
  if (blocks.length === 0) {
    const id = newId();
    return {
      entry: id,
      exit: id,
      nodes: [node(id, "", "process")], // invisible merge node
      edges: [],
    };
  }

  const allNodes = blocks.flatMap((b) => b.nodes);
  const allEdges = blocks.flatMap((b) => b.edges);

  for (let i = 0; i < blocks.length - 1; i++) {
    allEdges.push({ from: blocks[i].exit, to: blocks[i + 1].entry });
  }

  return {
    entry: blocks[0].entry,
    exit: blocks[blocks.length - 1].exit,
    nodes: allNodes,
    edges: allEdges,
  };
}

// ── statement → sub-graph ────────────────────────────────
function stmtToGraph(stmt: AstStatement): StmtGraph {
  switch (stmt.kind) {
    case "Declare": {
      const id = newId();
      return {
        entry: id,
        exit: id,
        nodes: [node(id, `Definir ${stmt.id} Como ${stmt.type}`, "process")],
        edges: [],
      };
    }

    case "Read": {
      const id = newId();
      return {
        entry: id,
        exit: id,
        nodes: [node(id, `Leer ${stmt.ids.join(", ")}`, "io")],
        edges: [],
      };
    }

    case "Write": {
      const id = newId();
      return {
        entry: id,
        exit: id,
        nodes: [node(id, `Escribir ${stmt.expr}`, "io")],
        edges: [],
      };
    }

    case "Assign": {
      const id = newId();
      return {
        entry: id,
        exit: id,
        nodes: [node(id, `${stmt.id} <- ${stmt.expr}`, "process")],
        edges: [],
      };
    }

    case "If": {
      const condId = newId();
      const mergeId = newId();

      const thenBlock = chainBlocks(stmt.thenBranch.map(stmtToGraph));
      const elseBlock =
        stmt.elseBranch.length > 0
          ? chainBlocks(stmt.elseBranch.map(stmtToGraph))
          : null;

      const nodes: FlowNode[] = [
        node(condId, stmt.condition, "decision"),
        node(mergeId, "", "process"), // merge
        ...thenBlock.nodes,
      ];
      const edges: FlowEdge[] = [
        { from: condId, to: thenBlock.entry, label: "Sí" },
        { from: thenBlock.exit, to: mergeId },
        ...thenBlock.edges,
      ];

      if (elseBlock) {
        nodes.push(...elseBlock.nodes);
        edges.push(
          { from: condId, to: elseBlock.entry, label: "No" },
          { from: elseBlock.exit, to: mergeId },
          ...elseBlock.edges,
        );
      } else {
        edges.push({ from: condId, to: mergeId, label: "No" });
      }

      return { entry: condId, exit: mergeId, nodes, edges };
    }

    case "While": {
      const condId = newId();
      const mergeId = newId();
      const bodyBlock = chainBlocks(stmt.body.map(stmtToGraph));

      return {
        entry: condId,
        exit: mergeId,
        nodes: [
          node(condId, stmt.condition, "decision"),
          node(mergeId, "", "process"),
          ...bodyBlock.nodes,
        ],
        edges: [
          { from: condId, to: bodyBlock.entry, label: "Sí" },
          ...bodyBlock.edges,
          { from: bodyBlock.exit, to: condId },
          { from: condId, to: mergeId, label: "No" },
        ],
      };
    }

    case "For": {
      // init → decision → body → increment → decision (loop)
      const initId = newId();
      const condId = newId();
      const incId = newId();
      const mergeId = newId();
      const bodyBlock = chainBlocks(stmt.body.map(stmtToGraph));

      return {
        entry: initId,
        exit: mergeId,
        nodes: [
          node(initId, `${stmt.id} <- ${stmt.from}`, "process"),
          node(condId, `${stmt.id} <= ${stmt.to}`, "decision"),
          node(incId, `${stmt.id} <- ${stmt.id} + ${stmt.step}`, "process"),
          node(mergeId, "", "process"),
          ...bodyBlock.nodes,
        ],
        edges: [
          { from: initId, to: condId },
          { from: condId, to: bodyBlock.entry, label: "Sí" },
          ...bodyBlock.edges,
          { from: bodyBlock.exit, to: incId },
          { from: incId, to: condId },
          { from: condId, to: mergeId, label: "No" },
        ],
      };
    }

    case "DoWhile": {
      const bodyBlock = chainBlocks(stmt.body.map(stmtToGraph));
      const condId = newId();
      const mergeId = newId();

      return {
        entry: bodyBlock.entry,
        exit: mergeId,
        nodes: [
          ...bodyBlock.nodes,
          node(condId, stmt.condition, "decision"),
          node(mergeId, "", "process"),
        ],
        edges: [
          ...bodyBlock.edges,
          { from: bodyBlock.exit, to: condId },
          { from: condId, to: bodyBlock.entry, label: "Sí" },
          { from: condId, to: mergeId, label: "No" },
        ],
      };
    }
  }
}

// ── Public API ───────────────────────────────────────────
export function astToFlowGraph(program: AstProgram): FlowGraph {
  idCounter = 0;

  const startId = newId();
  const endId = newId();

  const bodyBlocks = program.body.map(stmtToGraph);
  const body = chainBlocks(bodyBlocks);

  const nodes: FlowNode[] = [
    node(startId, "Inicio", "start"),
    ...body.nodes,
    node(endId, "Fin", "end"),
  ];
  const edges: FlowEdge[] = [
    { from: startId, to: body.entry },
    ...body.edges,
    { from: body.exit, to: endId },
  ];

  return { nodes, edges };
}
