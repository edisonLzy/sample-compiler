import { parse, dump, transform } from './src';
const template = `<div>
    <p> Vue </p>
    <p> React </p>
</div>
`;
const ast = parse(template);
transform(ast, [
  function replace(node, ctx) {
    // replace p to span
    if (node.type === 'Element' && node.tag === 'p') {
      ctx.replaceNode({
        type: 'Element',
        tag: 'span',
        children: node.children,
      });
    }
  },
]);
dump(ast);
