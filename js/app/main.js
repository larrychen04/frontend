require.config({
	baseUrl: '/js/app',  // change this if needed !!!!
	paths: {
		jquery:				'../libs/jquery-proxy',
		backbone:			'../libs/backbone-1.1.2-min',
		underscore:			'../libs/underscore-1.6.0-min',
		fb:					'../libs/fb.backbone',
		requireLib:			'../libs/require',
		fbImage:			'../libs/fb.image',
		parsley:			'../libs/parsley',
		tooltip:            '../libs/tooltip',
		popover:            '../libs/popover',
		selectric:          '../libs/jquery.selectric',
		typeahead:          '../libs/typeahead',
 	},
	shim: {
		'fb':{
			deps:['backbone','jquery']
		},
		fbImage: ['jquery'],
		bootstrap: ['jquery','fb'],
		parsley: ['jquery'],
		popover: ['jquery', 'tooltip'],
		selectric: ['jquery'],
		typeahead: ['jquery'],
	},
	urlArgs: "bust=" + (new Date()).getTime()
});

require([
	'jquery'
	,'backbone'
	,'underscore'
	,'fb'
	,'requireLib'
	,'fbImage'
	,'bootstrap'
	,'parsley'
	,'tooltip'
	,'popover'
	,'selectric'
	,'typeahead'
],function($){

});
