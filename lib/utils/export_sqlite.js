var messageParser = require('./messages');
var fs = require("fs");
var utils = require('./utils');
var SQL = require('../../node_modules/sql.js/js/sql-debug');
var db = null;
var ProgressBar = require('progress');

exports.exportMessages = function( messageData, sqliteDbFilename ){
    
    db = new SQL.Database();
    
    console.log("[sqlite] exporting...")    
    var messagesTableName = 'messages'
    var createTableCommand = utils.createTable(messagesTableName, messageParser.messageType);
    db.exec(createTableCommand);
        
    var insertCommand = "INSERT INTO "+messagesTableName+" VALUES (" + Object.keys(messageParser.messageType).map(function(){return '?'}).join(',') + ')';
    
    var bar = new ProgressBar('[sqlite] writing table [:bar] :percent :etas', { total: messageData.length, width: 60 });
    
    for(var i = 0; i<messageData.length; i++){
        var data = [];
        for(var k in messageParser.messageType){
            data.push(messageData[i][k])
        }                
        db.run(insertCommand, data);  
        bar.tick();      
    }    
    console.log("[sqlite] writing out...")    
    var exp = db.export();
    var buffer = new Buffer(exp);
    fs.writeFileSync(sqliteDbFilename, buffer);
    console.log('[sqlite] file saved as `' + sqliteDbFilename + '`' );
          
}

exports.loadFromDb = function(filename){
        
    console.log('[sqlite] init: loading data from file: ', filename);
    var ret = new SQL.Database(fs.readFileSync(filename));
    console.log('[sqlite] file loaded ');
    return ret;
}