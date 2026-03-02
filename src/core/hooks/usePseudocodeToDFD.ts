import { useCallback, useState } from "react";
import {
  parsePseudocode,
  type AstProgram,
  type ParserError,
} from "@/core/parser/parsePseudocode";
import { astToFlowGraph } from "@/core/ir/astToFlowGraph";
import { layoutGraph } from "@/core/layout/layoutGraph";
import type { PositionedGraph } from "@/shared/types/flow";

interface State {
  ast: AstProgram | null;
  graph: PositionedGraph | null;
  errors: ParserError[];
}

export const usePseudocodeToDFD = () => {
  const [state, setState] = useState<State>({
    ast: null,
    graph: null,
    errors: [],
  });

  const generate = useCallback((input: string) => {
    const parsed = parsePseudocode(input.trim());
    if (parsed.errors.length > 0 || !parsed.ast) {
      setState({ ast: null, graph: null, errors: parsed.errors });
      return;
    }
    const flow = astToFlowGraph(parsed.ast);
    const positioned = layoutGraph(flow);
    setState({ ast: parsed.ast, graph: positioned, errors: [] });
  }, []);

  return { ...state, generate };
};
