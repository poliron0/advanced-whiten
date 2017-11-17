const exec = require('child_process').exec;
let dependencies = Object.keys(require('./package.json').dependencies);
let dependenciesString = dependencies.toString().replace(/,/g, ' ');
console.log(dependenciesString);
const whitenPromise = () => new Promise((resolve, reject) => {
    exec('whiten ' + dependenciesString, (error, stdout, stderr) => {
        if (error || stderr) {
            reject(error + stderr);
        }
        else {
            resolve(stdout);
        }
    });
});
whitenPromise().then(result => {
    console.log(result);
});
