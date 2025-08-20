/** biome-ignore-all lint/suspicious/noConsole: needed, yo */

// biome-ignore lint/correctness/noNodejsModules: backend, all
import process from "node:process";
import { divide } from "#/math/advanced-math";
import { add } from "#/math/basic-math";

const sum = add(1, 2);
console.log(`1 + 2 = ${sum}`);

const value = 4;
const by = 0;
const div = divide(value, by);
if (div.error) {
  console.error(div.error.message);
  process.exit(1);
}

console.log(`4 / ${by} = ${div.value}`);
