// ─────────────────────────────────────────────────────────
// Parser PSeInt – recursive-descent manual (sin Chevrotain)
// ─────────────────────────────────────────────────────────

export interface ParserError {
  message: string;
  line: number;
  column: number;
  length?: number;
}

// ── AST ──────────────────────────────────────────────────
export interface AstProgram {
  kind: "Program";
  name: string;
  body: AstStatement[];
}

export type AstNode = AstProgram | AstStatement;

export type AstStatement =
  | { kind: "Declare"; id: string; type: string }
  | { kind: "Read"; ids: string[] }
  | { kind: "Write"; expr: string }
  | { kind: "Assign"; id: string; expr: string }
  | {
      kind: "If";
      condition: string;
      thenBranch: AstStatement[];
      elseBranch: AstStatement[];
    }
  | { kind: "While"; condition: string; body: AstStatement[] }
  | {
      kind: "For";
      id: string;
      from: string;
      to: string;
      step: string;
      body: AstStatement[];
    }
  | { kind: "DoWhile"; condition: string; body: AstStatement[] };

export interface ParseResult {
  ast?: AstProgram;
  errors: ParserError[];
}

// ── Token types ──────────────────────────────────────────
type TType =
  | "KEYWORD"
  | "IDENTIFIER"
  | "NUMBER"
  | "STRING"
  | "BOOLEAN"
  | "ASSIGN"
  | "RELOP"
  | "ARITH"
  | "LPAREN"
  | "RPAREN"
  | "COMMA"
  | "SEMICOLON"
  | "NEWLINE"
  | "EOF";

interface Token {
  type: TType;
  value: string;
  line: number;
  column: number;
}

// Palabras clave (todo en minúsculas para comparar)
const KEYWORDS = new Set([
  "proceso",
  "finproceso",
  "algoritmo",
  "finalgoritmo",
  "definir",
  "como",
  "dimension",
  "leer",
  "escribir",
  "si",
  "entonces",
  "sino",
  "finsi",
  "mientras",
  "hacer",
  "finmientras",
  "para",
  "hasta",
  "con",
  "paso",
  "finpara",
  "repetir",
  "mientras que",
  "hasta que",
  "y",
  "o",
  "no",
  "mod",
  "verdadero",
  "falso",
  "entero",
  "real",
  "caracter",
  "cadena",
  "logico",
  "texto",
  "numero",
  "numerico",
]);

// ── Lexer ────────────────────────────────────────────────
function tokenize(input: string): { tokens: Token[]; errors: ParserError[] } {
  const tokens: Token[] = [];
  const errors: ParserError[] = [];
  let pos = 0;
  let line = 1;
  let col = 1;

  const len = input.length;
  const peek = () => (pos < len ? input[pos] : "");
  const advance = () => {
    const ch = input[pos++];
    if (ch === "\n") {
      line++;
      col = 1;
    } else {
      col++;
    }
    return ch;
  };

  while (pos < len) {
    const startLine = line;
    const startCol = col;
    const ch = peek();

    // Whitespace (sin newline)
    if (ch === " " || ch === "\t" || ch === "\r") {
      advance();
      continue;
    }

    // Newline
    if (ch === "\n") {
      advance();
      tokens.push({
        type: "NEWLINE",
        value: "\n",
        line: startLine,
        column: startCol,
      });
      continue;
    }

    // Comentarios: // hasta fin de línea
    if (ch === "/" && pos + 1 < len && input[pos + 1] === "/") {
      while (pos < len && peek() !== "\n") advance();
      continue;
    }

    // String literal
    if (ch === '"' || ch === "'") {
      const quote = ch;
      advance();
      let str = "";
      while (pos < len && peek() !== quote && peek() !== "\n") {
        if (peek() === "\\") {
          advance();
          str += advance();
        } else {
          str += advance();
        }
      }
      if (pos < len && peek() === quote) advance();
      else
        errors.push({
          message: "Cadena sin cerrar",
          line: startLine,
          column: startCol,
        });
      tokens.push({
        type: "STRING",
        value: `"${str}"`,
        line: startLine,
        column: startCol,
      });
      continue;
    }

    // Number
    if (
      isDigit(ch) ||
      (ch === "-" &&
        pos + 1 < len &&
        isDigit(input[pos + 1]) &&
        needsUnaryMinus(tokens))
    ) {
      let num = "";
      if (ch === "-") num += advance();
      while (pos < len && isDigit(peek())) num += advance();
      if (pos < len && peek() === ".") {
        num += advance();
        while (pos < len && isDigit(peek())) num += advance();
      }
      tokens.push({
        type: "NUMBER",
        value: num,
        line: startLine,
        column: startCol,
      });
      continue;
    }

    // <- (assign)
    if (ch === "<" && pos + 1 < len && input[pos + 1] === "-") {
      advance();
      advance();
      tokens.push({
        type: "ASSIGN",
        value: "<-",
        line: startLine,
        column: startCol,
      });
      continue;
    }

    // Relational operators (multi-char first)
    if (ch === "<" && pos + 1 < len && input[pos + 1] === ">") {
      advance();
      advance();
      tokens.push({
        type: "RELOP",
        value: "<>",
        line: startLine,
        column: startCol,
      });
      continue;
    }
    if (ch === "<" && pos + 1 < len && input[pos + 1] === "=") {
      advance();
      advance();
      tokens.push({
        type: "RELOP",
        value: "<=",
        line: startLine,
        column: startCol,
      });
      continue;
    }
    if (ch === ">" && pos + 1 < len && input[pos + 1] === "=") {
      advance();
      advance();
      tokens.push({
        type: "RELOP",
        value: ">=",
        line: startLine,
        column: startCol,
      });
      continue;
    }
    if (ch === "<") {
      advance();
      tokens.push({
        type: "RELOP",
        value: "<",
        line: startLine,
        column: startCol,
      });
      continue;
    }
    if (ch === ">") {
      advance();
      tokens.push({
        type: "RELOP",
        value: ">",
        line: startLine,
        column: startCol,
      });
      continue;
    }
    if (ch === "=") {
      advance();
      tokens.push({
        type: "RELOP",
        value: "=",
        line: startLine,
        column: startCol,
      });
      continue;
    }

    // Arithmetic
    if ("+-*/%^".includes(ch)) {
      advance();
      tokens.push({
        type: "ARITH",
        value: ch,
        line: startLine,
        column: startCol,
      });
      continue;
    }

    // Parens
    if (ch === "(") {
      advance();
      tokens.push({
        type: "LPAREN",
        value: "(",
        line: startLine,
        column: startCol,
      });
      continue;
    }
    if (ch === ")") {
      advance();
      tokens.push({
        type: "RPAREN",
        value: ")",
        line: startLine,
        column: startCol,
      });
      continue;
    }

    // Comma
    if (ch === ",") {
      advance();
      tokens.push({
        type: "COMMA",
        value: ",",
        line: startLine,
        column: startCol,
      });
      continue;
    }

    // Semicolon
    if (ch === ";") {
      advance();
      tokens.push({
        type: "SEMICOLON",
        value: ";",
        line: startLine,
        column: startCol,
      });
      continue;
    }

    // Identifier / Keyword
    if (isAlpha(ch)) {
      let word = "";
      while (pos < len && isAlphaNum(peek())) word += advance();

      const lower = word.toLowerCase();

      // "Mientras Que" / "Hasta Que" – look ahead for compound keyword
      if (lower === "mientras" || lower === "hasta") {
        const savedPos = pos;
        const savedLine = line;
        const savedCol = col;
        while (pos < len && (peek() === " " || peek() === "\t")) advance();
        let word2 = "";
        if (pos < len && isAlpha(peek())) {
          while (pos < len && isAlphaNum(peek())) word2 += advance();
          if (word2.toLowerCase() === "que") {
            tokens.push({
              type: "KEYWORD",
              value: lower + " que",
              line: startLine,
              column: startCol,
            });
            continue;
          }
        }
        // rollback
        pos = savedPos;
        line = savedLine;
        col = savedCol;
      }

      if (lower === "verdadero" || lower === "falso") {
        tokens.push({
          type: "BOOLEAN",
          value: word,
          line: startLine,
          column: startCol,
        });
      } else if (KEYWORDS.has(lower)) {
        tokens.push({
          type: "KEYWORD",
          value: lower,
          line: startLine,
          column: startCol,
        });
      } else {
        tokens.push({
          type: "IDENTIFIER",
          value: word,
          line: startLine,
          column: startCol,
        });
      }
      continue;
    }

    // Unknown character
    const bad = advance();
    errors.push({
      message: `Carácter inesperado: '${bad}'`,
      line: startLine,
      column: startCol,
      length: 1,
    });
  }

  tokens.push({ type: "EOF", value: "", line, column: col });
  return { tokens, errors };
}

function isDigit(c: string) {
  return c >= "0" && c <= "9";
}
function isAlpha(c: string) {
  return /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ_]$/.test(c);
}
function isAlphaNum(c: string) {
  return /^[\wÁÉÍÓÚÜÑáéíóúüñ]$/.test(c);
}
function needsUnaryMinus(tokens: Token[]): boolean {
  if (tokens.length === 0) return true;
  const last = tokens[tokens.length - 1];
  return (
    last.type === "ARITH" ||
    last.type === "RELOP" ||
    last.type === "ASSIGN" ||
    last.type === "LPAREN" ||
    last.type === "COMMA" ||
    last.type === "KEYWORD" ||
    last.type === "NEWLINE"
  );
}

// ── Recursive Descent Parser ─────────────────────────────
class Parser {
  private tokens: Token[];
  private pos = 0;
  private errors: ParserError[] = [];

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  private peek(): Token {
    return this.tokens[this.pos] ?? this.eof();
  }
  private eof(): Token {
    return { type: "EOF", value: "", line: 0, column: 0 };
  }

  private atKeyword(...keywords: string[]): boolean {
    const t = this.peek();
    if (t.type !== "KEYWORD") return false;
    return keywords.includes(t.value.toLowerCase());
  }

  private consume(type: TType, valueLower?: string): Token {
    const t = this.peek();
    if (
      t.type !== type ||
      (valueLower !== undefined && t.value.toLowerCase() !== valueLower)
    ) {
      this.error(
        `Se esperaba '${valueLower ?? type}' pero se encontró '${t.value || "fin de archivo"}'`,
        t,
      );
      return t;
    }
    this.pos++;
    return t;
  }

  private consumeKeyword(...options: string[]): Token {
    const t = this.peek();
    if (t.type !== "KEYWORD" || !options.includes(t.value.toLowerCase())) {
      this.error(
        `Se esperaba ${options.map((o) => `'${o}'`).join(" o ")} pero se encontró '${t.value || "fin de archivo"}'`,
        t,
      );
      return t;
    }
    this.pos++;
    return t;
  }

  private consumeIdentifier(): Token {
    return this.consume("IDENTIFIER");
  }

  private skipNewlines(): void {
    while (this.peek().type === "NEWLINE") this.pos++;
  }

  private error(message: string, token?: Token): void {
    const t = token ?? this.peek();
    this.errors.push({
      message,
      line: t.line,
      column: t.column,
      length: t.value.length || 1,
    });
  }

  // ── Program ────────────────────────────────────────────
  parse(): { ast?: AstProgram; errors: ParserError[] } {
    this.skipNewlines();
    this.consumeKeyword("proceso", "algoritmo");
    const nameTok = this.consumeIdentifier();
    this.skipNewlines();

    const body = this.parseStatements(["finproceso", "finalgoritmo"]);

    this.skipNewlines();
    this.consumeKeyword("finproceso", "finalgoritmo");

    if (this.errors.length > 0) {
      return { errors: this.errors };
    }

    return {
      ast: { kind: "Program", name: nameTok.value, body },
      errors: [],
    };
  }

  // ── Statements ─────────────────────────────────────────
  private parseStatements(stopKeywords: string[]): AstStatement[] {
    const stmts: AstStatement[] = [];

    while (true) {
      this.skipNewlines();
      const t = this.peek();

      if (t.type === "EOF") break;
      if (t.type === "KEYWORD" && stopKeywords.includes(t.value.toLowerCase()))
        break;

      const stmt = this.parseStatement();
      if (stmt) stmts.push(stmt);
      else {
        if (this.peek().type !== "EOF") {
          this.error(`Token inesperado: '${this.peek().value}'`, this.peek());
          this.pos++;
        } else break;
      }
    }

    return stmts;
  }

  private parseStatement(): AstStatement | null {
    const t = this.peek();

    if (t.type === "KEYWORD") {
      switch (t.value.toLowerCase()) {
        case "definir":
          return this.parseDeclare();
        case "leer":
          return this.parseRead();
        case "escribir":
          return this.parseWrite();
        case "si":
          return this.parseIf();
        case "mientras":
          return this.parseWhile();
        case "para":
          return this.parseFor();
        case "repetir":
          return this.parseDoWhile();
        default:
          return null;
      }
    }

    if (t.type === "IDENTIFIER") {
      return this.parseAssign();
    }

    return null;
  }

  // ── Definir ────────────────────────────────────────────
  private parseDeclare(): AstStatement {
    this.consumeKeyword("definir");
    const id = this.consumeIdentifier();
    this.consumeKeyword("como");
    const typeTok = this.peek();
    let typeStr: string;
    if (typeTok.type === "KEYWORD" || typeTok.type === "IDENTIFIER") {
      typeStr = typeTok.value;
      this.pos++;
    } else {
      typeStr = "Desconocido";
      this.error("Se esperaba un tipo de dato", typeTok);
    }
    return { kind: "Declare", id: id.value, type: typeStr };
  }

  // ── Leer ───────────────────────────────────────────────
  private parseRead(): AstStatement {
    this.consumeKeyword("leer");
    const ids: string[] = [];
    ids.push(this.consumeIdentifier().value);
    while (this.peek().type === "COMMA") {
      this.pos++;
      ids.push(this.consumeIdentifier().value);
    }
    return { kind: "Read", ids };
  }

  // ── Escribir ───────────────────────────────────────────
  private parseWrite(): AstStatement {
    this.consumeKeyword("escribir");
    const expr = this.collectExprUntilNewlineOrEOF();
    return { kind: "Write", expr };
  }

  // ── Assign ─────────────────────────────────────────────
  private parseAssign(): AstStatement {
    const id = this.consumeIdentifier();
    if (this.peek().type === "ASSIGN") {
      this.pos++;
    } else if (this.peek().type === "RELOP" && this.peek().value === "=") {
      this.pos++;
    } else {
      this.error(
        `Se esperaba '<-' o '=' después de '${id.value}'`,
        this.peek(),
      );
    }
    const expr = this.collectExprUntilNewlineOrEOF();
    return { kind: "Assign", id: id.value, expr };
  }

  // ── Si / Entonces / SiNo / FinSi ──────────────────────
  private parseIf(): AstStatement {
    this.consumeKeyword("si");
    const condition = this.collectExprUntilKeyword(["entonces"]);
    this.consumeKeyword("entonces");
    const thenBranch = this.parseStatements(["sino", "finsi"]);
    let elseBranch: AstStatement[] = [];
    this.skipNewlines();
    if (this.atKeyword("sino")) {
      this.pos++;
      elseBranch = this.parseStatements(["finsi"]);
    }
    this.skipNewlines();
    this.consumeKeyword("finsi");
    return { kind: "If", condition, thenBranch, elseBranch };
  }

  // ── Mientras / Hacer / FinMientras ─────────────────────
  private parseWhile(): AstStatement {
    this.consumeKeyword("mientras");
    const condition = this.collectExprUntilKeyword(["hacer"]);
    this.consumeKeyword("hacer");
    const body = this.parseStatements(["finmientras"]);
    this.skipNewlines();
    this.consumeKeyword("finmientras");
    return { kind: "While", condition, body };
  }

  // ── Para / Hasta / Con Paso / FinPara ──────────────────
  private parseFor(): AstStatement {
    this.consumeKeyword("para");
    const id = this.consumeIdentifier();
    if (this.peek().type === "ASSIGN") this.pos++;
    else if (this.peek().type === "RELOP" && this.peek().value === "=")
      this.pos++;
    else this.error(`Se esperaba '<-' después de '${id.value}'`);
    const fromExpr = this.collectExprUntilKeyword(["hasta"]);
    this.consumeKeyword("hasta");
    const toExpr = this.collectExprUntilKeyword(["con", "hacer"]);
    let step = "1";
    if (this.atKeyword("con")) {
      this.pos++;
      this.consumeKeyword("paso");
      step = this.collectExprUntilKeyword(["hacer"]);
    }
    this.consumeKeyword("hacer");
    const body = this.parseStatements(["finpara"]);
    this.skipNewlines();
    this.consumeKeyword("finpara");
    return {
      kind: "For",
      id: id.value,
      from: fromExpr,
      to: toExpr,
      step,
      body,
    };
  }

  // ── Repetir / Hasta Que ────────────────────────────────
  private parseDoWhile(): AstStatement {
    this.consumeKeyword("repetir");
    const body = this.parseStatements(["hasta que", "mientras que"]);
    this.skipNewlines();
    if (this.atKeyword("hasta que")) {
      this.pos++;
    } else if (this.atKeyword("mientras que")) {
      this.pos++;
    } else {
      this.error("Se esperaba 'Hasta Que' o 'Mientras Que'");
    }
    const condition = this.collectExprUntilNewlineOrEOF();
    return { kind: "DoWhile", condition, body };
  }

  // ── Expression collectors ──────────────────────────────
  private collectExprUntilNewlineOrEOF(): string {
    const parts: string[] = [];
    while (true) {
      const t = this.peek();
      if (t.type === "NEWLINE" || t.type === "EOF") break;
      parts.push(t.value);
      this.pos++;
    }
    return parts.join(" ").trim();
  }

  private collectExprUntilKeyword(stopKeywords: string[]): string {
    const parts: string[] = [];
    while (true) {
      const t = this.peek();
      if (t.type === "EOF") break;
      if (t.type === "NEWLINE") {
        this.pos++;
        continue;
      }
      if (t.type === "KEYWORD" && stopKeywords.includes(t.value.toLowerCase()))
        break;
      parts.push(t.value);
      this.pos++;
    }
    return parts.join(" ").trim();
  }
}

// ── Public API ───────────────────────────────────────────
export const parsePseudocode = (input: string): ParseResult => {
  const { tokens, errors: lexErrors } = tokenize(input);

  if (lexErrors.length > 0) {
    return { errors: lexErrors };
  }

  const parser = new Parser(tokens);
  return parser.parse();
};
