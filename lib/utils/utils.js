var AdmZip = require('adm-zip');
var moment = require('moment');
var extend = require('util')._extend;
var momentParseFormat = require('moment-parseformat');
var consts = require('../consts');

exports.dateFormat = ''

exports.statFileListName = "statlist.json";

// mind the gaps
var emotions = exports.emotions = consts.c.emotions



exports.emotions = Object.keys(emotions);

exports.isFbZip = function(fileName){
    if (fileName && fileName.substring && fileName.substring(fileName.length-4) == ".zip"){
        var zip = new AdmZip("./"+fileName);
        var zipEntries = zip.getEntries(); // an array of ZipEntry records
        var filesNeededFound = 0;
        
        zipEntries.forEach(function(zipEntry) {                       
            if (zipEntry.entryName == "index.htm") {
                filesNeededFound++;
            }
            if (zipEntry.entryName == "html/messages.htm") {
                filesNeededFound++;
            }   
            if (zipEntry.entryName == "html/settings.htm") {
                filesNeededFound++;
            }             
        });
        if (filesNeededFound > 0){
            return true;
        }
    }
    return false;
}

exports.getMessagesRawFromZip = function(zipFileName){
    var zip = new AdmZip(zipFileName);
    var zipEntries = zip.getEntries(); // an array of ZipEntry records

    for(var i = 0; i<zipEntries.length; i++){
        var zipEntry = zipEntries[i];
        if (zipEntry.entryName == "html/messages.htm") {
            
            zip.readAsText("html/messages.htm");
             
            var ret = zipEntry.getData().toString('utf8');                                    
            return ret             
        }
    }
}

exports.getLangOfZip = function(zipFileName){
    var zip = new AdmZip(zipFileName);
    var zipEntries = zip.getEntries(); 

    for(var i = 0; i<zipEntries.length; i++){
        var zipEntry = zipEntries[i];
        if (zipEntry.entryName == "html/settings.htm") {
            
            zip.readAsText("html/settings.htm");
             
            var ret = zipEntry.getData().toString('utf8');     
            var lang = ret.match(/<td>(.*?)<\/td>/)[1];                               
            return lang;             
        }
    }
}

var analize = exports.analize = function(msg){
    
    var ret = {
        emotiocons: 0        
    }
    msg = msg.toLowerCase();
    
    for (var emotion in emotions){
        ret[emotion] = 0;
        for(var emoticon in emotions[emotion]){  
            if (!emotions[emotion][emoticon].split) continue;
            var searchsting = "\\"+(emotions[emotion][emoticon].split('').join("\\"));
            ret[emotion] += (msg.match(new RegExp(searchsting, "gi"))||[]).length;        
        }
        ret.emoticons =+ ret[emotion];
    }
        
    return ret;
}


exports.createTable = function(tableName, columns){    
    var keys = []
    for (var key in columns)
        keys.push('`'+key + '` ' + columns[key]);
    
    return "CREATE TABLE `" + tableName + "` (" + keys.join(',') + ");";
}

var html = exports.html = {
    getNameFromMessages: function(msg){
        return msg.match(/<h1>(.*?)<\/h1>/)[1];
    },
    getThreads: function(msg){
        var threads = msg.split('<div class="thread">');
        threads.shift();        
        return threads;
    },
    getMessagesFromThread: function(thread, meta){
        
        
        
        var recipiants = thread.substring(0,thread.indexOf('<')).split(',').map(function (e) { return e.trim() });
        var messagesRaw = thread.substring(thread.indexOf('<')).split('<div class="message">');
        var messages = [];
        
        // start from 1 because the first will be an empty string
        for(var mi = 1; mi < messagesRaw.length; mi++){
            var entry = html.parseMessage(messagesRaw[mi], meta);            
            var msgAnalitics = analize(entry.msg);
            for (var key in msgAnalitics) {
                entry[key] = msgAnalitics[key];
            }
            entry.priv = (recipiants.length <= 2);
            entry.outward = (entry.frmuser==meta.name);
            
            for (var iToUser = 0; iToUser < recipiants.length; iToUser++) {
                        // this saves all the messages in group chats
                        // it can be useful for group analysis   
                                                         
                if ((recipiants[iToUser]) != entry.frmuser && ((entry.frmuser == meta.name) || (recipiants[iToUser] == meta.name))) {
                    var cpy = extend({ touser: recipiants[iToUser] }, entry);                                        
                    messages.push(cpy);                        
                }
            }
        }
        return messages;
    },
    parseMessage: function(message, meta){
        
        var user = html.firstTagValue('<span class="user">', message);            
        var dateString = html.firstTagValue('<span class="meta">', message);
        if (!exports.dateFormat) {
            moment.locale(meta.lang);
            exports.dateFormat = momentParseFormat(dateString);
            console.log('Date format from: ', dateString);            
            console.log('Found date format ('+meta.lang+'): ', exports.dateFormat);
        }       
        var date = moment(dateString, exports.dateFormat, meta.lang).format();
        var msg = html.firstTagValue('<p>', message);
        return {
            frmuser: user,
            msg: msg,
            len: msg.length,
            senddate: date
            }            
    },
    firstTagValue: function(tag, htmppart){
        var tmp = htmppart.split(tag)[1];
        return tmp.substring(0,tmp.indexOf('<'));
    }
    
}


// String.prototype.replaceAll = function(search, replacement) {
//     var target = this;
//     return target.replace(new RegExp(search, 'g'), replacement);
// };

// Array.prototype.wrap = function(str){      
//     return this.map(function(e){ return str+e+str });
// }