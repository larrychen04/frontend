({
	baseUrl: "./",
	mainConfigFile:'main.js',
	modules:[
		{
			name:'libs',
			create:true,
			include:[
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
			]
			,optimize:'none'

		},
		{
			name:'main',
			exclude:[
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
			]
			,optimize: "uglify2"
		}
	],

	dir:'../../stage3/regflow-flux/js/built',
	removeCombined: true,
	findNestedDependencies:true,
	preserveLicenseComments:false,
	fileExclusionRegExp:/modernizr-2.6.2.min.js$|^build|^r\.js|-built.js/
})

