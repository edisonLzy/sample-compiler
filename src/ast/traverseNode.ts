import { ASTNode, RootNode } from '../parse';

type Transform = (node: ASTNode, ctx: Context) => ExitFn | void;
type ExitFn = () => void;
type MaybeNull<T> = T | null;
// 上下文: 某个范围内的全局变量
export interface Context {
  parent: MaybeNull<ASTNode>;
  childIndex: number;
  currentNode: MaybeNull<ASTNode>;
  replaceNode: (this: this, node: Exclude<ASTNode, RootNode>) => void;
  removeNode: (this: this) => void;
  nodeTransform: Transform[];
}
function setupContext<
  K extends Exclude<keyof Context, 'nodeTransform'>,
  V extends Context[K]
>(ctx: Context, key: K, val: V) {
  ctx[key] = val;
}

export function traverseNode(node: ASTNode, ctx: Context) {
  setupContext(ctx, 'currentNode', node);
  const { nodeTransform } = ctx;
  const exitFns: ExitFn[] = [];
  for (let i = 0; i < nodeTransform.length; i++) {
    const transform = nodeTransform[i];
    const exitFn = transform(node, ctx);
    if (exitFn) {
      exitFns.push(exitFn);
    }
    if (ctx.currentNode === null) {
      // 如果节点被移除则不再执行 transform
      return;
    }
  }
  if (node.type === 'Text') return;
  if (node.children) {
    node.children.forEach((child, idx) => {
      setupContext(ctx, 'parent', node);
      setupContext(ctx, 'childIndex', idx);
      traverseNode(child, ctx);
    });
  }
  // 在所有节点都 处理完成之后,flush exit fn
  while (exitFns.length) {
    const fn = exitFns.pop();
    if (fn) {
      fn();
    }
  }
}
