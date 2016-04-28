var utils = require('./utils');
//var jsdom = require('jsdom');
var moment = require("moment");
var ProgressBar = require('progress');

var messageType = exports.messageType = {
    id: 'INT',
    frmuserid: 'INT',
    frmuser: 'VARCHAR(40)',
    touserid: 'INT',
    touser: 'VARCHAR(40)',
    senddate: 'DATETIME',
    priv: 'INT(1)',
    msg: 'TEXT',
    len: 'INT',
    outward: 'INT(1)'
}
for (var i = 0; i < utils.emotions.length; i++) messageType[utils.emotions[i]] = 'INT';

var messagesColumns = exports.messagesColumns = Object.keys(messageType);

exports.parse = function (messagesRaw, lang) {
    utils.dateFormat = ''    
    var meta = {lang: lang};
    meta.name = utils.html.getNameFromMessages(messagesRaw);
    
    console.log('[parse] Finding threads...')
    var threads = utils.html.getThreads(messagesRaw);    
    var bar = new ProgressBar('Parsing threads [:bar] :percent :etas', { total: threads.length, width: 60 });
    var messages = [];
    
    for(var t = 0; t < threads.length; t++){        
        messages = messages.concat(utils.html.getMessagesFromThread(threads[t], meta));
        bar.tick();        
    }
    
    // add ID-s to the messages
    for(var i=0; i<messages.length; i++) messages[i].id = i;
           
    // add generated ID-s to users, since facebook is not giving it to us.
    mapUsers(messages, meta.name)
        
    return messages;
    
}

function mapUsers(messages, firstusername){
    // get the map of users
    var userMap = {}; userIndex = 0;
    userMap[firstusername] = true;
    
    messages.map(function(m){ 
        userMap[m.frmuser] = true;
        userMap[m.touser] = true;
    })
    // add them a number
    Object.keys(userMap).map(function(u){userMap[u] = userIndex++});
    
    // update the messages according
    messages.map(function(m){ 
        m.frmuserid = userMap[m.frmuser];
        m.touserid = userMap[m.touser];
    })
    
}
