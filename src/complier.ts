import { parse } from './parse';
import {
  transform,
  createStringLiteral,
  createCallExpression,
  createArrayExpression,
  createFunctionDecl,
} from './ast';
import { generate } from './generate';
export function compiler(input: string) {
  const template_ast = parse(input);
  transform(template_ast, [
    (node) => () => {
      if (node.type === 'Root') {
        const vNodeJSAst = node.children[0].jsNode;
        node.jsNode = createFunctionDecl(
          'render',
          [],
          [
            {
              type: 'ReturnStatement',
              return: vNodeJSAst,
            },
          ]
        );
      }
    },
    (node) => {
      if (node.type === 'Text') {
        node.jsNode = createStringLiteral(node.content);
      }
    },
    (node) => () => {
      // 确保所有的子节点都转换完毕
      if (node.type === 'Element') {
        // 创建 h('div')
        const callExp = createCallExpression('h', [
          createStringLiteral(node.tag),
        ]);
        // 处理参数 h('div',[jsNode])
        node.children.length === 1
          ? callExp.arguments.push(node.children[0].jsNode)
          : callExp.arguments.push(
              createArrayExpression(node.children.map((c) => c.jsNode))
            );
        node.jsNode = callExp;
        return;
      }
    },
  ]);
  const { code } = generate(template_ast.jsNode);
  return code;
}
