import path from 'path';
import phtml, { Result } from 'phtml';
import resolve from './lib/resolve';

export default new phtml.Plugin('phtml-include', opts => {
	const overrideCWD = Object(opts).cwd;
	const fileCache = {};

	return root => {
		let promise = Promise.resolve();

		root.walk(node => {
			if (node.type === 'element' && node.name === 'include' && node.attrs.contains('src')) {
				const id = node.attrs.get('src');
				const cwd = overrideCWD || path.dirname(node.source.from);
				const src = resolve(id, cwd, fileCache);

				promise = promise.then(
					() => src
				).then(
					result => new Result(result.contents, { from: result.file }).root
				).then(moduleRoot => {
					node.replaceWith(...moduleRoot.nodes);
				});
			}
		});

		return promise;
	};
});
