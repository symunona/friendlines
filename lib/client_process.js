
var data, 
    actualStat,  
    filter,
    cookieKey = 'phistory.',
    filters = [],
    actualProcessor,   
    actualDrawer,
    rendered = [],
    params = {
        sumkey: 'leng',
        yscale: 0.01
    },
    defaultFilter = {
                name: 'default',
                orderBy: ['leng', 'cnt'],
                descendingOrderBy: true,
                min:{
                    cnt: 10,
                    leng: 100
                },
                minMonth:{
                    repeat: 2,
                    cnt: 3                    
                },   
                userFilter: {}                 
            };


(function (window, $, SVG, moment, u, Cookie, svgPanZoom, tinycolor) {
    
    // console.log("universal stat");
    $('#filter').show();
    
    // $.ajax({
    //     url: "data/statlist.json",
    //     method: 'get', 
    //     type: 'data',
    //     success: function (d) {
    //         console.log('yoo', arguments)
    //     }
    // } )
       
    // get parsed user list
    $.getJSON("data/statlist.json", function (d) {
        for(var i = 0; i<d.length; i++){
            
            var a = $('<a>',{                    
                    'data-filename': d[i].fileName
                    }).html(d[i].name).on('click',function(){                                
                                loadStat(this.dataset.filename)
                        })
            $('#statlist').append($('<li>').append(a));
        }
        var lastloaded = Cookie.get(cookieKey + 'lastStatFile') || d[0].fileName;
        // console.log('lastloaded', lastloaded)
        loadStat(lastloaded);
    })    
    
    actualProcessor = window.processors[0];

    // console.log('processors', processors)
    
    for(var pi = 0; pi<window.processors.length; pi++){
        var proc = window.processors[pi]
        $('.graphselector').append( 
            $('<a>', {
                'class':'graphselectora', 
                'data-index':pi
                
        }).click(switchGraph).html(proc.name))        
    }
    
    
    window.switchGraph = switchGraph;    
    window.loadFilter = loadFilter;
    window.toggleSearchView = function(){ $('#search').toggle(); $('#keyword').focus()}
    window.toggleFilterView = toggleFilterView;
    window.resetSearch = function(){}
    
    window.deleteFilter = deleteFilter
    window.saveFilter = saveFilter
    window.applyFilter = applyFilter;
    
    window.search = search
    
    window.status = function(msg, loading){        
        $('#status').append($('<p>').html(msg))
        if (loading) $('#statusloading').show()
        else $('#statusloading').hide()
    }
    window.toggleStatus = function(){
        $('#statusfooter').toggleClass('open')
    }
    
    init();
    
    function saveFilter(){
        
        var name = prompt("Enter a name for the filter");         
        filter = $.extend(true, {}, getFilter(), {name: name})         
        filters.push( filter );        
        Cookie.set(cookieKey+'saved_filters', filters, {expires: 9999});  
        Cookie.set(cookieKey + 'lastfilter', name, {expires: 9999})
        filterUIRender()
    }
    
     
    
    function deleteFilter(){
        var name = $('#filters').val()
        if (confirm('Sure delete '+name+'?')){            
            var e = filters.find(function(e){return e.name == name})
            filters.splice(filters.indexOf(e),1)
            Cookie.set(cookieKey+'saved_filters', filters, {expires: 9999});
            filterUIRender()
        }
    }
    
    function toggleFilterView(){
        $('#filter, #filtertoggler1, #filtertoggler2, .userselector').toggle(); 
        Cookie.set(cookieKey+'filtervisible', $('#filter').is(":visible"), {expires: 9999});  
    }
    
    
    function search(event){
        if (event) event.preventDefault();
        var keyword = $('#keyword').val()
        console.log('searching for ', keyword)
        return false;
    }


    function applyFilter(event){    
        $('.loading').show();   
                
        if (event) event.preventDefault();
        
        setTimeout(function(){
            filter = getFilter()        
                                     
            var userList = actualProcessor.process( data.userActivity, filter );
            var drawUserList = applyUserFilter(filter, userList);
            
            var metadata = getStartAndEndSlot(drawUserList)
            
            metadata.months = moment(metadata.endSlot).diff(metadata.startSlot,"months");
            metadata.maxHeight = Object.keys(drawUserList).length;        

            var element = actualProcessor.draw(metadata, $.extend({},window.c.consts,params), drawUserList)
                
            $('.timeline').hide();        
            $('#timeline').append(element);
            
            initPan(element.children().get(0));
            $('.loading').hide();
            
            
        },0)
        return false
    }
    
    function switchGraph(event){
        // console.log($(event.target).data('index'))
        $('.graphselectora').removeClass('active')
        var i = $(event.target).data('index');
        $('a.graphselectora[data-index='+i+']').addClass('active')
        actualProcessor = window.processors[i]
        
    }
    
    function loadStat(filename){
        var dataSource = 'data/stats.'+filename+'.3.json' 
        actualStat = filename;
        
        Cookie.set(cookieKey + 'lastStatFile', filename, {expires: 9999})
        
        $('li > a').removeClass('selected')
        $('a[data-filename="'+filename+'"]').addClass('selected')
        
        $.getJSON(dataSource, function (d) {   
                        
            // check if already loaded
            if ($('.timeline[data-user="'+filename+'"]').length){
                $('.timeline').hide();
                $('.timeline[data-user="'+filename+'"]').show()
                return;
            }
            
            data = d;
            // console.log('loaded data', d);            
            applyFilter();
        }).error(function(){
            console.log('data error', arguments)
            if (arguments[2]=='Not Found'){
                
                $('#content').html('<div class="alert"><p class="alert">There is no data to display in the folder. </p></div>')
                $('div.alert').append('<p>&nbsp;</p><p>Did you run the data extractor?</p>')
                $('div.alert').append('<p>If you just checked out the repot, run <i>"npm install"</i> </p>')
                $('div.alert').append('<p>After it is installed, in the command line, type <i>"node ."</i></p>')
                $('div.alert').append('<p>Then try refreshing this site</p>')
            }
            
        });
    } 
        
    
    function applyUserFilter(filter, userlist){
        var drawuserlist = [];
        filter.userFilter = {};        
        $('span.userfilter > input').each(function(i, element){
            var username = $(element).data('user');
            if (!element.checked)
                filter.userFilter[username] = true
        })
        // console.log('userfilter', filter.userFilter)
        $('#userfilter').html('')            
        for(var u in userlist.regulars){
            var username = userlist.regulars[u].name; 
            
            var inp = $('<input>',{type:'checkbox', checked: !filter.userFilter[username], 'data-user': username, 'class':'userselector'}).click(function(e){e.stopPropagation()})
            if (!$('#filter').is(":visible")) inp.css('display', 'none')
            var el = $('<span>',{'class':'userfilter', style: 'background-color: '+userlist.usermap[username].color})
                .append(username).append(inp);
            
            el.click(function(event){                                
                $(event.target).children('input')[0].checked = !$(event.target).children('input')[0].checked
            })
            $('#userfilter').append(el);
            
            if (!filter.userFilter[username]) drawuserlist.push(userlist.regulars[u]);
        }
        // console.log(drawuserlist)
        return drawuserlist;
    }
    
    function loadFilter(){
        var name = $('#filters').val()
        $('.filterindicator').html(name)        
        Cookie.set(cookieKey + 'lastfilter', name, {expires: 9999})
        filter = getFilterByName(name)        
        loadFilterUI( filter )                  
    }
    
    function filterUIRender(){
        $('#filters').html('');                                     
        filters.map(function(f){
            $('#filters').append(
                $('<option>', {value: f.name}).html(f.name))});        
                
        $('#filters').val(filter.name)
    }
    
    function getFilterByName(name){        
        return filters.find(function(e){return e.name == name})
    }
    
    function loadFilters(){
        
        if (Cookie.get(cookieKey+'saved_filters') && Cookie.get(cookieKey+'saved_filters').length){
            console.log('load filters', Cookie.get(cookieKey+'saved_filters'))
            filters = JSON.parse(Cookie.get(cookieKey+'saved_filters'));            
            filter = filters.find(function(e){return e.name == Cookie.get(cookieKey+'actual_filter')}) || filters[0]            
        }else{
            filter = $.extend(true, {}, defaultFilter)
            filters.push(filter);                             
        }
        filterUIRender()
    }
    
    function loadFilterUI(filter){
        $('#minsumcount').val(filter.min.cnt);
        $('#minsumlength').val(filter.min.leng);
        $('#minactivefollowinmonth').val(filter.minMonth.repeat);
        $('#minmonthcount').val(filter.minMonth.cnt);
        $('#orderby1').val(filter.orderBy[0]);             
        $('#orderby2').val(filter.orderBy[1]);
        
        if (filter.descendingOrderBy) $('#descendingOrderBy').attr('checked',true);
    }
    
    function init(){
        $('#filter').show();
        
        $('a.graphselectora[data-index=0]').addClass('active')
         if (Cookie.get(cookieKey+'filtervisible') != 'true') window.toggleFilterView()
        
        loadFilters();
        
        var named_filter = Cookie.get(cookieKey + 'lastfilter')
        
        console.log('init filter name', filter.name)
        $('.filterindicator').html(filter.name)
        
        loadFilterUI(filter)
 
    }    
    function getFilter(){    
        var filter = $.extend(true, {}, defaultFilter)    
        filter.min.cnt = $('#minsumcount').val();
        filter.min.leng = $('#minsumlength').val();
        filter.minMonth.repeat = $('#minactivefollowinmonth').val();
        filter.minMonth.cnt = $('#minmonthcount').val();
        filter.orderBy[0] = $('#orderby1').val();
        filter.orderBy[1] = $('#orderby2').val();
        filter.descendingOrderBy = $('#descendingOrderBy').is(':checked');
        Cookie.set(cookieKey+actualStat, filter, {expires: 9999});        
        return filter;
    }

    function getUser(key){        
        if ( !data.usermap[key] ) 
            return { name: 'INVALID USER', color: 'red', cnt: 0};        
        return data.usermap[key];
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

    function getStartAndEndSlot(users){
        if (!users.length){
            console.error('zero length');
            return;
        }        
        var ret = {
            startSlot: Object.keys(users[0].monthData)[0],
            endSlot: Object.keys(users[0].monthData)[0]
        }
        for(var u in users){
            for(var yyyymm in users[u].monthData){            
                if (yyyymm < ret.startSlot) ret.startSlot = yyyymm; 
                if (yyyymm > ret.endSlot) ret.endSlot = yyyymm;
            } 
        }
        ret.startSlot = moment(ret.startSlot, "YYYYMM").format()
        ret.endSlot = moment(ret.endSlot, "YYYYMM").format()
        return ret
    }
      
    // function createMouseOvers(users){
        
    //     for(var ui=0; ui<users.length; ui++){
    //         var u = users[ui]
    //         $('[data-username="'+u+'"]').each(function(i,o){
    //             initMouseEvents(o, u);     
    //             console.log(o,u)           
    //         })
    //     }
    // }
    
    // function initMouseEvents(object, user){
    //    object.onmouseover = function(){            
    //         // console.log('user:', data.usermap[user], 'line:');
    //         highlightUser(user);                  
    //     };
    //     object.onmouseout = function(){
    //         unlightUser(user)
    //     };
    //     object.onclick = function(){
    //         console.log('selected user', user)
    //         highlight2User(user);
    //     }
    // }


})(window, window.$, window.SVG, window.moment, window.u, window.Cookies, window.svgPanZoom, window.tinycolor)