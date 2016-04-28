var moment = require('moment');

var jsonfile = require('jsonfile');

var utils = require('./utils/utils');
var export_sqlite = require('./utils/export_sqlite');
var convert = require('./utils/convert.js');
var convert3 = require('./utils/convert3.js');

var u = require('./utils/convert-utils.js');
var statList = require('../data/'+utils.statFileListName);

var grain = ['month','week','day'];
var db = null;
var meta = {name: '?'}
var httproot = __dirname + '/../'

// for now only run the 3rd conversion script
var convertType =  "3";
 
for (var i = 0; i < statList.length; i++){
    
    var fileName = httproot + "data/stat."+statList[i].fileName+".sqlite";
    var outputFileName = httproot + "data/stats."+statList[i].fileName+"."+convertType+".json";
    
    db = export_sqlite.loadFromDb(fileName);
    meta.name = db.exec(u.q.getUser)[0].values[0][0];
    console.log('[stat] Getting user data... ', meta.name)
    
    var output;
    switch (convertType){
        case "1": output = convert.convert1(grain[0], db, meta); break;    
        case "2": output = convert.convert2(grain[0], db, meta); break;
        case "3": output = convert3.convert(grain[0], db, meta); break;
    }
    
    jsonfile.writeFileSync(outputFileName, output); 
    console.log("[stat] Data exported to ", outputFileName );
    
}




