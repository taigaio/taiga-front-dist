var Promise = require("bluebird");
var fs = require("fs");
var delAsync = Promise.promisify(require("del"));
var exec = Promise.promisify(require('child_process').exec);
var ncp = Promise.promisify(require('ncp').ncp);

var local = 'tmp';
var repo = 'https://github.com/taigaio/taiga-front';

var params = process.argv.slice(2);

if (params.length !== 2) {
    throw "Github user & password rerquired";
}

var action = (function cloneOrPull(){
    var cloned = fs.existsSync(local);

    if (cloned) {
        action = 'cd ' + local + ' && git pull';
    } else {
        action = 'git clone ' + repo + ' ' + local;
    }

    return action;
}())

exec(action)
    .then(function() {
        //compile taiga
        return exec('cd ' + local + ' && npm install && bower install && gulp deploy');
    })
    .then(function() {
        //remove old dist
        return delAsync('dist');
    })
    .then(function() {
        //copy new dist
        return ncp(local + '/dist/', 'dist');
    })
    .then(function() {
        //get last commit id
        return exec('cd ' + local + ' && git rev-parse HEAD');
    })
    .then(function(lastCommitId) {
        //commit
        lastCommitId = lastCommitId[0].trim();

        return exec('git add -A && git commit -am "' + lastCommitId + '"');
    })
    .then(function() {
        //push
        return exec('git push --repo https://' + params[0] + ':' + params[1] + '@github.com:taigaio/taiga-front-dist.git master');
    })
    .done();
