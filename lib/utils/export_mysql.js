var mysql = require('mysql');
var config = require('../../config.json');
var messageParser = require('./messages');
var utils = require('./utils');
var ProgressBar = require('progress');

var c = mysql.createConnection(config.db);
var batchSize = 10;

exports.exportMessages = function(tableName, messageData){         
    var createTableCommand = utils.createTable(tableName, messageParser.messageType);    
    c.connect();
    console.log('[mysql] exporting table...', messageData.length);
    var bar = new ProgressBar('[mysql] Batch insert [:bar] :percent :etas', { total: messageData.length/batchSize, width: 60 });
    c.query("DROP TABLE IF EXISTS "+tableName+";", function (err, rows, fields) {
        if (err) throw err;                       
        c.query(createTableCommand, function (err, rows, fields) {
            if (err) throw err;            
            
            pool(c, tableName, messageData, batchSize, bar, function(){
                console.log('')
                console.log('[mysql] exported to mysql! ')
                c.end();
            });
            
        });
    });    
}

function pool(c, tableName, messageData, batchSize, bar, callback){        
    var endOfData = messageData.length > batchSize ? batchSize : messageData.length;
    var firstPart = messageData.slice(0,endOfData);
    var inserts = generateInsert(tableName, messageParser.messageType, firstPart)            
    c.query(inserts, function(err, rows, fields){
        if (messageData.length > batchSize)
            pool(c, tableName, messageData.slice(batchSize, messageData.length), batchSize, bar, callback);
        else{
            callback();
        }
        if (err) throw err;
        bar.tick();
        
    })
}


function generateInsert(tableName, columns, data){
    
    var ret = data.map(function(entry){
        var ret = [];        
        for(var k in columns){            
            
            if (columns[k].substring(0,7).toLowerCase()=='varchar'){
                var cut = parseInt(columns[k].substring(8))-1;
                ret.push(mysql.escape(entry[k].substring(0, cut)));                
            }
            else if (columns[k].toLowerCase() == 'text'){
                if (entry[k]){
                    ret.push(mysql.escape(entry[k]));
                }                    
                else{
                    ret.push("''");                                        
                }
            }
            else if (columns[k].toLowerCase() == 'datetime'){                                
                ret.push("'"+entry[k]+"'");
            }
            else if ((typeof entry[k])  == 'number')
                ret.push(entry[k]);
            else if ((typeof entry[k])  == 'boolean')
                ret.push(entry[k]?1:0);
            else 
                ret.push("NULL");
        }        
        return "("+ret.join(",")+")";
    })
    
    var columnsWrapped = Object.keys(columns).map(function(e){ return "`"+e+"`" }).join(',');
    
    return "INSERT INTO "+tableName + " (" + columnsWrapped + ") VALUES " + ret.join(',');
}

