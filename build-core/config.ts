
export const SERVER_OUTPUT_MODULE_PATH_NAME = "__SSR_SERVER__";
export const CWD = process.cwd();
export const EXTERNAL_REACT = {
	react: {
		root: 'React',
		commonjs2: 'react',
		commonjs: 'react',
		amd: 'react'
	},
	'react-dom': {
		root: 'ReactDOM',
		commonjs2: 'react-dom',
		commonjs: 'react-dom',
		amd: 'react-dom'
	}
}
export const mode = 'production'; // production | development