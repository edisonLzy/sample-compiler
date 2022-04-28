import { dump, transform, compiler } from './src';
const template = `<div>
    <p> Vue </p>
    <p> React </p>
</div>
`;
const code = compiler(template);
console.log(code);
