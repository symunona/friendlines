(function (window, moment, $) {
    window.u = {}
    var data = 
    window.u.init = function(d){
        data = d
    } 
    window.u.addLineUsage = function (usageMap, user){    
        for(var yyyymm in user){        
            usageMap[yyyymm] = true;
        }    
    }

    window.u.addLineUsageWithPuffer = function(usageMap, user, rangeUp, rangeDown){    
        for(var yyyymm in user){        
            usageMap[yyyymm] = true;
        }    
        for(var yyyymm in user){
            for(var r = 1; r<= rangeUp; r++){       
                var rangeKey = moment(yyyymm, "YYYYMM").add(r, 'months').format('YYYYMM');     
                usageMap[rangeKey] = true;                    
            }            
            for(var r = 1; r<= rangeDown; r++){       
                var rangeKey = moment(yyyymm, "YYYYMM").add(-r, 'months').format('YYYYMM');     
                usageMap[rangeKey] = true;                    
            }            
        }
    }

    window.u.userFitsInLine = function(usageMap, user){
        for(var yyyymm in user){
            if (usageMap[yyyymm]) return false;
        }
        return true;
    }
    window.u.quadPathToString = function (obj){
            var str = '';
            for(var k in obj){             
                str+= k + ' ';
                for(var i = 0; i<obj[k].length; i=i+2){
                    str+= obj[k][i]+','+obj[k][i+1]+' ';   
                } 
            } 
            return str + ' ';
        }
        
    window.u.helperDrawControlPoints = function (timeline, q){
            timeline.circle(5).attr({ fill: 'green', cx: q.M[0], cy:q.M[1]})
            timeline.circle(5).attr({ fill: 'green', cx: q.T[0], cy:q.T[1]})
            if (q.Q){
                timeline.circle(3).attr({ fill: 'blue', cx: q.Q[0], cy:q.Q[1]})
                timeline.circle(3).attr({ fill: 'yellow', cx: q.Q[2], cy:q.Q[3]})  
            }
            if (q.q){
                timeline.circle(3).attr({ fill: 'yellow', cx: q.M[0] + q.q[0], cy: q.M[1] + q.q[1]})
                timeline.circle(3).attr({ fill: 'blue', cx: q.M[0] + q.q[2], cy: q.M[1] + q.q[3]})  
            } 
        }
        
        
    window.u.initMouseEvents = function (object, userid){
       object.onmouseover = function(){            
            // console.log('user:', data.usermap[user], 'line:');
            window.u.highlightUser(userid);      
            window.selectedUser(userid)            
        };
        object.onmouseout = function(){
            window.u.unlightUser(userid)
        };
        object.onclick = function(){            
            window.u.highlight2User(userid);
        }
    }    
        
    window.u.highlightUser = function (userid){
        var color = 'black'        
        $('[data-userid="'+userid+'"]').each(function(i,e){
             
            e.parentNode.appendChild(e);
            e.classList.add('highlight');            
            color = e.attributes.fill.value!='none'?e.attributes.fill.value:color;            
        })
        var username = window.nametable?(window.nametable[userid]?window.nametable[userid].name:false):false;
        window.sts(username || userid);
        window.stscolor(color)
    }     
    window.u.highlight2User = function (userid){

        var elements = document.getElementsByClassName('highlight2');
        for(var o in elements){
            if (elements[o].classList)
                elements[o].classList.remove('highlight2');
        }
        
        $('[data-userid="'+userid+'"]').each(function(i,e){
            e.classList.add('highlight2');                        
        })
    }
    window.u.unlightUser = function (userid){        
        $('[data-userid="'+userid+'"]').each(function(i,e){
            e.classList.remove('highlight');
        })
    }
   
        
    window.u.draw = {
        /**
         * linePart(x1, x2, y, fromHeight, toHeight, top)
         */
        linePart: function(x1, x2, y, fromHeight, toHeight, top){
            var addOrDerive = (top?-1:1);
            var path = {                
                M: [x1, y + (addOrDerive*fromHeight)],                
                Q: [x1+((x2-x1)/4), y + (addOrDerive*fromHeight), 
                (x1+x2)/2, y + (addOrDerive*(fromHeight+toHeight)/2)
                    ],
                T: [x2, y + (addOrDerive*toHeight)],
                L: [x2, y],
                l: [x1-x2, 0]                 
            }
            return path
        },
        createUserTextNode: function(timeline, user, x, y, align){
                    
            if (isNaN(x)|| isNaN(y)) debugger;
            
            var group = timeline.group();
            group.text(user.name).attr({ 
                        'font-size':'9px',
                        'font-style': 'italic',                    
                        fill: user.color,
                        'class': 'usertextnode'
                    });
                            
            group.attr({transform: 'translate('+x+','+y+')'});
            
            if (align == 'center'){
                var otherbox = group.node.getBBox();
                x = x-(otherbox.width/2);         
                group.attr({transform: 'translate('+x+','+y+')'});
            }
            
            return group;
        },
        drawMonths:  function (timeline, c, d){
            
            for(var m = -1; m <= d.months; m++){            
                var newYear = moment(d.startSlot).add(m, 'month').month() == 0;
                timeline.line(m*c.monthsWidth + c.offsetX, c.offsetY-c.strokeY, m*c.monthsWidth + c.offsetX, c.bottomY)
                    .stroke({ width: newYear?3:1, color: '#ddd' });
            }
        },
        drawMonthsText: function(timeline, params, d, y, color){
        
            for(var m = 0; m < d.months; m++){
                
                var monthText = moment(d.startSlot).add(m, 'month').format('MMM');
                var newYear = moment(d.startSlot).add(m, 'month').month() == 0;
                if (newYear){
                    timeline.text(moment(d.startSlot).add(m, 'month').format('YYYY'))
                        .attr({
                            x: m*params.monthsWidth + params.offsetX, 
                            y: y,  
                            'font-size':'15px'})                
                } 
                
                timeline.text(monthText).attr({
                    x: m*params.monthsWidth + params.offsetX, 
                    y: y - ((m%3+1)*params.lineHeight/3),  
                    'font-size':'10px',
                    fill: color || '#999'
                    })            
            }
        }
            
    }
    
    window.loadJS = function (filename){    
        var fileref=document.createElement('script')
        fileref.setAttribute("type","text/javascript")
        fileref.setAttribute("src", filename)
        document.getElementsByTagName("head")[0].appendChild(fileref)
    }
    

})(window, window.moment, window.$)