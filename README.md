# esbuild-plugin-native-css-module

Resolve `import ... with { type: css }` as instance of `CSSStyleSheet` in esbuild.
If css file linked via `<link rel="stylesheet" href="...">` it will be bundled using css loader.

## Install

```bash
npm i -D esbuild-plugin-native-css-module
```

## Usage

```js
import { build } from 'esbuild'
import nativeCSSModule from 'esbuild-plugin-native-css-module'

build({
  entryPoints: ['src/index.js'],
  bundle: true,
  outfile: 'dist/index.js',
  plugins: [nativeCSSModule()]
})
```

## Example

```js
import style from './style.css' with { type: css }

console.log(style instanceof CSSStyleSheet) // true
```