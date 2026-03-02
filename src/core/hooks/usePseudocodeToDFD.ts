import { useState, useCallback } from "react";
import { parsePseudocode } from "@/core/parser";
import { astToFlowGraph } from "@/core/ir";
import { layoutGraph } from "@/core/layout";
import type { PositionedGraph, ParserError } from "@/shared/types/flow.types";

export interface DFDState {
  graph: PositionedGraph | null;
  errors: ParserError[];
  generate: (input: string) => void;
}

export function usePseudocodeToDFD(): DFDState {
  const [graph, setGraph] = useState<PositionedGraph | null>(null);
  const [errors, setErrors] = useState<ParserError[]>([]);

  const generate = useCallback((input: string) => {
    const result = parsePseudocode(input);
    if (result.errors.length > 0 || !result.ast) {
      setErrors(result.errors);
      setGraph(null);
      return;
    }
    const flowGraph = astToFlowGraph(result.ast);
    const positioned = layoutGraph(flowGraph);
    setErrors([]);
    setGraph(positioned);
  }, []);

  return { graph, errors, generate };
}
