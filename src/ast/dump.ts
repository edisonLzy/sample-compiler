import { ASTNode } from '../parse';
export function dump(root: ASTNode, indent = 0) {
  const type = root.type;
  const desc =
    type === 'Root' ? '' : type === 'Element' ? root.tag : root.content;
  console.log(`${'-'.repeat(indent)}${type}:${desc}`);

  if (type === 'Text') {
    return;
  }
  if (root.children) {
    root.children.forEach((child) => dump(child, indent + 2));
  }
}
