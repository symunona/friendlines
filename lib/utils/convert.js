var u = require('./convert-utils.js');
var moment = require('moment');

exports.convert1 = function convert(scope, db, meta){
    
    var startDate = u.minDate(db);
    var endDate = u.maxDate(db); 
    var startSlot = moment(startDate).startOf(scope);
    var endSlot = moment(endDate).endOf(scope);
    var slotsBetween = endSlot.diff(startSlot, scope);
 
    var ret = {
        monthsPuffer: [],
        lines: [],  // people lines close to mine, attrs: startSlot, endSlot, y, user
        trespassers: [],
        name: meta.name,
        startSlot: moment(startDate).startOf(scope).format(),
        endSlot: moment(endDate).endOf(scope).format(),
        months: endSlot.diff(startSlot, scope),   
        maxHeight: 0,
        users: []       
    }
    
    var userActivity = u.userActivityByMonth(db,meta);
    
    var openedUsers = [];
    
    for(var timeslot = 0; timeslot < slotsBetween; timeslot++){
                        
        ret.monthsPuffer[timeslot] = u.searchUsersForTimeSlot(startSlot.year(), startSlot.month()+1, userActivity);
        
        // add order data by sum message length
        u.orderBy(ret.monthsPuffer[timeslot], 'leng','cnt');
                        
        startSlot.add(1, scope);        
    }
    
    // define lengths    
    for(var timeslot = 0; timeslot < slotsBetween; timeslot++){

        for(var user in ret.monthsPuffer[timeslot]){
            var userInList = openedUsers.find(function(e){return e?(e.user.name == user):false});
            
            // if user does not have a slot yet, create one
            
            if (!userInList){    
                var firstFreeSlot = 0;
                while(openedUsers[firstFreeSlot]) firstFreeSlot++;  
                               
                openedUsers[firstFreeSlot] = {
                    fromSlot: timeslot, 
                    toSlot: null, 
                    y: firstFreeSlot, 
                    user: ret.monthsPuffer[timeslot][user],
                    cnt: ret.monthsPuffer[timeslot][user].sum.cnt,
                    leng: ret.monthsPuffer[timeslot][user].sum.leng,
                    intensityArray: [],
                    intensityMap: {}
                };                                
            }
            else{
                userInList.cnt += ret.monthsPuffer[timeslot][user].sum.cnt;
                userInList.leng += ret.monthsPuffer[timeslot][user].sum.leng;
                userInList.intensityMap[timeslot] = { 
                    timeslot: timeslot, 
                    leng: ret.monthsPuffer[timeslot][user].sum.leng,
                    cnt: ret.monthsPuffer[timeslot][user].sum.cnt,
                    order: ret.monthsPuffer[timeslot][user].order
                     };
                userInList.intensityArray.push(userInList.intensityMap[timeslot])
                userInList.toSlot = timeslot;
            }            
        }                
    }
    
    // realign > 1 length
    var openedSlots = [];
    for(var timeslot = 0; timeslot < slotsBetween; timeslot++){

        for (var ou = 0; ou < openedUsers.length; ou ++){
            if (openedUsers[ou].fromSlot == timeslot){
                var firstFreeSlot = 0;
                while(openedSlots[firstFreeSlot]) firstFreeSlot++;  
                openedUsers[ou].y = firstFreeSlot;
                openedSlots[firstFreeSlot] = openedUsers[ou];
                if (firstFreeSlot>ret.maxHeight) ret.maxHeight = firstFreeSlot;
            }            
        }
                
        var endingUsers = openedSlots.filter(function(slot){                
            return slot?timeslot == slot.toSlot:false;
        });
        
            
        for(var i = 0; i < endingUsers.length; i++){
            var endingUserSlot = endingUsers[i]; //openedSlots.find(function(e){return e?(e.user.name == user):false});

            if ((endingUserSlot.toSlot - endingUserSlot.fromSlot) < 2){
                ret.trespassers.push(endingUserSlot);
            }
            else{
                ret.lines.push(endingUserSlot);
            }                
            
            openedSlots[openedSlots.indexOf(endingUserSlot)] = null;    
                                                            
        }
    }
    
    ret.usermap = u.usermap(ret.lines, ret.trespassers);
    
    return ret
}

exports.convert2 = function convert(scope, db, meta){
    console.log('Convert 2')
    var startDate = u.minDate(db);
    var endDate = u.maxDate(db); 
    var startSlot = moment(startDate).startOf(scope);
    var endSlot = moment(endDate).endOf(scope);
 
    var ret = {
        monthsPuffer: [],
        lines: [],  // people lines close to mine, attrs: startSlot, endSlot, y, user
        trespassers: [],
        name: meta.name,
        startSlot: moment(startDate).startOf(scope).format(),
        endSlot: moment(endDate).endOf(scope).format(),
        months: endSlot.diff(startSlot, scope),   
        maxHeight: 0,        
        userActivity: u.userActivityByMonth(db,meta),
        regulars: []       
    }
    var users = [];
    for(var user in ret.userActivity){
        users.push({name: user, monthData: ret.userActivity[user]});    
    }
    users.sort(function(a,b){
        if (Object.keys(a.monthData)[0] > Object.keys(b.monthData)[0]) return 1;
        if (Object.keys(a.monthData)[0] < Object.keys(b.monthData)[0]) return -1;
        return 0;
    })
    var actualLine = 0;
    var lineUsageMap = {};
    var i = 0;
    
    for(var j = 0; j<users.length; j++){
        if (Object.keys(users[j].monthData).length<3){
            var userData = users.splice(j,1);
            ret.trespassers.push(userData)
            j--;
        }            
    }
    
    while(users.length){

        // add the actual line for it
        u.addLineUsageWithPuffer(lineUsageMap, users[0].monthData, 1,1)
        users[0].y = actualLine;
        ret.regulars.push(users.shift());
        
        // search the other users, maybe they fit in        
        for(var j = 1; j<users.length; j++){
            if (u.userFitsInLine(lineUsageMap, users[j].monthData)){                
                u.addLineUsageWithPuffer(lineUsageMap, users[j].monthData, 1,1);
                users[j].y = actualLine;
                
                // console.log(users[j][Object.keys(users[j])[0]].name)
                ret.regulars.push(users.splice(j,1)[0]);
                j--;
            }
        } 
        lineUsageMap = {};
        actualLine++;   
        i++;             
    }
    ret.maxHeight = actualLine;
    
    return ret
}





function convertX(scope, db, meta){
    var startDate = u.minDate(db);
    var endDate = u.maxDate(db); 
    var startSlot = moment(startDate).startOf(scope);
    var endSlot = moment(endDate).endOf(scope);
    var slotsBetween = endSlot.diff(startSlot, scope);
 
    var ret = {
        monthsPuffer: [],
        lines: [],  // people lines close to mine, attrs: startSlot, endSlot, y, user
        trespassers: [],
        name: meta.name,
        startSlot: moment(startDate).startOf(scope).format(),
        endSlot: moment(endDate).endOf(scope).format(),
        months: endSlot.diff(startSlot, scope),   
        maxHeight: 0,
        users: []       
    }
        
    console.log(startDate , '-', endDate);
    console.log(startSlot.format() , '-', endSlot.format(), ' diff: ',slotsBetween);
    console.log("------------------------------------------------------------++++++++++++++++++++++++++++++++++")
    
    var userActivity = u.userActivityByMonth(db,meta);
    
    //console.log(userActivity['Katarzyna Orzechowska'])
         
    var openedSlots = [];
    
    for(var timeslot = 0; timeslot < slotsBetween; timeslot++){
                        
        ret.monthsPuffer[timeslot] = u.searchUsersForTimeSlot(startSlot.year(), startSlot.month()+1, userActivity);        
        startSlot.add(1, scope);        
    }
    
    // define lengths    
    for(var timeslot = 0; timeslot < slotsBetween; timeslot++){

        for(var user in ret.monthsPuffer[timeslot]){
            var userInSlot = openedSlots.find(function(e){return e?(e.user.name == user):false});
            
            // if user does not have a slot yet, create one
            
            if (!userInSlot){    
                var firstFreeSlot = 0;
                while(openedSlots[firstFreeSlot]) firstFreeSlot++;  
                               
                openedSlots[firstFreeSlot] = {
                    fromSlot: timeslot, 
                    toSlot: undefined, 
                    y: firstFreeSlot, 
                    user: ret.monthsPuffer[timeslot][user],
                    cnt: ret.monthsPuffer[timeslot][user].sum.cnt,
                    leng: ret.monthsPuffer[timeslot][user].sum.leng
                };                                
            }
            else{
                userInSlot.cnt += ret.monthsPuffer[timeslot][user].sum.cnt;
                userInSlot.leng += ret.monthsPuffer[timeslot][user].sum.leng;
            }
            
        }
        if (timeslot > 0){
            var endingUsers = u.usersNoLongerInTouch(ret.monthsPuffer[timeslot-1], ret.monthsPuffer[timeslot]);
            
            for(var user in endingUsers){
                
                var endingUserSlot = openedSlots.find(function(e){return e?(e.user.name == user):false});
                endingUserSlot.toSlot = timeslot;
                
                if ((endingUserSlot.toSlot - endingUserSlot.fromSlot) < 2){
                    ret.trespassers.push(endingUserSlot);
                }
                else{
                    ret.lines.push(endingUserSlot);
                }                
                
                openedSlots[openedSlots.indexOf(endingUserSlot)] = null;    
                                                               
            }
        }
                
    }
    
    // // realign > 1 length
    openedSlots = [];
    for(var timeslot = 0; timeslot < slotsBetween; timeslot++){


        for (var lines = 0; lines < ret.lines.length; lines ++){
            if (ret.lines[lines].fromSlot == timeslot){
                var firstFreeSlot = 0;
                while(openedSlots[firstFreeSlot]) firstFreeSlot++;  
                ret.lines[lines].y = firstFreeSlot;
                openedSlots[firstFreeSlot] = ret.lines[lines];
                if (firstFreeSlot>ret.maxHeight) ret.maxHeight = firstFreeSlot;
            }            
        }
        
        for (var lines = 0; lines < ret.lines.length; lines ++){
            if (ret.lines[lines].toSlot == timeslot){
                var index = openedSlots.indexOf(ret.lines[lines])                
                openedSlots[index] = null;
            }            
        }
    }

    // for (var lines = 0; lines < ret.lines.length; lines ++){
        
    //     var firstFreeSlot = 0;
    //     while(openedSlots[firstFreeSlot]) firstFreeSlot++;
    //     ret.lines[lines].y = firstFreeSlot;
    //     openedSlots[firstFreeSlot] = ret.lines[lines];
        
    //     var timeslot = ret.lines[lines].fromSlot
    //     if (timeslot > 0){
    //         var endingUsers = usersNoLongerInTouch(ret.monthsPuffer[timeslot-1], ret.monthsPuffer[timeslot]);
            
    //         for(var user in endingUsers){               
    //             var endingUserSlot = openedSlots.find(function(e){return e?(e.user.name == user):false});                          
    //             openedSlots[openedSlots.indexOf(endingUserSlot)] = null;                                                                   
    //         }
    //     }
    //     console.log(openedSlots)
    // }
    
    // users
    var userset = {};
    for (var lines = 0; lines < ret.lines.length; lines ++){
        var user = ret.lines[lines].user.name;
        
        if (!userset[user]) userset[user] = { cnt: 0 };
        userset[user].cnt += (ret.lines[lines].tomSlot-ret.lines[lines].fromSlot);        
    }

    for (var lines = 0; lines < ret.trespassers.length; lines ++){
        var user = ret.trespassers[lines].user.name;
        
        if (!userset[user]) userset[user] = { cnt: 0 };
        userset[user].cnt++;        
    }
    
    // order by cnt
    var orderedUsers = Object.keys(userset).map(function(name){return userset[name]});
    orderedUsers.sort(function(a, b){
        if(a.cnt > b.cnt) return 1;
        if(a.cnt < b.cnt) return -1;
        return (a.name < b.name)?((a.name > b.name)?1:0):-1;
    });
    for(var o = 0; o<orderedUsers.length; o++) orderedUsers[o].order = o;
     
    ret.usermap = userset;
    
    console.log('max height: ', ret.maxHeight);
     
    return ret;
}
