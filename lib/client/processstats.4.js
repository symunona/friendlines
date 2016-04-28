var data; 
var actualStat;  
var filter;
var cookieKey;

(function ($, SVG, moment, u, Cookie, svgPanZoom, tinycolor) {

    cookieKey = 'myFilter4.';
    console.log("STAT 4")

    var colors = ["#589A06","#9F60FC","#7C6108","#429C19","#0CC16A","#C80F5D","#DB1492","#03BE7F","#13733F","#9E63B0","#6700A8","#56C12F","#9FD81D","#C5A782","#A1972D","#D1AAF6","#906480","#DC23A8","#8A5934","#9461D7","#2A31B3","#5F17BF","#D2C3DC","#A6D067","#7CD34F","#541972","#59B3EE","#242B51","#48A7D0","#133C38","#F76C3E","#41314A","#43766D","#AAD486","#0D4218","#35A9F9","#D71D60","#2932DC","#376A94","#576A4B","#8ED46A","#4C713D","#7DDE47","#DC7060","#858B6B","#B71DBF","#3B6FC1","#2C8F55","#C0763C","#634612","#5AA5A5","#7ABC98","#E0D0AD","#EE5A4E","#456DE6","#E3D631","#512BF7","#6911A2","#5B1C68","#34CD58","#4AA0F7","#827DA6","#FC45B5","#71DE9B","#C79C85","#D1F789","#663F93","#FE1222","#0248D7","#45DB28","#183329","#2747CE","#846E72","#D49735","#56F6AE","#946053","#55C5B8","#A15F4B","#00A7DA","#1C2086","#0E71EA","#AE6269","#8E248C","#E9672E","#66D8AE","#764327","#3E265C","#2BB795","#FC71B4","#750977","#A14DDE","#2544CC","#90803E","#5DED8C","#8F6D07","#C0D15E","#F67ACC","#76EA9B","#60624E","#852D38","#5663EC","#B669B7","#AF4107","#B16D74","#44C7E8","#C4FBA1","#19D156","#DDFBAA","#413A18","#E51127","#99BFA4","#85EF99","#8C5D68","#3559ED","#EA3E0C","#02F31A","#9AFF83","#753517","#C5CB17","#C58120","#DE8117","#402AA9","#7DA835","#6ECC77","#608D68","#5B433D","#437BC3","#E5F66E","#7C8648","#96C5C2","#DAC8F2","#18B866","#F62226","#7259BC","#379982","#D2C05C","#8EC608","#A4EFE0","#244965","#095DC0","#3398CC","#0672F1","#83D981","#170AFC","#6B95C9","#563794","#CC0711","#9F1787","#C8DA8D","#3EDD71","#F1C01E","#371AC1","#B56DA3","#72A7D6","#B4B034","#4C89A3","#007FA6","#40D5DF","#6EC0ED","#7946E3","#320B21","#795A44","#7BE791","#52DE1C","#82DF02","#A69E72","#A79082","#97FB5E","#685E09","#0ED652","#C24A56","#5F7E22","#9BECC8","#8A9AC9","#67865F","#DA59AA","#7AC21C","#CEAE3A","#F6F409","#B90A46","#F90875","#E9EE20","#AD239D","#0A86EF","#EEC57D","#84F9EE","#47BDB3","#890EC8","#1466D8","#4F7758","#D3F521","#F21065","#A15F4B","#00A7DA","#1C2086","#0E71EA","#AE6269","#8E248C","#E9672E","#66D8AE","#764327","#3E265C","#2BB795","#FC71B4","#750977","#A14DDE","#2544CC","#90803E","#5DED8C","#8F6D07","#C0D15E","#F67ACC","#76EA9B","#60624E","#852D38","#5663EC","#B669B7","#AF4107","#B16D74","#44C7E8","#C4FBA1","#19D156","#DDFBAA","#413A18","#E51127","#99BFA4","#85EF99","#8C5D68","#3559ED","#EA3E0C","#02F31A","#9AFF83","#753517","#C5CB17","#C58120","#DE8117","#402AA9","#7DA835","#6ECC77","#608D68","#5B433D","#437BC3","#E5F66E","#7C8648","#96C5C2","#DAC8F2","#18B866","#F62226","#7259BC","#379982","#D2C05C","#8EC608","#A4EFE0","#244965","#095DC0","#3398CC","#0672F1","#83D981","#170AFC","#6B95C9","#563794","#CC0711","#9F1787","#C8DA8D","#3EDD71","#F1C01E","#371AC1","#B56DA3","#72A7D6","#B4B034","#4C89A3","#007FA6","#40D5DF","#6EC0ED","#7946E3","#320B21","#795A44","#7BE791","#52DE1C","#82DF02","#A69E72","#A79082","#97FB5E","#685E09","#0ED652","#C24A56","#5F7E22","#9BECC8","#8A9AC9","#67865F","#DA59AA","#7AC21C","#CEAE3A","#F6F409","#B90A46","#F90875","#E9EE20","#AD239D","#0A86EF","#EEC57D","#84F9EE","#47BDB3","#890EC8","#1466D8","#4F7758","#D3F521","#F21065","#90803E","#5DED8C","#EBF0CE","#8F6D07","#C0D15E","#F67ACC","#76EA9B","#60624E","#852D38","#5663EC","#B669B7","#AF4107","#B16D74","#44C7E8","#C4FBA1","#19D156","#DDFBAA","#413A18","#E51127","#99BFA4","#85EF99","#8C5D68","#3559ED","#EA3E0C","#02F31A","#9AFF83","#753517","#C5CB17","#C58120","#DE8117","#402AA9","#7DA835","#6ECC77","#608D68","#5B433D","#437BC3","#E5F66E","#7C8648","#96C5C2","#DAC8F2","#18B866","#F62226","#7259BC","#379982","#D2C05C","#8EC608","#A4EFE0","#244965","#095DC0","#3398CC","#0672F1","#83D981","#170AFC","#6B95C9","#563794","#CC0711","#9F1787","#C8DA8D","#3EDD71","#F1C01E","#371AC1","#B56DA3","#72A7D6","#B4B034","#4C89A3","#007FA6","#40D5DF","#6EC0ED","#7946E3","#320B21","#795A44","#7BE791","#52DE1C","#82DF02","#A69E72","#A79082","#97FB5E","#685E09","#0ED652","#C24A56","#5F7E22","#9BECC8","#8A9AC9","#67865F","#DA59AA","#7AC21C","#CEAE3A","#F6F409","#B90A46","#F90875","#E9EE20","#AD239D","#0A86EF","#EEC57D","#84F9EE","#47BDB3","#890EC8","#1466D8","#4F7758","#D3F521","#F21065","#90803E","#5DED8C","#8F6D07","#C0D15E","#F67ACC","#76EA9B","#60624E","#852D38","#5663EC","#B669B7","#AF4107","#B16D74","#44C7E8","#C4FBA1","#19D156","#DDFBAA","#413A18","#E51127","#99BFA4","#85EF99","#8C5D68","#3559ED","#EA3E0C","#02F31A","#9AFF83","#753517","#C5CB17","#C58120","#DE8117","#402AA9","#7DA835","#6ECC77","#608D68","#5B433D","#437BC3","#E5F66E","#7C8648","#96C5C2","#DAC8F2","#18B866","#F62226","#7259BC","#379982","#D2C05C","#8EC608","#A4EFE0","#244965","#095DC0","#3398CC","#0672F1","#83D981","#170AFC","#6B95C9","#563794","#CC0711","#9F1787","#C8DA8D","#3EDD71","#F1C01E","#371AC1","#B56DA3","#72A7D6","#B4B034","#4C89A3","#007FA6","#40D5DF","#6EC0ED","#7946E3","#320B21","#795A44","#7BE791","#52DE1C","#82DF02","#A69E72","#A79082","#97FB5E","#685E09","#0ED652","#C24A56","#5F7E22","#9BECC8","#8A9AC9","#67865F","#DA59AA","#7AC21C","#CEAE3A","#F6F409","#B90A46","#F90875","#E9EE20","#AD239D","#0A86EF","#EEC57D","#84F9EE","#47BDB3","#890EC8","#1466D8","#4F7758","#D3F521","#F21065"];
    
    var params = {
        sumkey: 'leng',
        yscale: 0.01,
        userFilter: {}
    }
    
    var c = {         
        lineHeight: 50,
        offsetY: 50,
        offsetYp: 75,
        offsetX: 50,
        strokeY: 10,        
        monthsWidth: 100,
        margin: 15,
        emptyMonthsAway: 3,
        defaultLineWidth: 3,
        thinLineWidth: 1,
        lowerLinePartAlpha: .8                
    }
    
    $.getJSON("data/statlist.json", function (d) {
        for(var i = 0; i<d.length; i++){
            
            var a = $('<a>',{                    
                    'data-filename': d[i].fileName
                    }).html(d[i].name).on('click',function(){
                                console.log('loading... ',this.dataset.filename)
                                loadStat3(this.dataset.filename)
                        })
            $('#statlist').append($('<li>').append(a));
        }

        loadStat3(d[0].fileName)
    })    
    
    
    function init(){
        $('#filter').show();
        
        if (Cookie.get(cookieKey+actualStat)){            
            filter = JSON.parse(Cookie.get(cookieKey+actualStat));
            // console.log('found cookie',cookieKey+actualStat, filter)
        }
        else{
            filter = {
                    orderBy: ['leng', 'cnt'],
                    descendingOrderBy: true,
                    min:{
                        cnt: 10,
                        leng: 100
                    },
                    minMonth:{
                        repeat: 2,
                        cnt: 3                    
                    }                    
                }            
        }        
        $('#minsumcount').val(filter.min.cnt);
        $('#minsumlength').val(filter.min.leng);
        $('#minactivefollowinmonth').val(filter.minMonth.repeat);
        $('#minmonthcount').val(filter.minMonth.cnt);
        $('#orderby1').val(filter.orderBy[0]);             
        $('#orderby2').val(filter.orderBy[1]);
        if (filter.descendingOrderBy) $('#descendingOrderBy').attr('checked',true);

    }    
    function getFilter(){
        filter.min.cnt = $('#minsumcount').val();
        filter.min.leng = $('#minsumlength').val();
        filter.minMonth.repeat = $('#minactivefollowinmonth').val();
        filter.minMonth.cnt = $('#minmonthcount').val();
        filter.orderBy[0] = $('#orderby1').val();
        filter.orderBy[1] = $('#orderby2').val();
        filter.descendingOrderBy = $('#descendingOrderBy').is(':checked');
        Cookie.set(cookieKey+actualStat, filter, {expires: 9999});
        // console.log('saving filter',filter)
        return filter;
    }
    
    function process1(ret, filter){
        
        ret.regulars = [];
        ret.trespassers = [];
        ret.usermap = {}
        
        var users = [];
        var colorIndex = 0;
        for(var user in ret.userActivity){
            var sums = {
                cnt:0, 
                leng: 0,
                startMonth: Object.keys(ret.userActivity[user])[0]
                 
            } 
            Object.keys(ret.userActivity[user]).map(function(e){
                sums.cnt+= ret.userActivity[user][e].sum.cnt;
                sums.leng+= ret.userActivity[user][e].sum.leng;
            })            
            users.push({
                name: user, 
                monthData: ret.userActivity[user],
                sums: sums,
                 
                color: colors[colorIndex++]
            });    
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
            ret.usermap[user.name] = user;
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
                    
                    // console.log(users[j][Object.keys(users[j])[0]].name)
                    ret.regulars.push(users.splice(j,1)[0]);
                    j--;
                }
            } 
            lineUsageMap = {};
            actualLine++;   
            i++;             
        }
        console.log('filtered users', ret.regulars);
        
        return ret;
    } 
    
    window.draw = function draw(){
        
            var firstRoundFilter = process1(data, getFilter());
            console.log('firstRoundFilter', firstRoundFilter.regulars)
            // put out the users, which the user can filter out
            var drawuserlist = [];
            params.userFilter = {};
            $('span.userfilter > input').each(function(i, element){
                var username = $(element).data('user');
                if (!element.checked)
                    params.userFilter[username] = true
            })
            console.log('userfilter', params.userFilter)
            $('#userfilter').html('')            
            for(var u in firstRoundFilter.regulars){
                var username = firstRoundFilter.regulars[u].name; 
                var el = $('<span>',{'class':'userfilter', style: 'background-color: '+getUser(username).color})
                    .append(username).append($('<input>',{type:'checkbox', checked: !params.userFilter[username], 'data-user': username}));
                $('#userfilter').append(el);
                
                if (!params.userFilter[username]) drawuserlist.push(firstRoundFilter.regulars[u]);
            }
            console.log(drawuserlist)
            
            $('.timeline').hide();
            var timelineElement = $('<div>',{'data-user': actualStat, 'class':'timeline'});
            $('#timeline').append(timelineElement);
            
            data.months = moment(data.endSlot).diff(data.startSlot,"months");
            data.maxHeight = Object.keys(data.userActivity).length;
            
            c.bottomY = c.offsetY + (c.lineHeight*(data.maxHeight+3));
            
            console.log(c.offsetX *2 + c.monthsWidth*data.months, c.bottomY*2)
            var timeline = SVG(timelineElement.get(0)).size(c.offsetX *2 + c.monthsWidth*data.months, c.bottomY*2);
            
            drawMainUserLine(timeline, c, data);
            
            drawMonths(timeline, c, data)
            
            drawMonthsText(timeline, c, data, 70)
            drawMonthsText(timeline, c, data, c.bottomY)
                
            drawUsers(timeline, c, data, drawuserlist)                
            
            createMouseOvers(data.userActivity);
            
            initPan(timelineElement.children().get(0))
            
    } 
    
    function loadStat3(filename){
        var dataSource = 'data/stats.'+filename+'.3.json' 
        actualStat = filename;
        $('li > a').removeClass('selected')
        $('a[data-filename="'+filename+'"]').addClass('selected')
        init();
        // console.log('loading from datasource', dataSource);
        $.getJSON(dataSource, function (d) {   
                        
            // check if already loaded
            if ($('.timeline[data-user="'+filename+'"]').length){
                $('.timeline').hide();
                $('.timeline[data-user="'+filename+'"]').show()
                return;
            }
            
            data = d;
            console.log('loaded data', d);
            
            draw();

        });
    } 
     
    function drawUsers(timeline, c, d, userlist){
        for(var i = 0; i< userlist.length; i++){
            
            drawUserLines(timeline, c, d, userlist[i])
        }
    }
    function drawUserLines(timeline, c, d, user){     
        var index = 0
        var lastSlot = -1;   
        var lastMonthData = null;
        for(var yyyymm in user.monthData){
            
            var slot = whichSlot(d,yyyymm).slot;  
              
            var ld = {                    
                user: user.name,  
                monthData: user.monthData[yyyymm],
                lastMonthData: lastMonthData,
                slot: slot,          
                lastSlot: lastSlot,
                lastSlotStartX: lastSlot*c.monthsWidth,
                lastSlotEndX: (lastSlot+1)*c.monthsWidth,
                y2: user.y * c.lineHeight + c.offsetYp,
                slotStartX: slot*c.monthsWidth,
                slotEndX: (slot+1)*c.monthsWidth                                
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
                    if (index == 0)
                        drawEnteringLine(timeline, ld)
                    else{
                        ld.lastMonthData = null;
                        drawEnteringLineStraight(timeline, ld)
                    }
                    createUserTextNode(timeline, user.name, ld.slotStartX-(c.monthsWidth/2), ld.y2-15)    
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
                    user: user.name,            
                    y2: user.y * c.lineHeight + c.offsetYp,
                    slotStartX: firstSlot*c.monthsWidth,
                    slotEndX: (firstSlot+1)*c.monthsWidth - c.margin                
                }
            if (!stamp.y2){
                console.error(user, 'no Y')
                return;
            }
            drawLastInteractionCircle(timeline,user)
            createUserTextNode(timeline, user.name, stamp.slotStartX-(c.monthsWidth/2), stamp.y2-15)
        }
        else{
            console.error('faulty user', user.name)
        }
    }
    
    
    
    function drawExitingLineWithIntensity(timeline, ld){
        var min = c.defaultLineWidth /2 ;
        
        var p = {
            topFrom: min + (ld.lastMonthData.inbound[params.sumkey] || 0) * params.yscale,
            bottomFrom: min + (ld.lastMonthData.outbound[params.sumkey] || 0) * params.yscale, 
            topTo: min ,
            bottomTo:  min        
        }
        var topPath = u.draw.linePart(ld.lastSlotEndX, ld.lastSlotEndX + c.monthsWidth, ld.y2, p.topFrom, p.topTo, true);
        var bottomPath = u.draw.linePart(ld.lastSlotEndX, ld.lastSlotEndX + c.monthsWidth, ld.y2, p.bottomFrom, p.bottomTo, false);

        timeline.path( u.quadPathToString(topPath) ).attr({
                    fill: util(timeline).disappear(getUser(ld.user).color),
                    'data-username': ld.user,
        });            
        timeline.path( u.quadPathToString(bottomPath) ).attr({
                    fill: util(timeline).disappear(getUser(ld.user).color, c.lowerLinePartAlpha),                    
                    'data-username': ld.user,
                    'class': 'downside'
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
    
    function drawSimpleSlotWithIntensity(timeline, ld){
        var min = c.defaultLineWidth /2 ;
        var p = {
            topFrom: min,
            bottomFrom: min, 
            topTo: min + ((ld.monthData.inbound[params.sumkey] || 0) * params.yscale),
            bottomTo:  min + ((ld.monthData.outbound[params.sumkey] || 0) * params.yscale)       
        }
        if (ld.lastMonthData){
            p.topFrom = min + (ld.lastMonthData.inbound[params.sumkey] || 0) * params.yscale;
            p.bottomFrom = min + (ld.lastMonthData.outbound[params.sumkey] || 0) * params.yscale;
        }
        var topPath = u.draw.linePart(ld.slotStartX, ld.slotEndX, ld.y2, p.topFrom, p.topTo, true);
        var bottomPath = u.draw.linePart(ld.slotStartX, ld.slotEndX, ld.y2, p.bottomFrom, p.bottomTo, false);

        timeline.path(u.quadPathToString(topPath) ).attr({
                    fill: getUser(ld.user).color,
                    'data-username': ld.user,
            });            
        timeline.path(u.quadPathToString(bottomPath) ).attr({
                    fill: tinycolor(getUser(ld.user).color || '#777').setAlpha(c.lowerLinePartAlpha),                    
                    'data-username': ld.user,
                    'class': 'downside'
            });           
    }
    
    
    function drawLastInteractionCircle(timeline, user){
        var min = c.defaultLineWidth /2 ;
        var lastMonthData = user.monthData[Object.keys(user.monthData)[Object.keys(user.monthData).length-1]];
        var slot = whichSlot(data,Object.keys(user.monthData)[Object.keys(user.monthData).length-1]).slot;
        var slotEndX = (slot+1)*c.monthsWidth;
        var y2 = user.y * c.lineHeight + c.offsetYp;
        
        var topFrom = min + (lastMonthData.inbound[params.sumkey] || 0) * params.yscale;
        var bottomFrom = min + (lastMonthData.outbound[params.sumkey] || 0) * params.yscale;
        var topPath = u.draw.linePart(slotEndX, slotEndX + c.monthsWidth/2, y2, topFrom, min, true);
        var bottomPath = u.draw.linePart(slotEndX, slotEndX + c.monthsWidth/2, y2, bottomFrom, min, false);
        
        timeline.path(u.quadPathToString(topPath) ).attr(util().pathAttr(user.name, true));            
        timeline.path(u.quadPathToString(bottomPath) ).attr(util().pathAttr(user.name, false));           

        timeline.circle(7).attr({fill: getUser(user.name).color, cx: slotEndX + c.monthsWidth/2, cy: y2, 'data-username': user.name})
    }
    function drawFadedLine(timeline, ld){
        var min = c.defaultLineWidth /2 ;
        var p = {
            topFrom: min + (ld.lastMonthData.inbound[params.sumkey] || 0) * params.yscale,
            bottomFrom: min + (ld.lastMonthData.outbound[params.sumkey] || 0) * params.yscale, 
            topTo: min + ((ld.monthData.inbound[params.sumkey] || 0) * params.yscale),
            bottomTo:  min + ((ld.monthData.outbound[params.sumkey] || 0) * params.yscale)       
        }
        
        var topPath1 = u.draw.linePart(ld.lastSlotEndX, (ld.lastSlotEndX + ld.slotStartX)/2, ld.y2, p.topFrom, min, true);
        var bottomPath1 = u.draw.linePart(ld.lastSlotEndX, (ld.lastSlotEndX + ld.slotStartX)/2, ld.y2, p.bottomFrom, min, false);
        var topPath2 = u.draw.linePart((ld.lastSlotEndX + ld.slotStartX)/2, ld.slotStartX, ld.y2, min, p.topFrom, true);
        var bottomPath2 = u.draw.linePart((ld.lastSlotEndX + ld.slotStartX)/2,ld.slotStartX, ld.y2, min, p.bottomFrom, false);
        
        var attrTop = { fill: getUser(ld.user).color, 'data-username': ld.user }
        var attrBottom = { fill: tinycolor(getUser(ld.user).color || '#777').setAlpha(c.lowerLinePartAlpha), 'data-username': ld.user, 'class': 'downside' }
        timeline.path(u.quadPathToString(topPath1) ).attr(attrTop);            
        timeline.path(u.quadPathToString(bottomPath1) ).attr(attrBottom);           
        timeline.path(u.quadPathToString(topPath2) ).attr(attrTop);            
        timeline.path(u.quadPathToString(bottomPath2) ).attr(attrBottom);                  
    }
    
    function drawEnteringLineStraight(timeline, ld){
        
        // The following line explained
        // http://stackoverflow.com/questions/21638169/svg-line-with-gradient-stroke-wont-display-straight
        timeline.line(ld.slotStartX-((c.monthsWidth)/2), ld.y2+0.0001, ld.slotStartX, ld.y2)
            .attr({
                    fill: 'none',
                    'data-username': ld.user,
                    //stroke: 'red',
                    stroke: util(timeline).appear(getUser(ld.user).color),
                    'stroke-width': c.defaultLineWidth
            });        
    }
    function drawFirstEnteringLineStraight(timeline, ld){
        
        // The following line explained
        // http://stackoverflow.com/questions/21638169/svg-line-with-gradient-stroke-wont-display-straight
        timeline.line(ld.slotStartX-((c.monthsWidth)/2), ld.y2+0.0001, ld.slotStartX, ld.y2)
            .attr({
                    fill: 'none',
                    'data-username': ld.user,
                    //stroke: 'red',
                    stroke: util(timeline).appear(getUser(ld.user).color),
                    'stroke-width': c.defaultLineWidth
            });        
    }
    
    function drawEnteringLine(timeline, ld){
        var enteringPath = {
            M: [ld.slotStartX, ld.y2], 
            Q: [    ld.slotStartX-(c.monthsWidth/3), ld.y2,
                    (ld.slotStartX-(c.monthsWidth)/2), (ld.y2+(c.monthsWidth)/2)],
            T: [(ld.slotStartX-(c.monthsWidth)/2), (ld.y2+(c.monthsWidth)/2)]};
        
        timeline.path(u.quadPathToString(enteringPath)).attr({
            fill: 'none',
            'stroke-width': c.defaultLineWidth, 
            stroke: util(timeline).appear(getUser(ld.user).color), //'red', //getUser(l.user.name).color,
            'data-username':ld.user,
            'class':'entering'
        });        
    }

    function createUserTextNode(timeline, user, x, y, align, line){
        
        if (isNaN(x)|| isNaN(y)) debugger;
        
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
    
    
    
    function createMouseOvers(users){

        for(var u in users){
            $('[data-username="'+u+'"]').each(function(i,o){
                window.u.initMouseEvents(o, u);                
            })
        }
    }
    
    function getUser(key){        
        if ( !data.usermap[key] ) 
            return { name: 'INVALID USER', color: 'red', cnt: 0};        
        return data.usermap[key];
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
    function drawMonthsText(timeline, c, d, y, color){
        
        for(var m = 0; m < d.months; m++){
            
            var monthText = moment(d.startSlot).add(m, 'month').format('MMM');
            var newYear = moment(d.startSlot).add(m, 'month').month() == 0;
            if (newYear){
                timeline.text(moment(d.startSlot).add(m, 'month').format('YYYY'))
                    .attr({
                        x: m*c.monthsWidth + c.offsetX, 
                        y: y,  
                        'font-size':'15px'})                
            } 
            
            timeline.text(monthText).attr({
                x: m*c.monthsWidth + c.offsetX, 
                y: y - ((m%3+1)*c.lineHeight/3),  
                'font-size':'10px',
                fill: color || '#999'
                })            
        }
    }
    
    
    function initPan(element){
        var pan = svgPanZoom(element,{                
                  panEnabled: true
                , controlIconsEnabled: true
                , zoomEnabled: true
                , dblClickZoomEnabled: true
                , mouseWheelZoomEnabled: true
                , preventMouseEventsDefault: true
                , zoomScaleSensitivity: 0.2
                , minZoom: 0.3
                , maxZoom: 10
                , fit: true
                , contain: false
                , center: true
                , refreshRate: 'auto'
                , beforeZoom: function(){}
                , onZoom: function(newZoom){
                    //console.log('zoom', newZoom)
                    if (!isNaN(newZoom))
                        Cookie.set('zoompan.zoom.'+actualStat, newZoom , {expires: 9999})
                }
                , beforePan: function(){}
                , onPan: function(newPan){
                    //console.log(newPan)
                    if (!isNaN(newPan.x) && !isNaN(newPan.y))
                        Cookie.set('zoompan.pan.'+actualStat, newPan , {expires: 9999})
                }                
            });
            var span = JSON.parse(Cookie.get('zoompan.pan.'+actualStat)||'{"x":0, "y":0}') || {x:0, y:0};
            var szoom = Cookie.get('zoompan.zoom.'+actualStat) || 1 
            // console.log('setting initial', span, szoom)               
                  
            pan.zoom(szoom);
            pan.pan(span);
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
            pathAttr: function(user, top){
                
                return {
                    'data-username': user,
                    fill: top?(getUser(user).color || '#777'):(tinycolor(getUser(user).color || '#777').setAlpha(c.lowerLinePartAlpha)),
                    'class': top?'':'downside'
                }
            }
            
        }
         
    }
    
    
    
})(window.$, window.SVG, window.moment, window.u, window.Cookies, window.svgPanZoom, window.tinycolor)