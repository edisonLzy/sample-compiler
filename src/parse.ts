import { tokenize } from './tokenize';

type Children = Array<ElementNode | TextNode>;

type OtherProps = {
  [k: string]: any;
};

export type RootNode = {
  type: 'Root';
  children: Children;
} & OtherProps;
export type ElementNode = {
  type: 'Element';
  tag: string;
  children: Children;
} & OtherProps;
export type TextNode = {
  type: 'Text';
  content: string;
} & OtherProps;
export type ASTNode = ElementNode | TextNode | RootNode;
export function parse(input: string) {
  const tokens = tokenize(input);
  const root: RootNode = {
    type: 'Root',
    children: [],
  };
  const elementStack: (RootNode | ElementNode)[] = [root];

  while (tokens.length) {
    const parent = elementStack.at(-1);
    const token = tokens[0];
    switch (token.type) {
      case 'tag':
        const element: ElementNode = {
          type: 'Element',
          tag: token.name,
          children: [],
        };
        parent?.children.push(element);
        elementStack.push(element);
        break;
      case 'text':
        const text: TextNode = {
          type: 'Text',
          content: token.content,
        };
        parent?.children.push(text);
        break;
      case 'tagEnd':
        elementStack.pop();
        break;
    }
    tokens.shift();
  }
  return root;
}
