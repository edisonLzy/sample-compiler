// all types for javascript
export function createStringLiteral(value: string) {
  return {
    type: 'StringLiteral' as const,
    value,
  };
}
export function createIdentifier(name: string) {
  return {
    type: 'Identifier' as const,
    name,
  };
}
export function createArrayExpression(element: any[]) {
  return {
    type: 'ArrayExpression' as const,
    element,
  };
}
export function createCallExpression(callee: string, params: any[]) {
  return {
    type: 'CallExpression' as const,
    callee: createIdentifier(callee),
    arguments: params,
  };
}
export function createFunctionDecl(id: string, params: any[], body: any[]) {
  return {
    type: 'FunctionDecl' as const,
    id: createIdentifier(id),
    params,
    body,
  };
}
export function createReturnStatement(r: any) {
  return {
    type: 'ReturnStatement' as const,
    return: r,
  };
}
export type JsAstNode = ReturnType<
  | typeof createFunctionDecl
  | typeof createCallExpression
  | typeof createArrayExpression
  | typeof createIdentifier
  | typeof createStringLiteral
  | typeof createReturnStatement
>;
