define(
[
	'fb'
	,'AppModel'
	,'model/AppEvents'
	,'views/ViewCompiler'
	,'custom/views/ViewCustomCompiler'
]
,function(fb,AppModel,AppEvents){

var _class = fb.Application.extend({
	autoBuild:true
	,path:'/'
	,windowHeight : null
	,windowWidth : null
	,overlayDisplay: null
	,init : function () {
		this._super(_class,'init');
		this.windowHeight = $(window).height();
		this.windowWidth = $(window).width();
	}
	,addEventListeners : function() {
		this._super(_class,'addEventListeners');
		this.bind(fb.events.Application.RESIZE,this.onStageResize,this);
	}
	,onStageResize : function(width,height,windowWidth,windowHeight) {
		this.windowHeight = windowHeight;
		this.windowWidth = windowWidth;
		this.getAppModel().setBreakpoint(this.windowWidth,this.windowHeight);
		if(this.getAppModel().get('breakpoint') <= AppModel.breakpoints.TABLET_PORTRAIT) {
			this.$el.addClass('mobile');
		} else {
			this.$el.removeClass('mobile');
		}
	}
	,onRestOverlayDisplay : function(overlayDisplay){
		this.overlayDisplay = overlayDisplay;
	}
});
return _class;
});