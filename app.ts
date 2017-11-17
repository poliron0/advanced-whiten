const exec = require('child_process').exec;
import * as _ from 'lodash'


const whitenPromise = (dependenciesString: string) =>
	new Promise((resolve, reject) => {
		exec('cd downloads && whiten ' + dependenciesString, (error, stdout, stderr) => {
			if (error || stderr) {
				reject(error + stderr)
			} else {
				resolve(stdout)
			}
		})
	})

const downloadDepString = async (depString: string) => {
	return whitenPromise(depString)
}

const downloadDepStringArray = async (depStringArr: string[]) => {
	for (let str of depStringArr) {
		console.log('Downloading ' + str)
		await downloadDepString(str)
	}
}

const toDepStringArray = (dependencies: string[], size = 1) => {
	let dependenciesChunks = _.chunk(dependencies, size)
	return dependenciesChunks.map(chunk => chunk.toString().replace(/,/g, ' '))
	
}
let dependencies = Object.keys(require('./json-to-download/package.json').dependencies)
let devDependencies = Object.keys(require('./json-to-download/package.json').devDependencies)

downloadDepStringArray(toDepStringArray(dependencies))
	.then(_ => {
		console.log('Done downloading dependencies')
	})
	.then(_ => downloadDepStringArray(toDepStringArray(devDependencies)))
	.then(_ => {
		console.log('Done downloading dev dependencies')
	})
	.catch(err => {
		console.log(err)
	})
