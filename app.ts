import * as path from 'path';
import * as fs from 'fs';
const exec = require('child_process').exec;
import * as _ from 'lodash';
import whiten from 'whiten'

const whitenPromise = (dependenciesArr: string[]) =>
	new Promise((resolve, reject) => {
		whiten(dependenciesArr, 'npm', (err, tar, cb) => {
			if (err) {
				reject(err)
			}

			let name = dependenciesArr.join(' ').replace(/\//g, '-');
			name = name ? name : path.basename(process.cwd());
			tar.pipe(fs.createWriteStream(path.join(process.cwd(), 'downloads/' + name + '.tar'))).on('finish', () => {
				cb();
				resolve('Done')
			});
		})
	})

const downloadChunksArray = async (chunksArray: string[][]) => {
	for(let chunk of chunksArray) {
		console.log('Downloading ' + chunk.join(' '))
		await whitenPromise(chunk)
	}
}
const splitToChunks = (dependencies: string[], size = 6) => {
	return _.chunk(dependencies, size)
}

const downloadDependencies = (dependencies: string[]) => 
	downloadChunksArray(splitToChunks(dependencies))


let dependencies = Object.keys(require('./json-to-download/package.json').dependencies)
let devDependencies = Object.keys(require('./json-to-download/package.json').devDependencies)

downloadDependencies(dependencies)
	.then(_ => {
		console.log('Done downloading dependencies')
	})
	.then(_ => downloadDependencies(devDependencies))
	.then(_ => {
		console.log('Done downloading dev dependencies')
	})
	.catch(err => {
		console.log(err)
	})