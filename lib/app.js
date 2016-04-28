
var fs = require("fs");
var moment = require("moment");
var jsonfile = require('jsonfile');

var utils = require('./utils/utils');
var convertUtils = require('./utils/convert-utils');
var messageParser = require('./utils/messages');
var export_mysql = require('./utils/export_mysql');
var export_sqlite = require('./utils/export_sqlite');
var help = fs.readFileSync(__dirname +'/../assets/help.md', "utf8");
var static = require('node-static');
var open = require('open');
var http = require('http');
var mkdirp = require('mkdirp');  

var url = 'http://friendlines.dyndns.hu/link'

var port = process.env.PORT || 3331;

var httproot = __dirname + '/../'

console.log(help);
console.log('')
console.log('Checking for already converted files.')

var hasFilesAlready = false
// check if parsing has already happened, and either start conversion or
try {
    // check if a file exists, lol: http://stackoverflow.com/questions/4482686/check-synchronously-if-file-directory-exists-in-node-js
    fs.accessSync(httproot +'data/statlist.json', fs.F_OK)    
    console.log('Found converted files. Not running converter.')
    console.log('You can force new data parsing with the --force flag.')
    hasFilesAlready = true;
} catch (e) {}

// if it is not present, start conversion
if (!hasFilesAlready || process.argv.indexOf('--force')>-1)
    startConversion()

startWebServer();



function startWebServer(){    
    
    var fileServer = new static.Server(httproot);
    console.log('Starting web server on localhost:', port)
    require('http').createServer(function (req, response) {
            
        if (req.method == 'POST') {
            var body = '';
            req.on('data', function (data) {
                body += data;
                // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
                if (body.length > 1e6) { 
                    // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
                    req.connection.destroy();
                }
            });
            req.on('end', function () {

                // var post = JSON.parse(body);
                                
                publishToServerHttp(url, body, function(data){
                    response.end( data );    
                })
                
                
            });
        }
        else{
            req.addListener('end', function () {
                fileServer.serve(req, response);            
            }).resume();            
        }        
        
    }).listen(port);

    open('http://localhost:'+port);
}



function publishToServerHttp(url, data, cb){
    
    var options = {
        host: 'friendlines.dyndns.hu',
        port: 80,
        path: '/link',
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain',
            // 'Content-Length': data.length        // see this: https://github.com/expressjs/express/issues/1749
        }
    };
    var req = http.request(options, function(res) {
        var result = '';

        res.on('data', function(chunk) {
            result += chunk;
        });

        res.on('end', function() {            
            cb(result)
        });
    });

    req.on('error', function(err) {
        console.log(err);
    });

    req.write(JSON.stringify(data));
    req.end();
    
}


// this causes an error posting because of this bug>
// https://github.com/expressjs/express/issues/1749

// function publishToServer(url, data, cb){
    
//     var requestify = require('requestify');    
//     requestify.post(url, {'json':JSON.stringify(data)}, {})
//         .then(function(response) {
//             // Get the response body (JSON parsed or jQuery object for XMLs)
//             // cb(response.getBody())
//             // console.log('body', response.getBody())
//         }).fail(function(error){
//             console.error(error)
//         });
    
// }

// function publishToServerRequest(url, data, cb){
//     var request = require('request');
//     request.post({
//         url: url, 
//         formData: data}, 
//         function optionalCallback(err, httpResponse, body) {
//             if (err) {
//                 return console.error('upload failed:', err);
//             }
//             console.log('Upload successful!  Server responded with:', body);
//             cb(body)
//     });
// }


function startConversion(){
    console.log('Checking dir for zip files... ');
    var fbhistoryfiles = getFbArchiveFiles()

    // notify user, if there are no files present
    if (fbhistoryfiles.length > 0) {
        if (fbhistoryfiles.length > 1) 
            console.warn('There are more fb history files in there...');
    } else {
        console.log('No fb files found. Copy the history zip file to the folder where this app is')
        process.exit();
    }

    mkdirp(httproot +'data/');

    var statlist = parseFbFiles(fbhistoryfiles)

    // export stat file, to be accessible via static
    jsonfile.writeFileSync(httproot + 'data/'+utils.statFileListName, statlist);

    // generate stats unless asked not to (debug)
    if (process.argv.indexOf('--no-stats')==-1){
        console.log('[parser] generating stats... ')
        require('./stat.js');
    }
}


function parseFbFiles(fbhistoryfiles){

    var statlist = [];
    for (var i = 0; i < fbhistoryfiles.length; i++) {
        var fn = fbhistoryfiles[i]
        console.log('[parser] Parsing ' + fn)
        var userParsed = parseOneFile(fn);
        statlist.push({
            name: userParsed,
            fileName: fn.substr(9, fn.length - 4 - 9)
        })    
    }
    return statlist;
}

function getFbArchiveFiles(){
    var files = fs.readdirSync('./');
    var fbhistoryfiles = []
    for (var i = 0; i < files.length; i++) {
        //console.log('Checking file: ' + files[i]);
        if (utils.isFbZip(files[i])) {
            console.log('Found FB history file: ' + files[i]);
            fbhistoryfiles.push(files[i]);
        }
    }
    return fbhistoryfiles
}

function parseOneFile(inputFileName) {
    var userName = inputFileName.substr(9, inputFileName.length - 4 - 9); // facebook-[username].zip format
    var messagesRaw = utils.getMessagesRawFromZip(inputFileName);
    var lang = utils.getLangOfZip(inputFileName);
    console.log("[parser] Detected language: ", lang);
    var messageData = messageParser.parse(messagesRaw, lang);
    
    console.log('[parser] Exporting data...');
    
    export_sqlite.exportMessages(messageData, httproot+'data/stat.' + userName + '.sqlite');
    if (process.argv.indexOf('--mysql')>-1)
        export_mysql.exportMessages('messages_' + userName, messageData);
        
    if (process.argv.indexOf('--no-messages')==-1)
    {
        var json = JSON.stringify(messageData.map(function(m){
            return {fromuser: m.fromuser, 
                touser: m.touser, 
                senddate: m.senddate,
                msg: m.msg}
        }))
        fs.writeFileSync(httproot +'data/messages.' + userName + '.json', json);
    }            
    return userName;
}
