var path = require('path');
var yeoman = require('yeoman-generator');
var genUtils = require('../util.js');
var exec = require('exec');
var spawn = require('child_process').spawn;
var fs = require('fs');

module.exports = yeoman.generators.NamedBase.extend({

    start: function() {
        var $this = this;
        process.stdout.write('\n');
        process.stdout.write('Looking for ' + this.name + '\n');

        exec('bower info ' + this.name + ' -j', infoHandler);

        function infoHandler(err, out, code) {
            if(err instanceof Error) {
                throw err;
            }

            if(out) {
                $this.packageInfo = JSON.parse(out);
                process.stdout.write('Adding ' + $this.packageInfo.latest.name +
                                        ' version ' + $this.packageInfo.latest.version +
                                        ' to bower.json');
                process.stdout.write('\n');
            } else {
                process.stdout.write('The bower package ' + $this.name + ' was not found');
                process.stdout.write('\n');
            }

            // add dependency to bower.json
            var bowerJson = JSON.parse(fs.readFileSync('bower.json', 'utf8'));
            if(!bowerJson.dependencies) bowerJson.dependencies = {};
            bowerJson.dependencies[$this.packageInfo.latest.name] = $this.packageInfo.latest.version;
            fs.writeFileSync('bower.json', JSON.stringify(bowerJson, null, 4));

            // run bower install
            process.stdout.write('\n');
            process.stdout.write('Running bower install');
            process.stdout.write('\n');
            var bi = spawn('bower', ['install']);
            bi.stdout.on('data', function (data) {
                process.stdout.write(data);
            });

            bi.stderr.on('data', function (data) {
                process.stderr.write(data);
            });

            bi.on('exit', bowerInstallHandler);
        }

        function bowerInstallHandler(code) {
            process.stdout.write('bower install complete');
            process.stdout.write('\n');
            process.stdout.write('\n');


            var indexFilePath = 'server/views/index.html';

            process.stdout.write('Adding script reference to ' + indexFilePath);
            process.stdout.write('\n');

            var b = '<!-- bower -->';
            var e = '<!-- endbower -->';
            var indexHtml = fs.readFileSync(indexFilePath, 'utf8');
            var m = genUtils.matchBetween(indexHtml, b, e).matches[0];
            var currentBlock = m[0];
            var currentScripts = m[1] || '';

            var newScriptSrc = '/bower_components/' +
                                    $this.packageInfo.latest.name + '/' +
                                    $this.packageInfo.latest.main;
            var newScript = '<script src="' + newScriptSrc + '"></script>';

            var scripts = genUtils
                            .matchBetween(currentScripts, '<script', '<\\/script>')
                            .values;

            var scriptExists = false;
            for(var i in scripts) {
                if(scripts[i].indexOf(newScriptSrc) >= 0) {
                    scriptExists = true;
                    break;
                }
            }

            if(scriptExists) {
                process.stdout.write('Script reference already exists');
                process.stdout.write('\n');
            } else {
                scripts.push(newScript);

                var newBlock = b + '\n        ';
                for(var i in scripts) {
                    newBlock += scripts[i] + '\n        ';
                }
                newBlock += e;

                indexHtml = indexHtml.replace(currentBlock, newBlock);
                fs.writeFileSync(indexFilePath, indexHtml);
            }

            process.stdout.write('\n');
            process.stdout.write('done!');
            process.stdout.write('\n');
            process.stdout.write('\n');

        }

    }

});
