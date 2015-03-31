define([
	'fb'
],
	function(fb){

		var _class = AppEvents = fb.Model.extend({
			defaults:{

			}

		},{
			SHOW:'SHOW'
			,HIDE:'HIDE'
			,OVERLAY_CLOSED: 'OVERLAY_CLOSED'
			,OVERLAY_OPENED: 'OVERLAY_OPENED'
			,OVERLAY_TEST: 'OVERLAY_TEST'
		});
		return _class;
	});