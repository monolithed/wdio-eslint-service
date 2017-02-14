'use strict';

let path = require('path');
let merge = require('deepmerge');
let glob = require('glob');
let Log = require('tir');
let { execSync } = require('child_process');
let { Readable } = require('stream');
let { CLIEngine: ESLint } = require('eslint');

module.exports = {
	onPrepare (config) {
		let options = merge({
			files: [],
			format: 'node_modules/eslint-friendly-formatter',
			extensions: ['.js']
		}, config.eslintOptions);

		let { files, diff, cache, fix, format, extensions } = options;

		// Lets' use Git!
		if (cache) {
			try {
				files = execSync('git diff --relative --name-only --diff-filter=AM HEAD', {
					encoding: 'utf8'
				});

				files = files.split(/\n/);
			}
			catch (error) {
				Log.info('ESLint: nothing to validate');
			}
		}

		// Skip whitespaces and unwanted extensions
		// See https://github.com/eslint/eslint/issues/7939
		files = files.filter(file => {
			let { ext } = path.parse(file);

			return file.trim() && extensions.includes(ext) && !/\.eslintrc\.js$/.test(file);
		});

		if (!files) {
			return 0;
		}

		let globFiles = [];

		// Let's use a glob-notation
		for (let pattern of files) {
			globFiles.push(...glob.sync(pattern, { cache: true }));
		}

		// Make sure we have unique file names
		files = [...new Set(globFiles)];

		// Exclude custom options
		delete options.files;

		let linter = new ESLint(options);
		let report = linter.executeOnFiles(files);

		// Let's fix your warnings
		if (fix) {
			ESLint.outputFixes(report);
		}

		let formatter = linter.getFormatter(format);

		return new Promise((resolve, reject) => {
			let stream = new Readable();

			stream.on('end', () => {
				if (report.errorCount > 0) {
					Log.error('ESLint: please fix your errors to continue.\n');

					process.exit(-1);
				}

				resolve(report);
			});

			let ln = '\n'.repeat(3);

			stream.push(formatter(report.results));
			stream.push(ln);
			stream.push(null);
			stream.pipe(process.stdout);
		});
	},

	onComplete () {
		if (this.process) {
			this.process.kill();
		}
	}
};
