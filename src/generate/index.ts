import { JsAstNode } from '../ast';
import { getNode } from './genCode';

export interface GenerateResult {
  code: string;
}

export interface GenerateContext {
  code: string;
  push(code: string): void;
  currentIndent: number;
  newLine(): void;
  indent(): void;
  deIndent(): void;
}
export function generate(root: JsAstNode): GenerateResult {
  const context = {
    code: '',
    push(code: string) {
      context.code += code;
    },
    currentIndent: 0,
    newLine() {
      context.code += '\n' + `  `.repeat(context.currentIndent);
    },
    indent() {
      context.currentIndent++;
      context.newLine();
    },
    deIndent() {
      context.currentIndent--;
      context.newLine();
    },
  };
  getNode(root, context);
  return {
    code: context.code,
  };
}
