var data; 
var actualStat;  


(function ($, SVG, moment) {

    console.log("STAT 2")

    var colors = ["#589A06","#9F60FC","#7C6108","#429C19","#0CC16A","#C80F5D","#DB1492","#03BE7F","#13733F","#9E63B0","#6700A8","#56C12F","#9FD81D","#C5A782","#A1972D","#D1AAF6","#906480","#DC23A8","#8A5934","#9461D7","#2A31B3","#5F17BF","#D2C3DC","#A6D067","#7CD34F","#541972","#59B3EE","#242B51","#48A7D0","#133C38","#F76C3E","#41314A","#43766D","#AAD486","#0D4218","#35A9F9","#D71D60","#2932DC","#376A94","#576A4B","#8ED46A","#4C713D","#7DDE47","#DC7060","#858B6B","#B71DBF","#3B6FC1","#2C8F55","#C0763C","#634612","#5AA5A5","#7ABC98","#E0D0AD","#EE5A4E","#456DE6","#E3D631","#512BF7","#6911A2","#5B1C68","#34CD58","#4AA0F7","#827DA6","#FC45B5","#71DE9B","#C79C85","#D1F789","#663F93","#FE1222","#0248D7","#45DB28","#183329","#2747CE","#846E72","#D49735","#56F6AE","#946053","#55C5B8","#A15F4B","#00A7DA","#1C2086","#0E71EA","#AE6269","#8E248C","#E9672E","#66D8AE","#764327","#3E265C","#2BB795","#FC71B4","#750977","#A14DDE","#2544CC","#90803E","#5DED8C","#EBF0CE","#8F6D07","#C0D15E","#F67ACC","#76EA9B","#60624E","#852D38","#5663EC","#B669B7","#AF4107","#B16D74","#44C7E8","#C4FBA1","#19D156","#DDFBAA","#413A18","#E51127","#99BFA4","#85EF99","#8C5D68","#3559ED","#EA3E0C","#02F31A","#9AFF83","#753517","#C5CB17","#C58120","#DE8117","#402AA9","#7DA835","#6ECC77","#608D68","#5B433D","#437BC3","#E5F66E","#7C8648","#96C5C2","#DAC8F2","#18B866","#F62226","#7259BC","#379982","#D2C05C","#8EC608","#A4EFE0","#244965","#095DC0","#3398CC","#0672F1","#83D981","#170AFC","#6B95C9","#563794","#CC0711","#9F1787","#C8DA8D","#3EDD71","#F1C01E","#371AC1","#B56DA3","#72A7D6","#B4B034","#4C89A3","#007FA6","#40D5DF","#6EC0ED","#7946E3","#320B21","#795A44","#7BE791","#52DE1C","#82DF02","#A69E72","#A79082","#97FB5E","#685E09","#0ED652","#C24A56","#5F7E22","#9BECC8","#8A9AC9","#67865F","#DA59AA","#7AC21C","#CEAE3A","#F6F409","#B90A46","#F90875","#E9EE20","#AD239D","#0A86EF","#EEC57D","#84F9EE","#47BDB3","#890EC8","#1466D8","#4F7758","#D3F521","#F21065","#A15F4B","#00A7DA","#1C2086","#0E71EA","#AE6269","#8E248C","#E9672E","#66D8AE","#764327","#3E265C","#2BB795","#FC71B4","#750977","#A14DDE","#2544CC","#90803E","#5DED8C","#EBF0CE","#8F6D07","#C0D15E","#F67ACC","#76EA9B","#60624E","#852D38","#5663EC","#B669B7","#AF4107","#B16D74","#44C7E8","#C4FBA1","#19D156","#DDFBAA","#413A18","#E51127","#99BFA4","#85EF99","#8C5D68","#3559ED","#EA3E0C","#02F31A","#9AFF83","#753517","#C5CB17","#C58120","#DE8117","#402AA9","#7DA835","#6ECC77","#608D68","#5B433D","#437BC3","#E5F66E","#7C8648","#96C5C2","#DAC8F2","#18B866","#F62226","#7259BC","#379982","#D2C05C","#8EC608","#A4EFE0","#244965","#095DC0","#3398CC","#0672F1","#83D981","#170AFC","#6B95C9","#563794","#CC0711","#9F1787","#C8DA8D","#3EDD71","#F1C01E","#371AC1","#B56DA3","#72A7D6","#B4B034","#4C89A3","#007FA6","#40D5DF","#6EC0ED","#7946E3","#320B21","#795A44","#7BE791","#52DE1C","#82DF02","#A69E72","#A79082","#97FB5E","#685E09","#0ED652","#C24A56","#5F7E22","#9BECC8","#8A9AC9","#67865F","#DA59AA","#7AC21C","#CEAE3A","#F6F409","#B90A46","#F90875","#E9EE20","#AD239D","#0A86EF","#EEC57D","#84F9EE","#47BDB3","#890EC8","#1466D8","#4F7758","#D3F521","#F21065","#90803E","#5DED8C","#EBF0CE","#8F6D07","#C0D15E","#F67ACC","#76EA9B","#60624E","#852D38","#5663EC","#B669B7","#AF4107","#B16D74","#44C7E8","#C4FBA1","#19D156","#DDFBAA","#413A18","#E51127","#99BFA4","#85EF99","#8C5D68","#3559ED","#EA3E0C","#02F31A","#9AFF83","#753517","#C5CB17","#C58120","#DE8117","#402AA9","#7DA835","#6ECC77","#608D68","#5B433D","#437BC3","#E5F66E","#7C8648","#96C5C2","#DAC8F2","#18B866","#F62226","#7259BC","#379982","#D2C05C","#8EC608","#A4EFE0","#244965","#095DC0","#3398CC","#0672F1","#83D981","#170AFC","#6B95C9","#563794","#CC0711","#9F1787","#C8DA8D","#3EDD71","#F1C01E","#371AC1","#B56DA3","#72A7D6","#B4B034","#4C89A3","#007FA6","#40D5DF","#6EC0ED","#7946E3","#320B21","#795A44","#7BE791","#52DE1C","#82DF02","#A69E72","#A79082","#97FB5E","#685E09","#0ED652","#C24A56","#5F7E22","#9BECC8","#8A9AC9","#67865F","#DA59AA","#7AC21C","#CEAE3A","#F6F409","#B90A46","#F90875","#E9EE20","#AD239D","#0A86EF","#EEC57D","#84F9EE","#47BDB3","#890EC8","#1466D8","#4F7758","#D3F521","#F21065","#90803E","#5DED8C","#EBF0CE","#8F6D07","#C0D15E","#F67ACC","#76EA9B","#60624E","#852D38","#5663EC","#B669B7","#AF4107","#B16D74","#44C7E8","#C4FBA1","#19D156","#DDFBAA","#413A18","#E51127","#99BFA4","#85EF99","#8C5D68","#3559ED","#EA3E0C","#02F31A","#9AFF83","#753517","#C5CB17","#C58120","#DE8117","#402AA9","#7DA835","#6ECC77","#608D68","#5B433D","#437BC3","#E5F66E","#7C8648","#96C5C2","#DAC8F2","#18B866","#F62226","#7259BC","#379982","#D2C05C","#8EC608","#A4EFE0","#244965","#095DC0","#3398CC","#0672F1","#83D981","#170AFC","#6B95C9","#563794","#CC0711","#9F1787","#C8DA8D","#3EDD71","#F1C01E","#371AC1","#B56DA3","#72A7D6","#B4B034","#4C89A3","#007FA6","#40D5DF","#6EC0ED","#7946E3","#320B21","#795A44","#7BE791","#52DE1C","#82DF02","#A69E72","#A79082","#97FB5E","#685E09","#0ED652","#C24A56","#5F7E22","#9BECC8","#8A9AC9","#67865F","#DA59AA","#7AC21C","#CEAE3A","#F6F409","#B90A46","#F90875","#E9EE20","#AD239D","#0A86EF","#EEC57D","#84F9EE","#47BDB3","#890EC8","#1466D8","#4F7758","#D3F521","#F21065"];
    
    var c = {         
        lineHeight: 25,
        offsetY: 50,
        offsetYp: 75,
        offsetX: 50,
        strokeY: 10,        
        monthsWidth: 100,
        margin: 15,
        emptyMonthsAway: 3,
        defaultLineWidth: 3,
        thinLineWidth: 1
                
    }
    
    $.getJSON("data/statlist.json", function (d) {
        for(var i = 0; i<d.length; i++){
            
            var a = $('<a>',{                    
                    'data-filename': d[i].fileName
                    }).html(d[i].name).on('click',function(){
                                console.log('loading... ',this.dataset.filename)
                                loadStat2(this.dataset.filename)
                        })
            $('#statlist').append($('<li>').append(a));
            
        }
        loadStat2(d[0].fileName)
    })    
     
     
    function loadStat2(filename){
        var dataSource = 'data/stats.'+filename+'.3.json' 
        console.log(dataSource)
        $.getJSON(dataSource, function (d) {   
            
            // check if already loaded
            if ($('.timeline[data-user="'+filename+'"]').length){
                $('.timeline').hide();
                $('.timeline[data-user="'+filename+'"]').show()
                return;
            }
            $('.timeline').hide();
            var timelineElement = $('<div>',{'data-user': filename, 'class':'timeline'});
            $('#timeline').append(timelineElement)         
            
            data = d;
            console.log(d);
            generateUserColors(d.userActivity);
            
            c.bottomY = c.offsetY + (c.lineHeight*(d.maxHeight+3));
            
            var timeline = SVG(timelineElement.get(0)).size(c.offsetX *2 + c.monthsWidth*d.months, c.bottomY*2);

            drawMonths(timeline, c, d)
            
            drawMonthsText(timeline, c, d, 70)
                
            drawUsers(timeline, c, d)                
            
            createMouseOvers(d.userActivity);

        });
    } 
     
    function drawUsers(timeline, c, d){
        for(var i = 0; i< d.regulars.length; i++){
            drawUserLines(timeline, c, d, d.regulars[i])
        }
    }
    function drawUserLines(timeline, c, d, user){     
        var index = 0
        var lastSlot = -1;   
        var lastMonth = Object.keys(user.monthData)[Object.keys(user.monthData).length-1];
        for(var yyyymm in user.monthData){
            
            var slot = whichSlot(d,yyyymm).slot;            
            var ld = {                    
                user: user.name,  
                slot: slot,          
                lastSlot: lastSlot,
                lastSlotEndX: (lastSlot+1)*c.monthsWidth,
                y2: user.y * c.lineHeight + c.offsetYp,
                slotStartX: slot*c.monthsWidth,
                slotEndX: (slot+1)*c.monthsWidth                
            }
            
            drawSimpleSlot(timeline, ld);
            if (slot-lastSlot == 1){
                
            }else{
                if (slot-lastSlot<3 && lastSlot > 0){
                    drawFadedLine(timeline, ld);
                }
                else{                    
                    if (lastSlot>-1){
                        drawExitingLine(timeline, ld)
                    }
                    drawEnteringLine(timeline, ld)
                    createUserTextNode(timeline, user.name, ld.slotStartX, ld.y2)    
                }
                
            }
            if (yyyymm == lastMonth){
                timeline.circle(7).attr({fill: getUser(ld.user).color, cx: ld.slotEndX, cy: ld.y2})
            }
            lastSlot = slot;
            index++;
        }
        if (user.monthData){
            var firstSlot = whichSlot(d,Object.keys(user.monthData)[0]).slot;
            var stamp = {                    
                    user: user.name,            
                    y2: user.y * c.lineHeight + c.offsetYp,
                    slotStartX: firstSlot*c.monthsWidth,
                    slotEndX: (firstSlot+1)*c.monthsWidth - c.margin                
                }
            if (!stamp.y2){
                console.error(user, 'no Y')
                return;
            }
            createUserTextNode(timeline, user.name, stamp.slotStartX, stamp.y2)
        }
        else{
            console.error('faulty user', user.name)
        }
    }
    
    function drawRegularLine(timeline, c, l){

        if (!l.fromSlot || !l.toSlot){ console.log("faulty line: ", l); return;}
        
        for(var i = 0; i<l.intensityArray.length; i++){
            
            var ientry = l.intensityArray[i];            
            var ld = {
                ientry: l.intensityArray[i],    
                user: l.user.name,            
                y2: ientry.order * c.lineHeight + c.offsetYp,
                slotStartX: ientry.timeslot*c.monthsWidth + (i==0?0:c.margin),
                slotEndX: (ientry.timeslot+1)*c.monthsWidth - c.margin                
            }
        
            drawSimpleSlot(timeline, ld);
                       
            // entering line                        
            if ( i == 0 ||  (ientry.timeslot-(l.intensityArray[i-1]).timeslot) > c.emptyMonthsAway){    
                drawEnteringLine(timeline, ld)                
                
            }        
            // link the two
            if ( i < l.intensityArray.length-1 ){
                
                // if away, for more than emptyMonthsAway(3) month, drive out                
                if ((l.intensityArray[i+1].timeslot-ld.ientry.timeslot) > c.emptyMonthsAway){
                    drawExitingLine(timeline, ld)                    
                }
                else{
                    linkTwoSlots(timeline, ld, l.intensityArray[i+1]);                   
                }                
            }        
        }
        var entryEnd = l.intensityArray[l.intensityArray.length-1];
        timeline.circle(7).attr({fill: getUser(ld.user).color, cx: ld.slotEndX, cy: ld.y2})
     
    }
    
    function linkTwoSlots(timeline, ld, nextentry){
        // simple quadratic link
        var y2next = nextentry.order * c.lineHeight + c.offsetYp;
        var slotStartXnext = nextentry.timeslot*c.monthsWidth + c.margin;
        var path = {
            M: [ld.slotEndX, ld.y2], 
            Q: [ld.slotEndX+(c.monthsWidth/2),ld.y2,
                    (ld.slotEndX+slotStartXnext)/2, (ld.y2+y2next)/2],
            T: [slotStartXnext, y2next]};        
        timeline.path(quadPathToString(path)).attr({
            fill: 'none',
            'stroke-width': c.defaultLineWidth, 
            stroke: getUser(ld.user).color,
            'data-username':ld.user
        }); 
    }
    function drawExitingLine(timeline, ld){
        var path = {
            M: [ld.lastSlotEndX, ld.y2], 
            Q: [    ld.lastSlotEndX+(c.monthsWidth/3),ld.y2,
                    (ld.lastSlotEndX+(c.monthsWidth)/2), (ld.y2+(c.monthsWidth)/2)],
            T: [(ld.lastSlotEndX+(c.monthsWidth)/2), (ld.y2+(c.monthsWidth)/2)]};
                            
        timeline.path(quadPathToString(path)).attr({
            fill: 'none',
            'stroke-width': c.defaultLineWidth, 
            stroke: util(timeline).disappear(getUser(ld.user).color), //'red', //getUser(l.user.name).color,
            'data-username':ld.user
        });
    }
    
    function drawSimpleSlot(timeline, ld){
        timeline.line(ld.slotStartX, ld.y2, ld.slotEndX, ld.y2)
            .stroke({ 
                width: c.defaultLineWidth, //+ (ientry.cnt/3), 
                color: getUser(ld.user).color
            }).attr({
                    'data-username': ld.user
            });
    }
    function drawFadedLine(timeline, ld){
        timeline.line(ld.lastSlotEndX, ld.y2, ld.slotStartX, ld.y2)
            .stroke({ 
                width: c.thinLineWidth, //+ (ientry.cnt/3), 
                color: getUser(ld.user).color
            }).attr({
                    'data-username': ld.user
            });
    }
    
    function drawEnteringLine(timeline, ld){
        var enteringPath = {
            M: [ld.slotStartX, ld.y2], 
            Q: [    ld.slotStartX-(c.monthsWidth/3), ld.y2,
                    (ld.slotStartX-(c.monthsWidth)/2), (ld.y2+(c.monthsWidth)/2)],
            T: [(ld.slotStartX-(c.monthsWidth)/2), (ld.y2+(c.monthsWidth)/2)]};
        
        timeline.path(quadPathToString(enteringPath)).attr({
            fill: 'none',
            'stroke-width': c.defaultLineWidth, 
            stroke: util(timeline).appear(getUser(ld.user).color), //'red', //getUser(l.user.name).color,
            'data-username':ld.user
        });        
    }
    
    function drawRegularLines(timeline, c, d){
        for (var lineIndex = 0; lineIndex < d.lines.length; lineIndex++) {            
            drawRegularLine(timeline, c, d.lines[lineIndex])            
        }        
    }
    
    function highlightUser(user){                
        $('[data-username="'+user+'"]').each(function(i,e){
            e.classList.add('highlight');            
        })
    }
    
    function highlight2User(user){

        var elements = document.getElementsByClassName('highlight2');
        for(var o in elements){
            if (elements[o].classList)
                elements[o].classList.remove('highlight2');
        }
        
        $('[data-username="'+user+'"]').each(function(i,e){
            e.classList.add('highlight2');                        
        })
    }
    
    function unlightUser(user){        
        $('[data-username="'+user+'"]').each(function(i,e){
            e.classList.remove('highlight');
            //$(e).removeClass('highlight');
        })
    }
    
    function createUserTextNode(timeline, user, x, y, align, line){
        
        var group = timeline.group();
        var txt = group.text(user).attr({ 
                    'font-size':'9px',
                    'font-style': 'italic',                    
                    fill: 'white'
                });
        // this is a recurring user
        if (getUser(user).cnt > 1){
            
            var rect = group.rect(10,10).attr({ fill: getUser(user).color })             
            var box = group.node.getBBox();
            rect.attr({height: box.height+3, width: box.width+5})               
            group.add(txt.remove());
        }
        else{
            txt.attr({ fill: getUser(user).color });
        }
        
        group.attr({transform: 'translate('+x+','+y+')'});
        if (align == 'center'){
            var box = group.node.getBBox();
            x = x-(box.width/2);         
            group.attr({transform: 'translate('+x+','+y+')'});
        }
        
        group.attr({'data-username':user, 'data-lonely':getUser(user).cnt == 1});
        
        // addObjectToUser(group);
        
        return group;
    }
    
    function quadPathToString(obj){
        var str = '';
        for(var k in obj){             
            str+= k + ' ';
            for(var i = 0; i<obj[k].length; i=i+2){
                str+= obj[k][i]+','+obj[k][i+1]+' ';   
            } 
        } 
        return str;
    }
    
    function createMouseOvers(users){

        for(var u in users){
            $('[data-username="'+u+'"]').each(function(i,o){
                initMouseEvents(o, u);                
            })
        }
    }
    
    function initMouseEvents(object, user){
       object.onmouseover = function(){            
            // console.log('user:', data.usermap[user], 'line:');
            highlightUser(user);                  
        };
        object.onmouseout = function(){
            unlightUser(user)
        };
        object.onclick = function(){
            console.log('selected user', user)
            highlight2User(user);
        }
    }

    function generateUserColors(array){
        var i = 0;
        for(var u in array){
            array[u].color = colors[i++]; 
        }
    }
   
    function getUser(key){
        
        if (!data.userActivity[key]) return { name: 'INVALID USER', color: 'red', cnt: 0};        
        return data.userActivity[key];
    }
    
    function drawMainUserLine(timeline, c, d){
        
        timeline.line(c.offsetX, c.offsetY, d.months*c.monthsWidth + c.offsetX, c.offsetY)
            .stroke({ width: 3, color: 'blue' });
            
        timeline.circle(5).attr({cx: c.offsetX, cy: c.offsetY, fill: 'blue'});
        timeline.circle(15).attr({cx: d.months*c.monthsWidth + c.offsetX, cy: c.offsetY, fill: 'blue'});
        timeline.text(d.name).attr({style: 'fill'+getUser(d.name).color});

    }
    
    function drawMonths(timeline, c, d){
        
        for(var m = 0; m < d.months; m++){            
            var newYear = moment(d.startSlot).add(m, 'month').month() == 0;
            timeline.line(m*c.monthsWidth + c.offsetX, c.offsetY-c.strokeY, m*c.monthsWidth + c.offsetX, c.bottomY)
                .stroke({ width: newYear?3:1, color: '#ddd' });
        }
    }
    function drawMonthsText(timeline, c, d, y){
        
        for(var m = 0; m < d.months; m++){
            
            var monthText = moment(d.startSlot).add(m, 'month').format('MMM');
            var newYear = moment(d.startSlot).add(m, 'month').month() == 0;
            if (newYear){
                timeline.text(moment(d.startSlot).add(m, 'month').format('YYYY'))
                    .attr({
                        x: m*c.monthsWidth + c.offsetX, 
                        y: y,  
                        'font-size':'13px'})                
            } 
            
            timeline.text(monthText).attr({
                x: m*c.monthsWidth + c.offsetX, 
                y: y - ((m%3+1)*c.lineHeight/3),  
                'font-size':'10px'})            
        }
    }
    
    function drawTrespassers(timeline, c, d){
    
        for(var timeslot = 0; timeslot < d.months; timeslot++){
            var trespassersForTheMonth = d.trespassers.filter(function(mrt){return mrt.fromSlot == timeslot});    
            for (var ti = 0; ti < trespassersForTheMonth.length ; ti ++){
                var t = trespassersForTheMonth[ti];
                var x = c.offsetX+(t.fromSlot * c.monthsWidth)+(c.monthsWidth/2*(ti%2));
                var y = c.bottomY+((2+ti)*c.lineHeight)
                
                var u = createUserTextNode(timeline, t.user.name, x, y);                
                u.attr({transform: u.attr('transform')+'rotate(20)'});
            }            
                
        }
    }
    
    function drawRegularLine2(timeline, c, l){
            var y = c.offsetY + c.lineHeight + (c.lineHeight * l.y);
            
            if (!l.fromSlot || !l.toSlot){
                console.log("faulty line: ", l);
                return;
            }
            
            if (l.toSlot - l.fromSlot > 1){
                var x1 = c.offsetX+(l.fromSlot * c.monthsWidth);
                var x2 = c.offsetX + (l.toSlot * c.monthsWidth);
                var x = (x1+x2)/2;
                
                timeline.line(x1, y, x2, y).stroke({ width: 2, color: getUser(l.user.name).color }); 
                    
                createUserTextNode(timeline, l.user.name, x, y, 'center', l);
               
            }

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
            disappear: function(color){
                return draw.gradient('linear', function(stop) {
                    stop.at({ offset: 0, color: color })
                    stop.at({ offset: 1, color: 'rgba(255,255,255,0)' })
                })  
            },    
            appear: function(color){
                return draw.gradient('linear', function(stop) {
                    stop.at({ offset: 0, color: 'rgba(255,255,255,0)' })
                    stop.at({ offset: 1, color: color })
                })  
            }    
        }
         
    }
    
})(window.$, window.SVG, window.moment)