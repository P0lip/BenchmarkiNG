import typescript from '@alexlur/rollup-plugin-typescript';

export default {
  dest: 'src/assets/natives.js',
  entry: 'src/app/utils/natives.ts',
  moduleName: 'natives',
  format: 'iife',
  sourceMap: false,
  plugins: [
    typescript(),
  ],
  acorn: {
    allowReserved: true,
    ecmaVersion: 8,
  },
};
