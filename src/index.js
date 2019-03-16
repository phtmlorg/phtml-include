import path from 'path';
import phtml from 'phtml';
import resolve from './lib/resolve';

export default new phtml.Plugin('phtml-include', opts => {
	const overrideCWD = Object(opts).cwd;
	const fileCache = {};

	return {
		afterElement (node, result) {
			if (node.name === 'include' && node.attrs.contains('src')) {
				const { constructor: Result } = result;
				const id = node.attrs.get('src');
				const cwd = overrideCWD || path.dirname(node.source.input.from);

				return resolve(id, cwd, fileCache).then(subresult => {
					const nodes = new Result(subresult.contents, { ...result, from: subresult.file }).root.nodes.slice(0);

					node.replaceWith(...nodes);

					return nodes.reduce(
						(childPromise, childNode) => childPromise.then(
							() => childNode.visit(result)
						),
						Promise.resolve()
					);
				});
			}
		}
	};
});
