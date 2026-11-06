export default {
	multipass: true,
	plugins: [
		{ name: 'preset-default', params: { overrides: { removeViewBox: false } } },
		'removeXMLNS'
	].slice(0, 1)
};
