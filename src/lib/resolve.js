import { readFile } from 'fs';
import { join, sep } from 'path';

/* Resolve the location of a file within `url(id)` from `cwd`
/* ========================================================================== */

export default function resolve(id, rawcwd, rawcache) {
	const cache = Object(rawcache);

	// if `id` starts with `/` then `cwd` is the filesystem root
	const cwd = starts_with_root(id) ? '' : rawcwd;

	// resolve as a file using `cwd/id` as `file`
	return resolve_as_file(join(cwd, id), cache)
	// otherwise, resolve as a directory using `cwd/id` as `dir`
	.catch(() => resolve_as_directory(join(cwd, id), cache))
	// otherwise, if `id` does not begin with `/`, `./`, or `../`
	.catch(() => !starts_with_relative(id)
		// resolve as a module using `cwd` and `id`
		? resolve_as_module(cwd, id, cache)
		: Promise.reject()
	)
	// otherwise, throw `"HTML not found"`
	.catch(() => Promise.reject(new Error('HTML not found')));
}

function resolve_as_file(file, cache) {
	// resolve `file` as the file
	return file_contents(file, cache)
	// otherwise, resolve `file.html` as the file
	.catch(() => file_contents(`${file}.html`, cache));
}

function resolve_as_directory(dir, cache) {
	// resolve the JSON contents of `dir/package.json` as `pkg`
	return json_contents(dir, cache).then(
		// if `pkg` has a `html` field
		pkg => 'html' in pkg
			// resolve `dir/pkg.html` as the file
			? file_contents(join(dir, pkg.html), cache)
		// otherwise, resolve `dir/index.html` as the file
		: file_contents(join(dir, 'index.html'), cache)
	);
}

function resolve_as_module(cwd, id, cache) {
	// for each `dir` in the node modules directory using `cwd`
	return node_modules_dirs(cwd).reduce(
		(promise, dir) => promise.catch(
			// resolve as a file using `dir/id` as `file`
			() => resolve_as_file(join(dir, id), cache)
			// otherwise, resolve as a directory using `dir/id` as `dir`
			.catch(() => resolve_as_directory(join(dir, id), cache))
		),
		Promise.reject()
	);
}

function node_modules_dirs(cwd) {
	// segments is `cwd` split by `/`
	const segments = cwd.split(sep);

	// `count` is the length of segments
	let count = segments.length;

	// `dirs` is an empty list
	const dirs = [];

	// while `count` is greater than `0`
	while (count > 0) {
		// if `segments[count]` is not `node_modules`
		if (segments[count] !== 'node_modules') {
			// push a new path to `dirs` as the `/`-joined `segments[0 - count]` and `node_modules`
			dirs.push(
				join(segments.slice(0, count).join('/') || '/', 'node_modules')
			);
		}

		// `count` is `count` minus `1`
		--count;
	}

	// return `dirs`
	return dirs;
}

/* Additional tooling
/* ========================================================================== */

function file_contents(file, cache) {
	cache[file] = cache[file] || new Promise(
		(resolvePromise, rejectPromise) => readFile(file, 'utf8', (error, contents) => error
			? rejectPromise(error)
			: resolvePromise({
				file,
				contents
			})
		)
	);

	return cache[file];
}

function json_contents(dir, cache) {
	const file = join(dir, 'package.json');

	return file_contents(file, cache).then(
		({ contents }) => JSON.parse(contents)
	);
}

function starts_with_root(id) {
	return /^\//.test(id);
}

function starts_with_relative(id) {
	return /^\.{0,2}\//.test(id);
}
