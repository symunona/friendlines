var actualStat;  
var filter;
var cookieKey;

(function ($, SVG, moment, u, Cookie, svgPanZoom, tinycolor) {


    window.processors = window.processors || []

    window.processors.push({
        name: "intensity timeline",                
        process: process1,
        filters: true,
        draw: draw        
    });
    
    
    var colors = window.c.colors;
    
    
    function process1(userActivity, filter){
        var startKey = Object.keys(userActivity[Object.keys(userActivity)[0]])[0];
        var ret = {
            regulars: [],
            trespassers: [],
            usermap: {},          
            startMonth: startKey,
            endMonth: startKey  
        }
        
        var users = [];
        var userid = '';
        var colorIndex = 0;
        for(var user in userActivity){
            var sumkeys = ['sum', 'inbound','outbound']
            var sums = {}
            sumkeys.map(function(s){ sums[s] = {                 
                    cnt:0, 
                    leng: 0,
                    startMonth: Object.keys(userActivity[user])[0]
                }
            })
                
            Object.keys(window.c.emotions).map(function(emotion){
                sumkeys.map(function(s){
                    sums[s][emotion] = 0
                })     
            })                
            
            Object.keys(userActivity[user]).map(function(monthkey){
                sumkeys.map(function(sumfield){
                    if (userActivity[user][monthkey][sumfield].cnt)
                        sums[sumfield].cnt+= userActivity[user][monthkey][sumfield].cnt;
                    if (userActivity[user][monthkey][sumfield].leng)
                        sums[sumfield].leng+= userActivity[user][monthkey][sumfield].leng;
                    Object.keys(window.c.emotions).map(function(emotion){
                        sums[sumfield][emotion] += (userActivity[user][monthkey][sumfield][emotion] || 0) 
                    })                                    
                })
                userid = userActivity[user][monthkey].userid;
            })       
            var userToInsert = {
                name: user, 
                userid: userid,
                monthData: userActivity[user],
                sums: sums,                 
                color: colors[colorIndex++],
                startMonth: Object.keys(userActivity[user])[0],
                endMonth: Object.keys(userActivity[user])[Object.keys(userActivity[user]).length-1]                 
            }      
            users.push(userToInsert);    
            if (userToInsert.startMonth < ret.startMonth) ret.startMonth = userToInsert.startMonth;
            if (userToInsert.endMonth > ret.endMonth) ret.endMonth = userToInsert.endMonth;
        }        
        
        
        // filter monthData by the filter.minMonth        
        users.map(function(u){
            for(var yyyymm in u.monthData){
                if (u.monthData[yyyymm].sum.cnt < filter.minMonth.cnt){
                    delete u.monthData[yyyymm];
                }
            }
        })

        // filter out users with less then a number of interaction month
        users = users.filter(function(u){
            return filter.minMonth.repeat <= Object.keys(u.monthData).length                            
        });

        // filter users by numbers
        users = users.filter(function(u){
            if (filter.min){
                for(var k in filter.min){
                    if (u.sums[k] < filter.min[k]) return false;
                }
            }
            return true;
        });
        
        
        users.sort(function(a,b){
            for(var i = 0; i < filter.orderBy.length; i++){
                if (a.sums[filter.orderBy[i]] > b.sums[filter.orderBy[i]]) return filter.descendingOrderBy?1:-1;
                if (a.sums[filter.orderBy[i]] < b.sums[filter.orderBy[i]]) return filter.descendingOrderBy?-1:1;
            }
            return 0;
        });                    
        
        var actualLine = 0;
        var lineUsageMap = {};
        var i = 0;

        users.map(function(user){
            ret.usermap[user.userid] = user;
        })

        
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
                    
                    // console.log(users[j][Object.keys(users[j])[0]].userid)
                    ret.regulars.push(users.splice(j,1)[0]);
                    j--;
                }
            } 
            lineUsageMap = {};
            actualLine++;   
            i++;             
        }
        // console.log('filtered users', ret.regulars);
        
        window.nametable = {}

        return ret;
    } 
    /**
     * draw(element, metadata, c, drawuserlist)
     *      metadata:
     *      c: constants of the drawing
     * 
     */
    
    function draw( metadata, params, drawuserlist ){
            
            var timelineElement = $('<div>',{'data-user': metadata.username, 'class':'timeline'});
            
            params.bottomY = params.offsetY + (params.lineHeight*(metadata.maxHeight+3));
            
            var timeline = SVG(timelineElement.get(0)).size(params.offsetX *2 + params.monthsWidth*metadata.months, params.bottomY*2);
            
            drawMainUserLine(timeline, params, metadata);
            
            window.u.draw.drawMonths(timeline, params, metadata)
            
            window.u.draw.drawMonthsText(timeline, params, metadata, 70)
            
            window.u.draw.drawMonthsText(timeline, params, metadata, params.bottomY)
                
            drawUsers(timeline, params, metadata, drawuserlist)                
            
            setTimeout(function(){
                createMouseOvers(drawuserlist);    
            },50)            
            
            return timelineElement;
            
    } 
     
    function drawUsers(timeline, params, d, userlist){
        for(var i = 0; i< userlist.length; i++){
            
            drawUserLines(timeline, params, d, userlist[i])
        }
    }
    
    function drawUserLines(timeline, params, d, user){     
        var index = 0
        var lastSlot = -1;   
        var lastMonthData = null;
        
        // iterate over the months
        for(var yyyymm in user.monthData){
                        
            var slot = whichSlot(d,yyyymm).slot;  
              
            var ld = {                    
                user: user,  
                monthData: user.monthData[yyyymm],
                lastMonthData: lastMonthData,
                slot: slot,          
                lastSlot: lastSlot,
                lastSlotStartX: lastSlot*params.monthsWidth,
                lastSlotEndX: (lastSlot+1)*params.monthsWidth,
                y2: user.y * params.lineHeight + params.offsetYp,
                slotStartX: slot*params.monthsWidth,
                slotEndX: (slot+1)*params.monthsWidth,
                params: params                                
            }
                        
            
            if (slot-lastSlot == 1){
                
            }else{
                if (slot-lastSlot<3 && lastSlot > 0){
                    drawFadedLine(timeline, ld);
                }
                else{                    
                    if (lastSlot>-1){                         
                        //drawExitingLineStraight(timeline, ld)
                        drawExitingLineWithIntensity(timeline, ld)
                    }
                    if (index == 0){
                        // drawEnteringLine(timeline, ld)
                        drawEnteringLineStraight(timeline, ld)                        
                    }
                    else{
                        ld.lastMonthData = null;
                        drawEnteringLineStraight(timeline, ld)
                    }
                    window.u.draw.createUserTextNode(timeline, user, ld.slotStartX-(params.monthsWidth/2), ld.y2-15)    
                }
                
            }
            drawSimpleSlotWithIntensity(timeline, ld);
            lastSlot = slot;
            lastMonthData = user.monthData[yyyymm];
            index++;
        }
        if (user.monthData){
            var firstSlot = whichSlot(d,Object.keys(user.monthData)[0]).slot;
            var stamp = {                    
                    user: user,
                    params: params,            
                    y2: user.y * params.lineHeight + params.offsetYp,
                    slotStartX: firstSlot * params.monthsWidth,
                    slotEndX: (firstSlot+1) * params.monthsWidth - params.margin                
                }
            if (!stamp.y2){
                console.error(user, 'no Y')
                debugger
                return;
            }
            drawLastInteractionCircle(timeline, params, d, user)
            window.u.draw.createUserTextNode(timeline, user, stamp.slotStartX-(params.monthsWidth/2), stamp.y2-15)
        }
        else{
            console.error('faulty user', user.name)
        }
    }
    
    
    function drawExitingLineWithIntensity(timeline, ld){
        var min = ld.params.defaultLineWidth /2 ;
        
        var p = {
            topFrom: min + (ld.lastMonthData.inbound[ld.params.sumkey] || 0) * ld.params.yscale,
            bottomFrom: min + (ld.lastMonthData.outbound[ld.params.sumkey] || 0) * ld.params.yscale, 
            topTo: min ,
            bottomTo:  min        
        }
        var topPath = u.draw.linePart(ld.lastSlotEndX, ld.lastSlotEndX + ld.params.monthsWidth, ld.y2, p.topFrom, p.topTo, true);
        var bottomPath = u.draw.linePart(ld.lastSlotEndX, ld.lastSlotEndX + ld.params.monthsWidth, ld.y2, p.bottomFrom, p.bottomTo, false);

        timeline.path( u.quadPathToString(topPath) ).attr({
                    fill: util(timeline).disappear(ld.user.color),
                    title: ld.user.name,                    
                    'data-userid': ld.user.userid,
        });            
        timeline.path( u.quadPathToString(bottomPath) ).attr({
                    fill: util(timeline).disappear(ld.user.color, ld.params.lowerLinePartAlpha),                    
                    
                    'data-userid': ld.user.userid,
                    title: ld.user.name,
                    'class': 'downside'
        });   
        
    }
    
    function drawSimpleSlot(timeline, ld){        
        timeline.line(ld.slotStartX, ld.y2, ld.slotEndX, ld.y2)
            .stroke({ 
                width: ld.c.defaultLineWidth, //+ (ientry.cnt/3), 
                color: ld.user.color
            }).attr({
                    'data-userid': ld.user.userid,                    
                    title: ld.user.name
            });
    }
    
    function drawSimpleSlotWithIntensity(timeline, ld){
        var min = ld.params.defaultLineWidth /2 ;
        var p = {
            topFrom: min,
            bottomFrom: min, 
            topTo: min + ((ld.monthData.inbound[ld.params.sumkey] || 0) * ld.params.yscale),
            bottomTo:  min + ((ld.monthData.outbound[ld.params.sumkey] || 0) * ld.params.yscale)       
        }
        if (ld.lastMonthData){
            p.topFrom = min + (ld.lastMonthData.inbound[ld.params.sumkey] || 0) * ld.params.yscale;
            p.bottomFrom = min + (ld.lastMonthData.outbound[ld.params.sumkey] || 0) * ld.params.yscale;
        }
        var topPath = u.draw.linePart(ld.slotStartX, ld.slotEndX, ld.y2, p.topFrom, p.topTo, true);
        var bottomPath = u.draw.linePart(ld.slotStartX, ld.slotEndX, ld.y2, p.bottomFrom, p.bottomTo, false);

        timeline.path(u.quadPathToString(topPath) ).attr({
                    fill: ld.user.color,
                    'data-userid': ld.user.userid,
                    title: ld.user.name
            });            
        timeline.path(u.quadPathToString(bottomPath) ).attr({
                    fill: tinycolor(ld.user.color || '#777').setAlpha(ld.params.lowerLinePartAlpha),                    
                    'data-userid': ld.user.userid,
                    'class': 'downside',
                    title: ld.user.name
            });           
    }
    
    
    function drawLastInteractionCircle(timeline, params, data, user){
        var min = params.defaultLineWidth /2;
        var lastMonthKey = Object.keys(user.monthData)[0];
        for(var yyyymm in user.monthData) if (lastMonthKey<yyyymm) lastMonthKey = yyyymm;
        var lastMonthData = user.monthData[lastMonthKey];
        var slot = whichSlot(data,lastMonthKey).slot;
        var slotEndX = (slot+1)*params.monthsWidth;
        var y2 = user.y * params.lineHeight + params.offsetYp;
        
        var topFrom = min + (lastMonthData.inbound[params.sumkey] || 0) * params.yscale;
        var bottomFrom = min + (lastMonthData.outbound[params.sumkey] || 0) * params.yscale;
        var topPath = u.draw.linePart(slotEndX, slotEndX + params.monthsWidth/2, y2, topFrom, min, true);
        var bottomPath = u.draw.linePart(slotEndX, slotEndX + params.monthsWidth/2, y2, bottomFrom, min, false);
        
        timeline.path(u.quadPathToString(topPath) ).attr(util().pathAttr(user, params, true));            
        timeline.path(u.quadPathToString(bottomPath) ).attr(util().pathAttr(user, params, false));           

        timeline.circle(7).attr({fill: user.color, cx: slotEndX + params.monthsWidth/2, cy: y2, 'data-userid': user.userid,})
    }
    
    function drawFadedLine(timeline, ld){
        
        var min = ld.params.defaultLineWidth /2 ;
        var p = {
            topFrom: min + (ld.lastMonthData.inbound[ld.params.sumkey] || 0) * ld.params.yscale,
            bottomFrom: min + (ld.lastMonthData.outbound[ld.params.sumkey] || 0) * ld.params.yscale, 
            topTo: min + ((ld.monthData.inbound[ld.params.sumkey] || 0) * ld.params.yscale),
            bottomTo:  min + ((ld.monthData.outbound[ld.params.sumkey] || 0) * ld.params.yscale)       
        }
        
        var topPath1 = u.draw.linePart(ld.lastSlotEndX, (ld.lastSlotEndX + ld.slotStartX)/2, ld.y2, p.topFrom, min, true);
        var bottomPath1 = u.draw.linePart(ld.lastSlotEndX, (ld.lastSlotEndX + ld.slotStartX)/2, ld.y2, p.bottomFrom, min, false);
        var topPath2 = u.draw.linePart((ld.lastSlotEndX + ld.slotStartX)/2, ld.slotStartX, ld.y2, min, p.topFrom, true);
        var bottomPath2 = u.draw.linePart((ld.lastSlotEndX + ld.slotStartX)/2,ld.slotStartX, ld.y2, min, p.bottomFrom, false);
        
        var attrTop = { fill: ld.user.color, 'data-userid': ld.user.userid }
        var attrBottom = { fill: tinycolor(ld.user.color || '#777').setAlpha(ld.params.lowerLinePartAlpha), 'data-userid': ld.user.userid, 'class': 'downside' }
        timeline.path(u.quadPathToString(topPath1) ).attr(attrTop);            
        timeline.path(u.quadPathToString(bottomPath1) ).attr(attrBottom);           
        timeline.path(u.quadPathToString(topPath2) ).attr(attrTop);            
        timeline.path(u.quadPathToString(bottomPath2) ).attr(attrBottom);    
                      
    }
    
    function drawEnteringLineStraight(timeline, ld){
        
        // The following line explained
        // http://stackoverflow.com/questions/21638169/svg-line-with-gradient-stroke-wont-display-straight
        timeline.line(ld.slotStartX-((ld.params.monthsWidth)/2), ld.y2+0.0001, ld.slotStartX, ld.y2)
            .attr({
                    fill: 'none',
                    'data-userid': ld.user.userid,                    
                    stroke: util(timeline).appear(ld.user.color),
                    'stroke-width': ld.params.defaultLineWidth
            });        
    }
    function drawFirstEnteringLineStraight(timeline, ld){
        
        // The following line explained
        // http://stackoverflow.com/questions/21638169/svg-line-with-gradient-stroke-wont-display-straight
        timeline.line(ld.slotStartX-((ld.params.monthsWidth)/2), ld.y2+0.0001, ld.slotStartX, ld.y2)
            .attr({
                    fill: 'none',
                    'data-userid': ld.user.userid,                    
                    stroke: util(timeline).appear(ld.user.color),
                    'stroke-width': ld.params.defaultLineWidth
            });        
    }
    
    function drawEnteringLine(timeline, ld){
        var enteringPath = {
            M: [ld.slotStartX, ld.y2], 
            Q: [    ld.slotStartX-(ld.params.monthsWidth/3), ld.y2,
                    (ld.slotStartX-(ld.params.monthsWidth)/2), (ld.y2+(ld.params.monthsWidth)/2)],
            T: [(ld.slotStartX-(ld.params.monthsWidth)/2), (ld.y2+(ld.params.monthsWidth)/2)]};
        
        timeline.path(u.quadPathToString(enteringPath)).attr({
            fill: 'none',
            'stroke-width': ld.params.defaultLineWidth, 
            stroke: util(timeline).appear(ld.user.color), //'red', //getUser(l.user.name).color,
            'data-userid': ld.user.userid,
            'class':'entering'
        });        
    }


    
    
    function createMouseOvers(users){
        
        for(var u in users){            
            var userid = users[u].userid            
            $('[data-userid="'+userid+'"]').each(function(i,o){                
                window.u.initMouseEvents(o, userid);                
            })
        }
    }
    
    
    function drawMainUserLine(timeline, c, d){
        
        timeline.line(c.offsetX-c.monthsWidth, c.offsetY, (d.months+1)*c.monthsWidth + c.offsetX, c.offsetY)
            .stroke({ width: 3, color: 'blue' });
            
        timeline.circle(5).attr({cx: c.offsetX - c.monthsWidth, cy: c.offsetY, fill: 'blue'});
        timeline.circle(15).attr({cx: (d.months+1) * c.monthsWidth + c.offsetX, cy: c.offsetY, fill: 'blue'});
        timeline.text(d.name);

    }
    
   

    function whichSlot(d, yyyymm){
        return {
            y: yyyymm.substr(0,4),
            m: yyyymm.substr(4,2),
            slot: moment(yyyymm,"YYYYMM").diff(moment(d.startSlot), 'months')
        }
    }

    function util(draw){
        return {
            disappear: function(color, alpha){
                alpha = alpha || 1;
                return draw.gradient('linear', function(stop) {
                    stop.at({ offset: 0, color: color, opacity: alpha })
                    stop.at({ offset: 1, color: 'rgba(255,255,255,0)' })
                })  
            },    
            appear: function(color, alpha){
                alpha = alpha || 1;
                return draw.gradient('linear', function(stop) {
                    stop.at({ offset: 0, color: 'rgba(255,255,255,0)' })
                    stop.at({ offset: 1, color: color, alpha })

                    // stop.at({ offset: 0, color: '#ff0000' })
                    // stop.at({ offset: 1, color: '#00ff00' })
                })  
            },
            fade: function(color){
                return draw.gradient('linear', function(stop) {
                    stop.at({ offset: 0, color: color })
                    stop.at({ offset: 1, color: color })                  
                })
            },
            pathAttr: function(user, c, top){
                
                return {
                    'data-userid': user.userid,
                    fill: top?(user.color || '#777'):(tinycolor(user.color || '#777').setAlpha(c.lowerLinePartAlpha)),
                    'class': top?'':'downside'
                }
            }
            
        }
         
    }
    
    
    
})(window.$, window.SVG, window.moment, window.u, window.Cookies, window.svgPanZoom, window.tinycolor)