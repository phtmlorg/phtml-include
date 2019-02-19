import path from 'path';
import phtml, { Result } from 'phtml';
import resolve from './lib/resolve';

export default new phtml.Plugin('phtml-include', opts => {
	const overrideCWD = Object(opts).cwd;
	const fileCache = {};

	const promises = new WeakMap();

	return {
		Element(node, result) {
			let promise = promises.get(result) || Promise.resolve();

			if (node.name === 'include' && node.attrs.contains('src')) {
				const id = node.attrs.get('src');
				const cwd = overrideCWD || path.dirname(node.source.input.from);
				const src = resolve(id, cwd, fileCache);

				promise = promise.then(
					() => src
				).then(
					subresult => new Result(subresult.contents, { from: subresult.file }).root
				).then(moduleRoot => {
					node.replaceWith(...moduleRoot.nodes);
				});

				promises.set(result, promise);
			}
		},
		Root(root, result) {
			return promises.get(result);
		}
	};
});
