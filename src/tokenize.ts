import { close_slash_token, open_tag_token, close_tag_token } from './constant';
import { isAlpha } from './utils';
// 有限状态机: 每种状态只关注自己的逻辑处理和状态转移
// 分词
export enum State {
  Initial = 1,
  TagOpen,
  TagName,
  Text,
  TagEnd,
  TagEndName,
}
export interface ElementToken {
  type: 'tag' | 'tagEnd';
  name: string;
}
export interface TextToken {
  type: 'text';
  content: string;
}
export type Token = ElementToken | TextToken;

export function tokenize(input: string) {
  const tokens: Token[] = [];
  if (!input) return tokens;
  let str = input;
  let current_state = State.Initial;
  const chars: string[] = [];
  while (str) {
    const char = str[0];
    if (char === ' ' || char === '\n') {
      str = str.slice(1);
      continue;
    }
    switch (current_state) {
      case State.Initial:
        if (char === open_tag_token) {
          current_state = State.TagOpen;
          str = str.slice(1);
        } else if (isAlpha(char)) {
          current_state = State.Text;
          chars.push(char);
          str = str.slice(1);
        }
        break;
      case State.TagOpen:
        if (isAlpha(char)) {
          current_state = State.TagName;
          chars.push(char);
          str = str.slice(1);
        } else if (char === close_slash_token) {
          current_state = State.TagEnd;
          str = str.slice(1);
        }
        break;
      case State.TagName:
        if (isAlpha(char)) {
          chars.push(char);
          str = str.slice(1);
        } else if (char === close_tag_token) {
          current_state = State.Initial;
          // collection a tag token
          const token: Token = {
            type: 'tag',
            name: chars.join(''),
          };
          chars.length = 0;
          tokens.push(token);
          str = str.slice(1);
        }
        break;
      case State.Text:
        if (isAlpha(char)) {
          chars.push(char);
          str = str.slice(1);
        } else if (char === open_tag_token) {
          current_state = State.TagOpen;
          // collection a text token
          const token: Token = {
            type: 'text',
            content: chars.join(''),
          };
          tokens.push(token);
          chars.length = 0;
          str = str.slice(1);
        }
        break;
      case State.TagEnd:
        if (isAlpha(char)) {
          current_state = State.TagEndName;
          chars.push(char);
          str = str.slice(1);
        }
        break;
      case State.TagEndName:
        if (isAlpha(char)) {
          chars.push(char);
          str = str.slice(1);
        } else if (char === close_tag_token) {
          current_state = State.Initial;
          const token: Token = {
            type: 'tagEnd',
            name: chars.join(''),
          };
          chars.length = 0;
          tokens.push(token);
          str = str.slice(1);
        }
        break;
    }
  }
  return tokens;
}
