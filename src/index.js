import path from 'path';
import phtml, { Result } from 'phtml';
import resolve from './lib/resolve';

export default new phtml.Plugin('phtml-include', opts => {
	const overrideCWD = Object(opts).cwd;
	const fileCache = {};

	return {
		Element(node) {
			if (node.name === 'include' && node.attrs.contains('src')) {
				const id = node.attrs.get('src');
				const cwd = overrideCWD || path.dirname(node.source.input.from);

				return resolve(id, cwd, fileCache).then(
					subresult => new Result(subresult.contents, { from: subresult.file }).root
				).then(moduleRoot => {
					const nodes = moduleRoot.nodes.slice(0);

					node.replaceWith(...nodes);

					return nodes.reduce(
						(childPromise, childNode) => childPromise.then(
							() => childNode.observe()
						),
						Promise.resolve()
					);
				});
			}
		}
	};
});
