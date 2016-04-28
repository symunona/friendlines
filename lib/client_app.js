(function (window, $, ko, SVG, moment, u, Cookie, svgPanZoom, tinycolor) {


init()


function VM(){
    var self = this
    this.linkroot = "http://friendlines.org"  
    
    this.statUsers = ko.observable()
    this.activeStatUser = ko.observable()
    this.filters = ko.observableArray()
    this.actualFilter = ko.observable()
    this.actualProcessor = ko.observable()
    this.processors = window.processors
    this.error = ko.observable()
    this.loading = ko.observable()
    this.cache = {}
    this.status = window.sts = ko.observable('Hey hello there!')
    this.selectedUser = window.selectedUser = ko.observable()
    this.defaultStatusColor = '#efefef'
    this.status.subscribe(function(){self.statusColor(self.defaultStatusColor)})    
    this.statusColor = window.stscolor = ko.observable(self.defaultStatusColor)
    
    this.userFilterList = ko.observableArray()
    this.userFilterMap = ko.observable()
    this.disabledUsers = {}
    this.emotions = window.c.emotions
    
    this.filterVisible = ko.observable(false)
    this.searchVisible = ko.observable(false)
    this.statusVisible = ko.observable(false)
    this.usersVisible = ko.observable(false)
    this.shareVisible = ko.observable(false)
    
    
    this.consts = {}
    this.consts.orderBys = window.c.orderBys
    
    this.switchUser = switchUser.bind(self)
    this.saveState = saveState.bind(self)
    this.applyFilter = applyFilter.bind(self)    
    this.loadSavedStates = loadSavedStates.bind(self)
    this.reset = reset
    this.duplicateFilter = duplicateFilter.bind(self)
    this.deleteFilter = deleteFilter.bind(self)
    this.share = share.bind(self)
    this.upload = upload.bind(self)
    
    this.link = ko.observable()
    
    this.uploadModel = ko.observable(newUploadModel())

    this.switchProcessor = switchProcessor.bind(self)
    
    this.params = {
        sumkey: 'leng',
        yscale: 0.01
    }

    $.getJSON("data/statlist.json").then(self.statUsers).then(loadSavedStates.bind(this))
}

window.onbeforeunload = function(){    
    if (!window.reset) vm.saveState()
}


function newUploadModel(){
    return {
        public: ko.observable(true),
        name: ko.observable(''),
        comment: ko.observable(''),        
        filter: '',
        zoom: ko.observable(1),
        panx: ko.observable(0),
        pany: ko.observable(0),
        processor: '',
        svg: ''
    }
}

// lol, good enouh for the demo
function validateUpload(formdata){
    if (!formdata.name()){
        alert('Please provide at least a name for your image!') // judo validation
        $('#nameinput').focus()
        return false;
    }    
    return true;
}

function upload(){
    if (!validateUpload(this.uploadModel())) return;
    
    var data = ko.wrap.toJS(this.uploadModel())    
    var self = this;
    this.status('Uploading image...');
    this.loading(true)
    data.svg = $('#uploadpreview > svg')[0].outerHTML;        
    $.ajax({
        url: window.location.url,
        method: "post",        
        data: JSON.stringify(data)
    }).done(function(id){        
        self.link(self.linkroot + '/link/'+id);
        self.status('Upload finished! Your link is: ' + '<a href="'+self.link()+'">'+self.link()+'</a>');
        self.loading(false)
    })
}

function share(context, event){    
    event.preventDefault(); event.stopPropagation()
    this.shareVisible(!this.shareVisible())
    this.link('')
    if (this.shareVisible()){
        var filter = ko.wrap.toJS(this.actualFilter()) 
        this.uploadModel().filter = JSON.stringify(filter);
        this.uploadModel().processor = this.actualProcessor().name
        // generate the svg
        removePersonalData.call(this)
    }    
}

function removePersonalData(){
    var originalSvg = $('.timeline:visible > svg')[0].outerHTML
    $('#uploadpreview').append(originalSvg)
    
    // it has this property twice due to a bug
    $('#uploadpreview').children().removeAttr('xmlns:ev')
    
    $('#uploadpreview').find('.usertextnode').remove()    
    initPrewiewPan.call(this, $('#uploadpreview').children()[0], this.activeStatUser())

}

function init(){        
    
    window.vm = new VM()
    ko.applyBindings(window.vm)
}

function reset(){
    window.reset = true
    localStorage.removeItem('friendlines')
    location.reload()
}

function duplicateFilter(){
    var newFilter = ko.wrap.toJS(this.actualFilter())
    var lastchar = parseInt(newFilter.name[newFilter.name.length-1]);
    if (isNaN(lastchar)) newFilter.name += '.1'
    else {        
        var c = 1
        while(!isNaN(parseInt(newFilter.name.substr(newFilter.name.length-c,c ))) && newFilter.name[newFilter.name.length-c]!='.') c++;        
        var num = parseInt(newFilter.name.substr(newFilter.name.length-c+1,c-1 ));
        num ++;        
        newFilter.name = newFilter.name.substr(0,newFilter.name.length-c+1) + num;        
    }
    var newObservableFilter = ko.wrap.fromJS(newFilter)
    newObservableFilter.editable = true    
    this.filters.push(newObservableFilter)
    this.actualFilter(newObservableFilter)
}

function loadSavedStates(){
    var vm = this;
    if (localStorage.getItem('friendlines') && localStorage.getItem('friendlines')!='undefined'){                
        var loadedData = JSON.parse(localStorage.getItem('friendlines'));
        ['filters'].map(function(k){
            vm[k](ko.wrap.fromJS(loadedData[k])())            
        })         
        vm.activeStatUser(loadedData.activeStatUser)
        vm.actualFilter(vm.filters().find(function(e){return e.name() == loadedData.actualFilter.name}))
        vm.actualProcessor(window.processors.find(function(p){return p.name == loadedData.actualProcessorName}))
        vm.disabledUsers = loadedData.disabledUsers || {}
        var user = vm.statUsers().find(function(u){return u.name == vm.activeStatUser()})
        switchUser.call(vm,user)
    }
    else{
        // initial start        
        var nonameFilter = ko.wrap.fromJS(window.c.defaultFilter) 
        var defaultFilter = ko.wrap.fromJS(window.c.defaultFilter)
        defaultFilter.editable = false;
        nonameFilter.editable = true;
        nonameFilter.name('noName')
        
        vm.actualFilter(nonameFilter)                
        vm.filters.push(defaultFilter)
        vm.filters.push(nonameFilter)
        
        var user = vm.statUsers()[0]
        switchUser.call(vm,user)
        
        vm.actualProcessor(window.processors[0])
    }       
}

function deleteFilter(){
    
    this.filters.splice(this.filters().indexOf(this.actualFilter()),1)
    this.actualFilter(this.filters()[this.filters().length-1]);
}

function saveState(){    
    var self = this;
    var toSave = {};
    ['filters', 'actualFilter','activeStatUser','disabledUsers'].map(function(k){
        toSave[k] = ko.wrap.toJS(self[k])
    })
    toSave.actualProcessorName = this.actualProcessor().name
    localStorage.setItem('friendlines', JSON.stringify(toSave))
}

function applyFilter(){    
    var self = this
    this.loading(true)   
    this.status('Getting users to draw...')
    this.selectedUser(false)
    // start new webworker
    setTimeout(function(){
                
        var filter = ko.wrap.toJS(self.actualFilter());                                                
        var userList = self.actualProcessor().process( self.data.userActivity, filter );
        window.nametable = userList.usermap;      
        var drawUserList = applyUserFilter.call(self, filter, userList);
        if (!drawUserList.length){
            self.loading(false)
            self.status('Your search did not return any users to draw. Try widening the filter properties!')
            return;
        }
        var metadata = getMetaData.call(self,drawUserList)
        
        metadata.months = moment(metadata.endSlot).diff(metadata.startSlot,"months");
        metadata.maxHeight = Object.keys(drawUserList).length;                
        
        // 10 is the magic number for normal the filter. This will overlap at the peaks. 
        self.params.yscale = window.c.consts.lineHeight * 10 / metadata.maxLength;
        
        self.status('Drawing users... This may take upto several minutes, depending on the amount of users in the filter. The browser window may seem frozen...')
        setTimeout(function(){
            startMainThreadDrawing.call(self, metadata, $.extend({},window.c.consts, self.params), drawUserList)    
        },0)
        
        
    },0)
    return false
}

function renderFinished(element){
    $('.timeline').hide();
    $('#timeline').append(element);
    initPan(element.children().get(0), this.activeStatUser() );
    this.status('Finished drawing! Navigate with dragging and scrolling!')
    this.loading(false)
}

function startMainThreadDrawing(metadata, params, drawUserList){
    var element = this.actualProcessor().draw(metadata, params, drawUserList)
    renderFinished.call(this, element)
    
}

function startWorkerDrawing(){
        var w = new Worker('client/processstats.1.js')
        var self = this
        var pars = $.extend({},window.c.consts, self.params)
        // console.log([metadata, pars , ko.wrap.toJS(drawUserList)])
        w.addEventListener('message', function(e) {
            
            renderFinished.call(self, $('<div>').html('dummy')[0])
            
        }, false);

        w.postMessage([metadata, pars , ko.wrap.toJS(drawUserList)])     
}


function applyUserFilter(filter, userlist){
    var drawuserlist = [];
    var self = this;
    
    // add the filtered users to the disabled list
    for(var i in this.userFilterList()){
        if (!this.userFilterList()[i].isIn())
            this.disabledUsers[this.userFilterList()[i].name] = true
        else
            this.disabledUsers[this.userFilterList()[i].name] = false
    }    
    
    // create the new userlist with the ones disabled before disabled now
    userlist.regulars = userlist.regulars.map(function(r){
        r.isIn = ko.observable(!self.disabledUsers[r.name]); 
        return r
    })

    this.userFilterMap(userlist.usermap)
    this.userFilterList(userlist.regulars)    
    
    // create the draw list with the help of the disabled array
    var drawUserList = this.userFilterList().filter(function(e){
        return !self.disabledUsers[e.name]})
    
    return drawUserList;
}


function getMetaData(users){
    if (!users.length){
        console.error('zero length');
        return;
    }        
    var ret = {
        startSlot: Object.keys(users[0].monthData)[0],
        endSlot: Object.keys(users[0].monthData)[0],
        maxLength: 0
    }
    for(var u in users){
        for(var yyyymm in users[u].monthData){
            // get if actual month of user is lower than the lowest            
            if (yyyymm < ret.startSlot) ret.startSlot = yyyymm; 
            if (yyyymm > ret.endSlot) ret.endSlot = yyyymm;
            // get the highest peak
            if (!isNaN(users[u].monthData[yyyymm].sum[this.params.sumkey]) && users[u].monthData[yyyymm].sum[this.params.sumkey] > ret.maxLength) 
                ret.maxLength = users[u].monthData[yyyymm].sum[this.params.sumkey]; 
        } 
    }
    ret.startSlot = moment(ret.startSlot, "YYYYMM").format()
    ret.endSlot = moment(ret.endSlot, "YYYYMM").format()
    return ret
}


function initPrewiewPan(element, actualStat){
    var self = this;
    var pan = svgPanZoom(element,{                
                panEnabled: true
            , controlIconsEnabled: true
            , zoomEnabled: true
            , dblClickZoomEnabled: true
            , mouseWheelZoomEnabled: true
            , preventMouseEventsDefault: true
            , zoomScaleSensitivity: 0.2
            , minZoom: 0.1
            , maxZoom: 50
            , fit: true
            , contain: true
            , center: true
            , refreshRate: 'auto'
            , onZoom: function(newZoom){
                if (!isNaN(newZoom))
                    self.uploadModel().zoom(newZoom)
            }
            , beforePan: function(){}
            , onPan: function(newPan){
                if (!isNaN(newPan.x) && !isNaN(newPan.y)){
                    self.uploadModel().panx(newPan.x)
                    self.uploadModel().pany(newPan.y)        
                }
            }                
        });

        // zoom out from it to see the whole
        var width = parseFloat(element.attributes.width.value);        
        var height = parseFloat(element.attributes.width.value);
        var zoom = 600 / width;        
        pan.zoom(zoom);
        pan.pan({x: 0, y: 10});
} 


function initPan(element, actualStat){
    var pan = svgPanZoom(element,{                
                panEnabled: true
            , controlIconsEnabled: true
            , zoomEnabled: true
            , dblClickZoomEnabled: true
            , mouseWheelZoomEnabled: true
            , preventMouseEventsDefault: true
            , zoomScaleSensitivity: 0.2
            , minZoom: 0.01
            , maxZoom: 50
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

function switchProcessor(pr){
    this.actualProcessor(pr)
    
}

function switchUser(user){     
    
    var self = this
    var dataSource = 'data/stats.'+user.fileName+'.3.json' 
    this.selectedUser(false)
    this.activeStatUser(user.name);
        
    if (this.cache[user.name]){
        self.data = this.cache[user.name];             
        return;
    }
    this.loading(true)
    $.getJSON(dataSource, function (d) {   
        
        self.cache[user.name] = d;        
        self.data = self.cache[user.name];
        
        self.loading(false)                            
        self.applyFilter.call(self);
        
    }).error(function(){
        console.log('data error', arguments)
        if (arguments[2]=='Not Found'){
            self.error('nofile')
        }
        
    });
} 


})(window, window.$, window.ko, window.SVG, window.moment, window.u, window.Cookies, window.svgPanZoom, window.tinycolor)