var Promise = require("bluebird");
var fs = require("fs");
var delAsync = Promise.promisify(require("del"));
var exec = Promise.promisify(require('child_process').exec);
var ncp = Promise.promisify(require('ncp').ncp);

var local = 'tmp';
var repo = 'https://github.com/taigaio/taiga-front';

if (process.argv.length !== 3){
    console.log("¡Error!, call me with somethink like: \nnode dist.js branch_name");
    process.exit();
}

var branch = process.argv[2];

var synchRepoAction = (function cloneOrPull(){
    var cloned = fs.existsSync(local);

    if (cloned) {
        action = 'git checkout ' + branch + '&& cd ' + local + ' && git checkout ' + branch + ' && git pull';
    } else {
        action = 'git checkout ' + branch + '&& git clone -b ' + branch + '  ' + repo + ' ' + local;
    }

    return action;
}())

exec(synchRepoAction)
    .then(function() {
        console.log("remove old tmp dist")
        //remove old tmp dist
        return delAsync(local + '/dist');
    })
    .then(function() {
        console.log("compile taiga")
        //compile taiga
        return exec('cd ' + local + ' && npm install && bower install && gulp deploy');
    })
    .then(function() {
        console.log("remove old dist")
        //remove old dist
        return delAsync('dist');
    })
    .then(function() {
        console.log("copy new dist")
        //copy new dist
        //return ncp(local + '/dist/', 'dist');
        return exec('cp -r ' + local + '/dist/ dist');
    })
    .then(function() {
        console.log("get last commit id")
        //get last commit id
        return exec('cd ' + local + ' && git rev-parse HEAD');
    })
    .then(function(lastCommitId) {
        console.log("commit")
        //commit
        lastCommitId = lastCommitId[0].trim();

        return exec('git add -A && git commit -am "' + lastCommitId + '"');
    })
    .then(function() {
        console.log("push")
        //push
        return exec('git push origin ' + branch);
    })
    .done();
