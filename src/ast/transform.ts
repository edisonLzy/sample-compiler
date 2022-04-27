import { ASTNode } from '../parse';
import { traverseNode, Context } from './traverseNode';
export function transform(
  node: ASTNode,
  transform: Context['nodeTransform'] = []
) {
  const ctx: Context = {
    parent: null,
    childIndex: 0,
    currentNode: null,
    replaceNode(node) {
      if (this.parent?.type === 'Text') return node;
      if (this.parent && this.parent.children) {
        this.parent.children[this.childIndex] = node;
        this.currentNode = node;
      }
    },
    removeNode() {
      if (this.parent?.type === 'Text') return;
      if (this.parent && this.parent.children) {
        this.parent.children.splice(this.childIndex, 1);
        this.currentNode = null;
      }
    },
    nodeTransform: transform,
  };
  traverseNode(node, ctx);
}
