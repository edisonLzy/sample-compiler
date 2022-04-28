import { tokenize, parse, transform, compiler } from '../src/index';
import type { Token, RootNode } from '../src/index';
const template = `<div>
    <p> Vue </p>
    <p> React </p>
</div>
`;

describe('test compiler', () => {
  it('input to tokens', () => {
    const tokens = tokenize(template);
    const result: Token[] = [
      {
        type: 'tag',
        name: 'div',
      },
      {
        type: 'tag',
        name: 'p',
      },
      {
        type: 'text',
        content: 'Vue',
      },
      {
        type: 'tagEnd',
        name: 'p',
      },
      {
        type: 'tag',
        name: 'p',
      },
      {
        type: 'text',
        content: 'React',
      },
      {
        type: 'tagEnd',
        name: 'p',
      },
      {
        type: 'tagEnd',
        name: 'div',
      },
    ];
    expect(tokens).toEqual(result);
  });
  it('input to template ast', () => {
    const ast = parse(template);
    const result: RootNode = {
      type: 'Root',
      children: [
        {
          type: 'Element',
          tag: 'div',
          children: [
            {
              type: 'Element',
              tag: 'p',
              children: [
                {
                  type: 'Text',
                  content: 'Vue',
                },
              ],
            },
            {
              type: 'Element',
              tag: 'p',
              children: [
                {
                  type: 'Text',
                  content: 'React',
                },
              ],
            },
          ],
        },
      ],
    };
    expect(ast).toEqual(result);
  });
  it('transform node remove', () => {
    const ast = parse(template);
    const result: RootNode = {
      type: 'Root',
      children: [
        {
          type: 'Element',
          tag: 'div',
          children: [
            {
              type: 'Element',
              tag: 'p',
              children: [],
            },
            {
              type: 'Element',
              tag: 'p',
              children: [],
            },
          ],
        },
      ],
    };
    transform(ast, [
      function removeText(node, ctx) {
        if (node.type === 'Text') {
          ctx.removeNode();
        }
      },
    ]);
    expect(ast).toEqual(result);
  });
  it('transform node replace', () => {
    const ast = parse(template);
    const result: RootNode = {
      type: 'Root',
      children: [
        {
          type: 'Element',
          tag: 'div',
          children: [
            {
              type: 'Element',
              tag: 'span',
              children: [
                {
                  type: 'Text',
                  content: 'Vue',
                },
              ],
            },
            {
              type: 'Element',
              tag: 'span',
              children: [
                {
                  type: 'Text',
                  content: 'React',
                },
              ],
            },
          ],
        },
      ],
    };
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
    expect(ast).toEqual(result);
  });
  it('compiler to code', () => {
    const removeSpace = (s: string) => s.replace(/\s/g, '');
    let result = `function render (){
      return h('div',[h('p','Vue'),h('p','React')])
    }`;
    let code = compiler(template);
    [result, code] = [result, code].map(removeSpace);
    expect(result).toEqual(code);
  });
});
