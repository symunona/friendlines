var utils = require('./utils.js');
var moment = require('moment');

var q = exports.q = {
    
    base: "select YEAR(senddate) as y, MONTH(senddate) as m, frmuser, touser, count(id) as cnt, sum(len) as leng, avg(len) as av ",  
        
    inoutboundMonthSelectKeys: ['user', 'userid' ,'year','month','cnt', 'leng', 'av'].concat(utils.emotions),
    inoutboundSummableSelectKeys: ['cnt', 'leng'].concat(utils.emotions),
    
    inboundBySumUserAndMonth: function(meta){
        return "SELECT frmuser as user, frmuserid as userid, " +
        "strftime('%Y',senddate) as year, strftime('%m',senddate) as month,  " +
        "count(id) as cnt, sum(len) as leng, avg(len) as av, " +
        q.emotionsums + " FROM messages WHERE touser = '" + meta.name + "' " +
        
        "group by strftime('%m',senddate), strftime('%Y',senddate), frmuser " +
        "order by senddate "+
        ";"; 
    },
    
    messagesQuery: 'select frmuserid, frmuser, touserid, touser, senddate, msg from messages order by senddate', 

    outboundBySumUserAndMonth: function(meta){
        return "SELECT touser as user, touserid as userid, " +
         "strftime('%Y',senddate) as year, strftime('%m',senddate) as month,  " +
        "count(id) as cnt, sum(len) as leng, avg(len) as av, " +
        q.emotionsums + " FROM messages WHERE frmuser = '" + meta.name + "' " +        
        "group by strftime('%m',senddate), strftime('%Y',senddate), touser "+
        "order by senddate "+
        ";"; 
    },    
    emotionsums: utils.emotions.map(function(em){return 'sum('+em+') as '+em}).join(','),
    date: {
        selectByMonth: "year(senddate) as year, month(senddate) as month "
    },
    from: " from messages ", 
    groupby:[
         "group by frmuser ",         
         "group by MONTH(senddate), YEAR(senddate) ",
         "group by MONTH(senddate), YEAR(senddate), outward "                     
    ],
    orderby: [
        "order by leng desc",
        "order by y,m"
    ],
    getUser: "select frmuser from messages where outward = 1 limit 1",
} 

/**
 * function userActivityByMonth
 * 
 * generates a structure from the database:
 * 
 * userMap: {
 *      username: {
 *          YYYYMM: {
 *              inbound: { .. cnt, leng, avg, emotions ..},
 *              outbound: {.. cnt, leng, avg, emotions ..},
 *              sum: {
 *                  cnt
 *                  avg
 *              
 *              }
 *          }
 *          ...
 *      }
 *      ...
 * }
 * 
 * round1 doNotOverComplicate it over statement:
 *  first only month!!! When I see it's working, i can go for changeable
 * 
 */

exports.userActivityByMonth = function userActivityByMonth(db, meta){
    var queryInbound = q.inboundBySumUserAndMonth(meta);
    var queryOutbound = q.outboundBySumUserAndMonth(meta);
    
    var umap = {};
    
    db.exec(queryInbound)[0].values.
        map(function(e){                        
            var name = e[0]; 
            var userid = e[1];
            var year = e[q.inoutboundMonthSelectKeys.indexOf('year')];
            var month = e[q.inoutboundMonthSelectKeys.indexOf('month')];
            var ymkey = '' + year + month;
            
            if (!umap[name]) umap[name] = {};
            if (!umap[name][ymkey]) umap[name][ymkey] = { name: name, userid: userid, inbound: {}, outbound: {}, sum: {}};
                        
            for(var i = 0; i < q.inoutboundMonthSelectKeys.length; i++)
                umap[name][ymkey].inbound[q.inoutboundMonthSelectKeys[i]] = e[i]; // copy every key from the select
            return umap[name];
        });

    db.exec(queryOutbound)[0].values.
        map(function(e){
            var name = e[0]; 
            var userid = e[1];
            var year = e[q.inoutboundMonthSelectKeys.indexOf('year')];
            var month = e[q.inoutboundMonthSelectKeys.indexOf('month')];
            // var ymkey = yyyymm(year, month);
            var ymkey = '' + year + month;
            if (!umap[name]) umap[name] = {};
            if (!umap[name][ymkey]) umap[name][ymkey] = { name: name, userid: userid, inbound: {}, outbound: {}, sum: {}};
                        
            for(var i = 0; i < q.inoutboundMonthSelectKeys.length; i++)
                umap[name][ymkey].outbound[q.inoutboundMonthSelectKeys[i]] = e[i]; // copy every key from the select
            return umap[name];
        });
    // merge the two into sums
    for(var user in umap){
        var u = umap[user];
        for(var ymkey in u){
            for(var sumkeyi = 0; sumkeyi < q.inoutboundSummableSelectKeys.length; sumkeyi++){
                var inval = u[ymkey].inbound[q.inoutboundSummableSelectKeys[sumkeyi]] || 0;
                var outval = u[ymkey].outbound[q.inoutboundSummableSelectKeys[sumkeyi]] || 0;
                u[ymkey].sum[q.inoutboundSummableSelectKeys[sumkeyi]] = inval + outval;                
            }            
            u[ymkey].sum.av = (u[ymkey].inbound.cnt + u[ymkey].outbound.cnt) / u[ymkey].sum.cnt;
            u[ymkey].sum.inoutCntBalance = (u[ymkey].inbound.cnt / u[ymkey].outbound.cnt);
            u[ymkey].sum.inoutLenBalance = (u[ymkey].inbound.leng / u[ymkey].outbound.leng);
        }        
        
    }        
    
    return umap;
}

exports.getUserMap = function(){
    var userMap = {}
}


exports.exportMessages = function(db){
    return db.exec(q.messagesQuery)[0].values
}



exports.minDate = function minDate(db){    
    return db.exec("SELECT min(senddate) as m FROM messages")[0].values[0][0];
} 
exports.maxDate = function maxDate(db){    
    return db.exec("SELECT max(senddate) as m FROM messages")[0].values[0][0];
} 



exports.searchUsersForTimeSlot = function searchUsersForTimeSlot(year, month, data){
    var ret = {};
    var ymkey = yyyymm(year, month)
    for(var user in data){
        if (data[user][ymkey]){
            ret[user] = data[user][ymkey];            
        }            
    }    
    return ret;
}

exports.getAllUsers = function getAllUsers(db){
    var umap = {};
    var frmusers = db.exec("SELECT frmuser, min(senddate) as frmtime, max(senddate) as tilltime FROM messages GROUP BY frmuser")[0].values.
        map(function(e){
            umap[e[0]] = {name: e[0], frmtime: e[1], tilltime: e[2]} 
            return umap[e[0]];
        });
    
    var tousers = db.exec("SELECT touser, min(senddate) as frmtime, max(senddate) as tilltime FROM messages GROUP BY touser")[0].values
        .filter(function(t){return !umap[t[0]]}).map(function(e){
            umap[e[0]] = {name: e[0], frmtime: e[1], tilltime: e[2]} 
            return umap[e[0]];
        });
    // merge the two info
    for(var tu = 0; tu<tousers.length; tu++){
        
        if (umap[tousers[tu].name]){
            var u = umap[tousers[tu].name];
            if (moment(u.frmtime).isAfter(tousers[tu].frmtime)){
                u.frmtime = tousers[tu].frmtime;
            }
            if (moment(u.tilltime).isBefore(tousers[tu].tilltime)){
                u.tilltime = tousers[tu].tilltime;
            }
        }
        else{
            frmusers.push(tousers[tu]);
        }
    }
    return frmusers;
}

exports.usersNoLongerInTouch = function usersNoLongerInTouch(lastSlot, currentSlot){
    var endingUsers = {}
    for(var lastSlotUser in lastSlot){
        if (!currentSlot[lastSlotUser])
            endingUsers[lastSlotUser] = lastSlot[lastSlotUser];
    }
    return endingUsers
}



function yyyymm(year, month){
    return year + (month<10?'0':'') + month;
}

exports.usermap = function(linesData, trespassers){
 
    var userset = {};
    for (var lines = 0; lines < linesData.length; lines ++){
        var user = linesData[lines].user.name;
        
        if (!userset[user]) userset[user] = { cnt: 0 };        
        userset[user].cnt += (linesData[lines].toSlot-linesData[lines].fromSlot);
    //    console.log(linesData[lines].toSlot-linesData[lines].fromSlot)        
    }

    for (var lines = 0; lines < trespassers.length; lines ++){
        var user = trespassers[lines].user.name;
        
        if (!userset[user]) userset[user] = { cnt: 0 };
        userset[user].cnt++;        
    }
    
    orderBy(userset, 'cnt', 'name');
    
    // // order by cnt
    // var orderedUsers = Object.keys(userset).map(function(name){return userset[name]});
    // orderedUsers.sort(function(a, b){
    //     if(a.cnt > b.cnt) return 1;
    //     if(a.cnt < b.cnt) return -1;
    //     return (a.name < b.name)?((a.name > b.name)?1:0):-1;
    // });
    // for(var o = 0; o<orderedUsers.length; o++) orderedUsers[o].order = o;
     
    return userset;
    
}

exports.orderBy = orderBy;

function orderBy(userset, key1, key2){
    var orderedUsers = Object.keys(userset).map(function(name){return userset[name]});
    orderedUsers.sort(function(a, b){
        if(a[key1] > b[key1]) return 1;
        if(a[key1] < b[key1]) return -1;
        return (a[key2] < b[key2])?((a[key2] > b[key2])?1:0):-1;
    });
    for(var o = 0; o<orderedUsers.length; o++) orderedUsers[o].order = o;    
}


exports.addLineUsage = function (usageMap, user){    
    for(var yyyymm in user){        
        usageMap[yyyymm] = true;
    }    
}

exports.addLineUsageWithPuffer = function(usageMap, user, rangeUp, rangeDown){    
    for(var yyyymm in user){        
        usageMap[yyyymm] = true;
    }    
    for(var yyyymm in user){
        for(var r = 1; r<= rangeUp; r++){       
            var rangeKey = moment(yyyymm, "YYYYMM").add(r, 'months').format('YYYYMM');     
            usageMap[rangeKey] = true;    
            console.log(yyyymm, rangeKey)
        }            
        for(var r = 1; r<= rangeDown; r++){       
            var rangeKey = moment(yyyymm, "YYYYMM").add(-r, 'months').format('YYYYMM');     
            usageMap[rangeKey] = true;    
            console.log(yyyymm, rangeKey)
        }            
    }
}

exports.userFitsInLine = function(usageMap, user){
    for(var yyyymm in user){
        if (usageMap[yyyymm]) return false;
    }
    return true;
}
