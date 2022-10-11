import { defineConfig } from 'rollup';
import dts from 'rollup-plugin-dts';
import { defineRollupSwcOption, swc } from 'rollup-plugin-swc3';
import pkg from './package.json';

const { main, types } = pkg;
const input = 'src/remote-data.ts';

const config = defineConfig([
  {
    input,
    output: {
      file: main,
      format: 'es',
    },
    plugins: [swc(defineRollupSwcOption({}))]
  },
  {
    input,
    output: {
      file: types,
      format: 'es',
    },
    plugins: [dts()],
  },
]);
export default config;
