/*
 * This source code is licensed under the terms of the
 * GNU Affero General Public License found in the LICENSE file in
 * the root directory of this source tree.
 *
 * Copyright (c) 2021-present Kaleidos INC
 */

import bluebird from "bluebird";
import * as fs from "fs";
import { exec } from 'child_process';
import { deleteAsync } from "del";

var _exec = bluebird.promisify(exec);
var _del = deleteAsync;

var local = 'tmp';
var repo = 'https://github.com/taigaio/taiga-front';

if (process.argv.length !== 3){
    console.log("¡Error!, call me with somethink like: \nnode dist.js branch_name");
    process.exit();
}

var branch = process.argv[2];

var synchRepoAction = (function cloneOrPull(){
    return fs.existsSync(local)
        ? 'git checkout ' + branch + ' && cd ' + local + ' && git checkout ' + branch + ' && git pull'
        : 'git checkout ' + branch + ' && git clone -b ' + branch + '  ' + repo + ' ' + local;
}())

_exec(synchRepoAction)
    .then(function() {
        console.log("remove old tmp dist")
        //remove old tmp dist
        return _del(local + '/dist');
    })
    .then(function() {
        console.log("compile taiga")
        //compile taiga
        return _exec('cd ' + local + ' && npm ci && npx gulp deploy');
    })
    .then(function() {
        console.log("remove old dist")
        //remove old dist
        return _del('dist');
    })
    .then(function() {
        console.log("copy new dist")
        //copy new dist
        return _exec('cp -r ' + local + '/dist/ dist');
    })
    .then(function() {
        console.log("get last commit id")
        //get last commit id
        return _exec('cd ' + local + ' && git rev-parse HEAD');
    })
    .then(function(lastCommitId) {
        console.log("commit")
        //commit
        return _exec('git add -A && git commit -am "' + lastCommitId.trim() + '"');
    })
    // .then(function() {
    //     console.log("push")
    //     //push
    //     return _exec('git push origin ' + branch);
    // })
    .done();
