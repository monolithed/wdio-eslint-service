# wdio-eslint-service

> A WDIO service for ESLint 

### Installation

```
npm install wdio-eslint-service --save
```

### Usage

#### wdio.config.js

```js
{
	services: [
		'eslint'
	],

	eslintOptions: {
		files: ['**/*.js']
	}
};
```


#### Options

##### Custom options

* **cache** — Only check changed files. In additional, we see your diff (for Git repositories).
* **files** — This option allows you to specify which files will be used.

##### Standard options

* **extensions** — Specify JavaScript / Typescript file extensions. Default: `.js`.
* **format** — Use a specific output format. Default: `node_modules/eslint-friendly-formatter`

In additional you can use all [options and rules](http://eslint.org/docs/developer-guide/nodejs-api) are available in ESLint. 


#### TypeScript

Make sure you already have the following dependencies: 

**package.json**

```json
{
	"typescript": "^2.1.5",
	"eslint-plugin-typescript": "^0.1.0",
	"typescript-eslint-parser": "^1.0.3"
}
```

**wdio.config.js**

```js
{
	extensions: ['.js', '.ts']
}
```

**eslintrc.js**

```js
{
	parser       : 'typescript-eslint-parser',
	plugins      : [ 'typescript' ],
	parserOptions: { 'sourceType': 'module' }
}
```

These options can be added to `wdio.config.js` as well.

