import { GenerateContext } from '.';
import { JsAstNode } from '../ast';

type GenCodeResult<T> = {
  [k in T as `gen${k & string}`]: (
    node: JsAstNode,
    ctx: GenerateContext
  ) => void;
};

const genCode: GenCodeResult<JsAstNode['type']> = {
  genArrayExpression(node, ctx) {
    if (node.type === 'ArrayExpression') {
      const { push } = ctx;
      push(`[`);
      getNodeList(node.element, ctx);
      push(`]`);
    }
  },
  genFunctionDecl(node, ctx) {
    if (node.type === 'FunctionDecl') {
      const { push, indent, deIndent } = ctx;
      push(`function ${node.id.name} `);
      push(`(`);
      getNodeList(node.params, ctx);
      push(`)`);
      push(`{`);
      indent();
      node.body.forEach((n) => getNode(n, ctx));
      deIndent();
      push(`}`);
    }
  },
  genStringLiteral(node, { push }) {
    if (node.type === 'StringLiteral') {
      push(`'${node.value}'`);
    }
  },
  genCallExpression(node, ctx) {
    if (node.type === 'CallExpression') {
      const { push } = ctx;
      const { callee, arguments: args } = node;
      push(`${callee.name}(`);
      getNodeList(args, ctx);
      push(`)`);
    }
  },
  genIdentifier() {},
  genReturnStatement(node, ctx) {
    if (node.type === 'ReturnStatement') {
      const { push } = ctx;
      push(`return `);
      getNode(node.return, ctx);
    }
  },
};
function getNodeList(nodes: any[], context: GenerateContext) {
  const { push } = context;
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    getNode(node, context);
    if (i < nodes.length - 1) {
      push(`,`);
    }
  }
}

export function getNode(root: JsAstNode, context: GenerateContext) {
  const type = root.type;
  genCode[`gen${type}`](root, context);
}
