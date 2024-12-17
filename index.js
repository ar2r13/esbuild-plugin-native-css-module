import esbuild from 'esbuild'

import postcss from 'postcss'
import env from 'postcss-preset-env'
import atimport from 'postcss-import'
import cssnano from 'cssnano'

import { readFile } from 'fs/promises'
import { resolve } from 'path'

const module = code => `
const style = new CSSStyleSheet
style.replace(\`${code}\`)
export default style
`

const name = 'CSS module'
const filter = /\.css$/

export default config => ({
	name,
	setup (build) {
		const { minify } = build.initialOptions

		build.onLoad({ filter }, async ({ path: from, with: { type } }) => {
			const { code } = await readFile(from, 'utf-8').then(
				code => esbuild.transform(code, {
					loader: 'css', minify
				})
			)

			const plugins = [
				env({ 
					stage: 0, 
					browsers: 'safari 15',
					features: { 'cascade-layers': false }
				}),
				...config.plugins || []
			]

			if (type === 'css') plugins.unshift(atimport({
				resolve: async (id, resolveDir) => {
					if (id.startsWith('.')) return id

					const { path, errors = [] } = await build.resolve(id, { resolveDir, kind: 'import-statement' })
					if (errors.length) 
						throw new Error(errors[0].text)

					return path
				}
			}))
			if (minify) plugins.push(cssnano)

 			const { css } = await postcss(plugins).process(code, { from })
			
			if (type === 'css')
				return { 
					loader: 'js',
					contents: module(css),
				} 
			else 
				return { 
					loader: 'css',
					contents: css
				}
		})
	}
})