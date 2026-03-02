import { createToken, Lexer, EmbeddedActionsParser } from "chevrotain";
import type { AstProgram, AstStatement, ParseResult } from "@/shared/types/flow.types";

// ─── Tokens ──────────────────────────────────────────────────────────────────

const WhiteSpace = createToken({ name: "WhiteSpace", pattern: /\s+/, group: Lexer.SKIPPED });
const LineComment = createToken({ name: "LineComment", pattern: /\/\/[^\n]*/, group: Lexer.SKIPPED });
const BlockComment = createToken({ name: "BlockComment", pattern: /\/\*[\s\S]*?\*\//, group: Lexer.SKIPPED });

// Literals
const StringLiteral = createToken({ name: "StringLiteral", pattern: /"[^"]*"/ });
const NumberLiteral = createToken({ name: "NumberLiteral", pattern: /\d+(\.\d+)?/ });

// Identifier (must be declared before keywords that use longer_alt)
const Identifier = createToken({ name: "Identifier", pattern: /[a-zA-ZÀ-ÿ_][a-zA-ZÀ-ÿ0-9_]*/ });

// Keywords (case-insensitive) – must be before Identifier in token list
const Proceso = createToken({ name: "Proceso", pattern: /[Pp]roceso|[Aa]lgoritmo/, longer_alt: Identifier });
const FinProceso = createToken({ name: "FinProceso", pattern: /[Ff]in[Pp]roceso|[Ff]in[Aa]lgoritmo/, longer_alt: Identifier });
const Definir = createToken({ name: "Definir", pattern: /[Dd]efinir/, longer_alt: Identifier });
const Como = createToken({ name: "Como", pattern: /[Cc]omo/, longer_alt: Identifier });
const Leer = createToken({ name: "Leer", pattern: /[Ll]eer/, longer_alt: Identifier });
const Escribir = createToken({ name: "Escribir", pattern: /[Ee]scribir/, longer_alt: Identifier });
const Si = createToken({ name: "Si", pattern: /[Ss]i(?![Nn]o)/, longer_alt: Identifier });
const Entonces = createToken({ name: "Entonces", pattern: /[Ee]ntonces/, longer_alt: Identifier });
const SiNo = createToken({ name: "SiNo", pattern: /[Ss]i[Nn]o/, longer_alt: Identifier });
const FinSi = createToken({ name: "FinSi", pattern: /[Ff]in[Ss]i/, longer_alt: Identifier });
const Mientras = createToken({ name: "Mientras", pattern: /[Mm]ientras/, longer_alt: Identifier });
const Hacer = createToken({ name: "Hacer", pattern: /[Hh]acer/, longer_alt: Identifier });
const FinMientras = createToken({ name: "FinMientras", pattern: /[Ff]in[Mm]ientras/, longer_alt: Identifier });
const Verdadero = createToken({ name: "Verdadero", pattern: /[Vv]erdadero/, longer_alt: Identifier });
const Falso = createToken({ name: "Falso", pattern: /[Ff]also/, longer_alt: Identifier });
const Y = createToken({ name: "Y", pattern: /[Yy]/, longer_alt: Identifier });
const O = createToken({ name: "O", pattern: /\b[Oo]\b/, longer_alt: Identifier });
const No = createToken({ name: "No", pattern: /\b[Nn][Oo]\b/, longer_alt: Identifier });

// Operators
const Arrow = createToken({ name: "Arrow", pattern: /<-/ });
const LessEq = createToken({ name: "LessEq", pattern: /<=/ });
const GreaterEq = createToken({ name: "GreaterEq", pattern: />=/ });
const NotEq = createToken({ name: "NotEq", pattern: /<>/ });
const Less = createToken({ name: "Less", pattern: /</ });
const Greater = createToken({ name: "Greater", pattern: />/ });
const Eq = createToken({ name: "Eq", pattern: /=/ });
const Plus = createToken({ name: "Plus", pattern: /\+/ });
const Minus = createToken({ name: "Minus", pattern: /-/ });
const Star = createToken({ name: "Star", pattern: /\*/ });
const Slash = createToken({ name: "Slash", pattern: /\// });
const Caret = createToken({ name: "Caret", pattern: /\^/ });
const LParen = createToken({ name: "LParen", pattern: /\(/ });
const RParen = createToken({ name: "RParen", pattern: /\)/ });
const Comma = createToken({ name: "Comma", pattern: /,/ });
const Semicolon = createToken({ name: "Semicolon", pattern: /;/, group: Lexer.SKIPPED });

const allTokens = [
  WhiteSpace, LineComment, BlockComment,
  // Keywords before Identifier
  FinProceso, Proceso,
  FinSi, SiNo, Si, Entonces,
  FinMientras, Mientras, Hacer,
  Definir, Como,
  Leer, Escribir,
  Verdadero, Falso,
  No,
  // Identifiers
  Identifier,
  // Literals
  StringLiteral, NumberLiteral,
  // Multi-char operators first
  Arrow, LessEq, GreaterEq, NotEq,
  Less, Greater, Eq,
  Plus, Minus, Star, Slash, Caret,
  LParen, RParen, Comma, Semicolon,
  Y, O,
];

const PseIntLexer = new Lexer(allTokens);

// ─── Parser ───────────────────────────────────────────────────────────────────
class PseIntParser extends EmbeddedActionsParser {
  constructor() {
    super(allTokens, { recoveryEnabled: true });
    this.performSelfAnalysis();
  }

  program = this.RULE("program", (): AstProgram => {
    let name = "";
    this.OR([
      { ALT: () => { this.CONSUME(Proceso); name = this.CONSUME(Identifier).image; } },
    ]);
    const body = this.SUBRULE(this.stmtList);
    this.OR1([
      { ALT: () => this.CONSUME(FinProceso) },
    ]);
    return { name, body };
  });

  stmtList = this.RULE("stmtList", (): AstStatement[] => {
    const stmts: AstStatement[] = [];
    this.MANY(() => {
      const s = this.SUBRULE(this.statement);
      if (s) stmts.push(s);
    });
    return stmts;
  });

  statement = this.RULE("statement", (): AstStatement => {
    return this.OR([
      { ALT: () => this.SUBRULE(this.defineStmt) },
      { ALT: () => this.SUBRULE(this.readStmt) },
      { ALT: () => this.SUBRULE(this.writeStmt) },
      { ALT: () => this.SUBRULE(this.ifStmt) },
      { ALT: () => this.SUBRULE(this.whileStmt) },
      { ALT: () => this.SUBRULE(this.assignStmt) },
    ]) as AstStatement;
  });

  defineStmt = this.RULE("defineStmt", () => {
    this.CONSUME(Definir);
    const name = this.CONSUME(Identifier).image;
    this.CONSUME(Como);
    const varType = this.CONSUME1(Identifier).image;
    return { kind: "define" as const, name, varType };
  });

  readStmt = this.RULE("readStmt", () => {
    this.CONSUME(Leer);
    const variable = this.CONSUME(Identifier).image;
    return { kind: "read" as const, variable };
  });

  writeStmt = this.RULE("writeStmt", () => {
    this.CONSUME(Escribir);
    const expression = this.SUBRULE(this.exprList);
    return { kind: "write" as const, expression };
  });

  assignStmt = this.RULE("assignStmt", () => {
    const variable = this.CONSUME(Identifier).image;
    this.CONSUME(Arrow);
    const expression = this.SUBRULE(this.expr);
    return { kind: "assign" as const, variable, expression };
  });

  ifStmt = this.RULE("ifStmt", () => {
    this.CONSUME(Si);
    const condition = this.SUBRULE(this.expr);
    this.CONSUME(Entonces);
    const thenBody = this.SUBRULE(this.stmtList);
    let elseBody: AstStatement[] = [];
    this.OPTION(() => {
      this.CONSUME(SiNo);
      elseBody = this.SUBRULE1(this.stmtList);
    });
    this.CONSUME(FinSi);
    return { kind: "if" as const, condition, then: thenBody, else: elseBody };
  });

  whileStmt = this.RULE("whileStmt", () => {
    this.CONSUME(Mientras);
    const condition = this.SUBRULE(this.expr);
    this.CONSUME(Hacer);
    const body = this.SUBRULE(this.stmtList);
    this.CONSUME(FinMientras);
    return { kind: "while" as const, condition, body };
  });

  // Expression list (for Escribir which can have multiple args)
  exprList = this.RULE("exprList", (): string => {
    const parts: string[] = [];
    parts.push(this.SUBRULE(this.expr));
    this.MANY(() => {
      this.CONSUME(Comma);
      parts.push(this.SUBRULE1(this.expr));
    });
    return parts.join(", ");
  });

  // Simple expression parser that captures tokens as string
  expr = this.RULE("expr", (): string => {
    return this.SUBRULE(this.logicalExpr);
  });

  logicalExpr = this.RULE("logicalExpr", (): string => {
    let left = this.SUBRULE(this.relationalExpr);
    this.MANY(() => {
      const op = this.OR([
        { ALT: () => this.CONSUME(Y).image },
        { ALT: () => this.CONSUME(O).image },
      ]);
      const right = this.SUBRULE1(this.relationalExpr);
      left = `${left} ${op} ${right}`;
    });
    return left;
  });

  relationalExpr = this.RULE("relationalExpr", (): string => {
    let left = this.SUBRULE(this.addExpr);
    this.OPTION(() => {
      const op = this.OR([
        { ALT: () => this.CONSUME(LessEq).image },
        { ALT: () => this.CONSUME(GreaterEq).image },
        { ALT: () => this.CONSUME(NotEq).image },
        { ALT: () => this.CONSUME(Less).image },
        { ALT: () => this.CONSUME(Greater).image },
        { ALT: () => this.CONSUME(Eq).image },
      ]);
      const right = this.SUBRULE1(this.addExpr);
      left = `${left} ${op} ${right}`;
    });
    return left;
  });

  addExpr = this.RULE("addExpr", (): string => {
    let left = this.SUBRULE(this.mulExpr);
    this.MANY(() => {
      const op = this.OR([
        { ALT: () => this.CONSUME(Plus).image },
        { ALT: () => this.CONSUME(Minus).image },
      ]);
      const right = this.SUBRULE1(this.mulExpr);
      left = `${left} ${op} ${right}`;
    });
    return left;
  });

  mulExpr = this.RULE("mulExpr", (): string => {
    let left = this.SUBRULE(this.unaryExpr);
    this.MANY(() => {
      const op = this.OR([
        { ALT: () => this.CONSUME(Star).image },
        { ALT: () => this.CONSUME(Slash).image },
        { ALT: () => this.CONSUME(Caret).image },
      ]);
      const right = this.SUBRULE1(this.unaryExpr);
      left = `${left} ${op} ${right}`;
    });
    return left;
  });

  unaryExpr = this.RULE("unaryExpr", (): string => {
    return this.OR([
      { ALT: () => {
        const op = this.CONSUME(No).image;
        const val = this.SUBRULE(this.primaryExpr);
        return `${op} ${val}`;
      }},
      { ALT: () => {
        this.CONSUME(Minus);
        const val = this.SUBRULE1(this.primaryExpr);
        return `-${val}`;
      }},
      { ALT: () => this.SUBRULE2(this.primaryExpr) },
    ]);
  });

  primaryExpr = this.RULE("primaryExpr", (): string => {
    return this.OR([
      { ALT: () => {
        this.CONSUME(LParen);
        const inner = this.SUBRULE(this.expr);
        this.CONSUME(RParen);
        return `(${inner})`;
      }},
      { ALT: () => this.CONSUME(StringLiteral).image },
      { ALT: () => this.CONSUME(NumberLiteral).image },
      { ALT: () => this.CONSUME(Verdadero).image },
      { ALT: () => this.CONSUME(Falso).image },
      { ALT: () => this.CONSUME(Identifier).image },
    ]);
  });
}

const parser = new PseIntParser();

export function parsePseudocode(input: string): ParseResult<AstProgram> {
  const lexResult = PseIntLexer.tokenize(input);
  parser.input = lexResult.tokens;

  const ast = parser.program();
  const errors = [
    ...lexResult.errors.map((e) => ({
      message: e.message,
      line: e.line ?? 1,
      column: e.column ?? 1,
      length: e.length,
    })),
    ...parser.errors.map((e) => ({
      message: e.message,
      line: e.token?.startLine ?? 1,
      column: e.token?.startColumn ?? 1,
      length: (e.token?.endOffset ?? 0) - (e.token?.startOffset ?? 0) + 1,
    })),
  ];

  return { ast: errors.length === 0 ? ast : undefined, errors };
}
