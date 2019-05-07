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

				return resolve(id, cwd, fileCache).then(
					subresult => {
						// add the result as a dependency message
						result.messages.push({
							type: 'dependency',
							plugin: 'phtml-include',
							file: subresult.file,
							parent: node.source.input.from,
						});

						// return new nodes from the resolved result
						return new Result(subresult.contents, { ...result, from: subresult.file }).root.nodes.slice(0);
					}
				).then(
					nodes => {
						// replace the <include/> with those results
						node.replaceWith(...nodes);

						return nodes.reduce(
							(childPromise, childNode) => childPromise.then(
								() => childNode.visit(result)
							),
							Promise.resolve()
						);
					},
					// handle errors resolve and result errors
					error => {
						// warn about the unloaded <include /> and forward the error message
						result.warn(Object(error).message || error, { node });

						// remove the unloaded <include />
						node.remove();
					}
				)
			}
		}
	};
});
