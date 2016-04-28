var u = require('./convert-utils.js');
var moment = require('moment');


exports.convert = function convert(scope, db, meta){
    console.log('[convert] type 3')
    var startDate = u.minDate(db);
    var endDate = u.maxDate(db); 
    
 
    var ret = {
        name: meta.name,        
        startSlot: moment(startDate).startOf(scope).format(),
        endSlot: moment(endDate).endOf(scope).format(),        
        userActivity: u.userActivityByMonth(db,meta),
    }
    
    return ret
}