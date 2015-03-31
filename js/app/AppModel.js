define([
	'fb'
],
function(fb){
	var _class = AppModel = fb.AppModel.extend({
		defaults:{
			isIe8:false
			,isMobile:false
			,breakpoint : 50
			,cssBaseUrl:''
		},
		init:function(){
			this.set('isIe8',$('html').hasClass('lt-ie9'));
		}
		,setBreakpoint:function(windowWidth,windowHeight) {
			if(windowWidth <= 320){
				this.set('breakpoint',_class.breakpoints.PHONE_PORTRAIT);
			}
			else if(windowWidth <= 767){
				this.set('breakpoint',_class.breakpoints.ALL_PHONES);
			}
			else if(windowWidth <= 768){
				this.set('breakpoint',_class.breakpoints.TABLET_PORTRAIT);
			}
			else if(windowWidth <= 1024){
				this.set('breakpoint',_class.breakpoints.TABLETS);
			}
			else{
				this.set('breakpoint',_class.breakpoints.DESKTOP);
			}
		}
	},{
		breakpoints:{
			PHONE_PORTRAIT:10
			,ALL_PHONES:20
			,TABLET_PORTRAIT:30
			,TABLETS:40
			,DESKTOP:50
		}
	});
	return _class;
});