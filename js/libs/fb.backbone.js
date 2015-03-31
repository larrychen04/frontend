define(['jquery','underscore','backbone'],function($,_,Backbone){
	/**
	 * @namespace fb
	 *
	 * Classes in this namespace extend the Backbone framework to provide a common application architecture.
	 *
	 * The basic building blocks of this architecture are:
	 *
	 * * Application - this is the master view and is can also be used as a shared event listener / dispatcher
	 * * AppModel - this is the shared application model
	 * * Router - this class is responsible for responding to URL changes
	 * * Templates - a hash containing Underscore templates used to render views where appropriate
	 *
	 * The basic process is:
	 *
	 * 1. Create the Application, AppModel and Router
	 * 2. Read the templates from a given variable (this is defined in the resource loader configuration)
	 * 3. Register these classes with fb.Registry
	 * 4. Add child views to the application as needed, then start the application.
	 *
	 * @example
	 * $(function(){
 * 	fb.Namespace.create('myapp');
 * 	var model = new myapp.AppModel();
 * 	var router = new fb.Router();
 * 	var templates = myapp.templates; //these are loaded from an external file
 * 	var app = new myapp.Application();
 * 	fb.Registry.register(app, model, router, templates);
 * app.start();
 * ]);
 */

	if(! window.console){
		window.console = {log:function(){}};
	}
	if(! window.fb){
		window.fb = {};
	}
	/**
	 *
	 * @namespace
	 */
	fb.Namespace = {_namespaces:{}};
	/**
	 * Creates a namespace to place class definitions in
	 * @param namespace
	 * @static
	 * @returns {object}
	 */
	fb.Namespace.create = function(namespace){
		var _n = {app:null,model:null,router:null};
		var tokens = namespace.split('.');
		var data = null;
		var context = window;
		_.each(tokens,function(token,index){
			//console.log()
			if(! context[token]){
				context[token] = {};

				//context = data;
			}
			context = context[token];
		},this);
		fb.Namespace._namespaces[namespace] = context;
		return context;
		//data
	};
	/**
	 * Gets a namespace
	 * @param namespace
	 * @static
	 * @returns {object}
	 */
	fb.Namespace.get = function(namespace){
		return fb.Namespace._namespaces[namespace];
	};

	/**
	 * Gets a class based on a string
	 * @param namespace
	 * @static
	 * @returns {function}
	 */
	fb.Namespace.getClassByString = function(className){
		var tokens = className.split('.');
		var _class = tokens.pop();
		var _namespace = tokens.join('.');
		var namespace = fb.Namespace.get(_namespace);
		var Class;

		if(window.require){
			try{
				Class = require(_class);
				return Class;
			}
			catch(exc){
				//throw new Error('This class does not exist:' + className);
			}
		}


		if(! namespace){




			throw new Error('This namespace does not exist:' + _namespace);
		}
		Class = namespace[_class];
		if(! Class){
			throw new Error('This class does not exist:' + className);
		}
		return Class;
	};

	/**
	 *
	 * Mixin functions are shared across classes
	 * @namespace holder for shared functions
	 */
	fb.Mixin = {};

	fb.Mixin.globalFunctions = {
		/**
		 * Gets the registered application
		 * @returns {fb.Application}
		 */
		getApp:function(){
			return fb.Registry.getInstance().app;
		},
		/**
		 * Gets the registered application model
		 * @returns {fb.AppModel}
		 */
		getAppModel:function(){
			return fb.Registry.getInstance().model;
		},
		/**
		 * Gets the registered application router
		 * @returns {fb.Router}
		 */
		getRouter:function(){
			return fb.Registry.getInstance().router;
		},
		/**
		 * Calls the given method of the parent class
		 * @param {Object} _class  the calling class. This is required so that nested super calls work as expected.
		 * @param {String} [method] the name of the method to call. Any additional arguments as passed to the requested method.
		 * @returns {*}
		 *
		 */
		_super:function(_class,method){
			var _args = _.rest(_.toArray(arguments),2);
			if(method){
				var _super = _class.prototype.constructor.__super__;
				var _superMethod = _super[method];
				if(_superMethod){
					return _superMethod.apply(this,_args);
				}
			}
			else{
				return _class.prototype.constructor.__super__;
			}
		},
		/**
		 * Sets a timeout, with a specific callback context. Stores the timeout in an array so that calls to @see clearTimeouts
		 * can remove them.
		 * @param {Function} func the callback function
		 * @param {int} delay
		 * @param {Object} context
		 * @returns {number}
		 */
		setTimeout:function(func,delay,context){
			var t =  setTimeout(_.bind(func,context || this),delay);
			if(! this.timeouts){
				this.timeouts = {};
			}
			this.timeouts[t] = t;
			return t;
		},
		/**
		 * @param {number} timeout
		 * @returns {number}
		 */
		clearTimeout:function(timeout){
			clearTimeout(timeout);
			if(! this.timeouts){
				this.timeouts = {};
			}
			delete this.timeouts[timeout];
			return timeout;
		},
		/**
		 * Clears all timeouts registered by calls to @see fb.Mixin.globalFunctions#setTimeout
		 */
		clearTimeouts:function(){
			if(! this.timeouts){
				this.timeouts = {};
			}
			_.each(this.timeouts,function(item,index){
				clearTimeout(index);
			},this);
			this.timeouts = {};
			return;
		},
		/**
		 * Logs all arguments to console
		 * @returns {Object}
		 */
		log:function(){
			if(window.console){
				console.log.call(this,arguments);
				//console.log(arguments);
			}
			return this;
		},
		/**
		 * Renders a given template using the data provided (uses Underscore templates)
		 * @param {string} template the name of the template to use
		 * @param {*} data
		 * @returns {String}
		 */
		renderTemplate:function(template,data){
			var templates = fb.Registry.getInstance().templates;
			if(! templates || ! templates[template]){
				return '';
			}
			try{
				if(! _.isFunction(templates[template])){
					templates[template] = _.template(templates[template]);
				}
				var output = templates[template](data);
				return output;
			}
			catch(exc){
				this.log(exc);
			}

		}

	};
	/**
	 * Get all mixin functions
	 * @static
	 * @returns {object}
	 */
	fb.Mixin.getAll = function(){
		return _.extend({},fb.Mixin.globalFunctions);
	};
	/**
	 * @namespace fb.Registry responsible for registering specific parts of the app
	 */
	fb.Registry = {};
	/**
	 *
	 * @type {{app: null, router: null, model: null, templates: null}}
	 * @private
	 * @static
	 */
	fb.Registry._instance = {app:null,router:null,model:null,templates:null};
	/**
	 * @static
	 * @returns {{app: null, router: null, model: null, templates: null}}
	 */
	fb.Registry.getInstance = function(){
		return fb.Registry._instance;
	};
	/**
	 * Registers parts of the application
	 * @param {fb.Application} app
	 * @param {fb.Model} model
	 * @param {fb.Route} router
	 * @param {object} templates key:value store of Underscore templates
	 */
	fb.Registry.register = function(app,model,router,templates){
		if(! router){
			router = new fb.Router();
		}
		fb.Registry._instance = {
			app:app,
			router:router,
			model:model,
			templates:templates
		};

	};


	/**
	 *
	 * @class fb.View
	 * @extends Backbone.View
	 */
	fb.View = Backbone.View.extend(
		_.extend(fb.Mixin.getAll(),{
			/**
			 * @type string attribute to check on DOM nodes to calculate the path to this view
			 */
			pathAttr:'data-path',
			/**
			 * @type fb.View[] child views
			 */
			children:null,
			/**
			 * @private
			 * @type Object
			 */
			pathMap:null,
			/**
			 * @type fb.View the currently active child
			 */
			currentChild:null,
			/**
			 * @type number the index of the currently active child
			 */
			currentIndex:-1,
			/**
			 * @type fb.View[] an array containing children which can be navigated to (i.e. they have a path)
			 */
			navigableChildren:null,
			/**
			 * @private
			 * @type fb.View the currently active navigable child
			 */
			navigationChild:null,
			/**
			 * @type number the index of the navigationChild
			 */
			navigationIndex:-1,
			/**
			 * @type string The URL of this object
			 */
			path:'',
			/**
			 * @type boolean
			 */
			autoBuild:false,

			/**
			 * @type object a collection of functions to run on the next animation tick
			 */
			tickStack:null,

			/**
			 * Pseudo constructor, initializes the View with given parameters, calls init(), createChildren(), then addEventListeners()
			 * @see fb.View#init
			 * @see fb.View#createChildren
			 * @see fb.View#addEventListeners
			 * @param options
			 */
			initialize:function(options){
				_.extend(this,options);
				this.children = [];
				this.pathMap = {};
				this.navigableChildren = [];
				this.tickStack = {};
				this.init(options);
				if(! this.path && this.$el.attr(this.pathAttr)){
					this.path = this.$el.attr(this.pathAttr);
				}

				if(this.autoBuild){
					this.autoAddChildren();
				}

				this.createChildren();
				this.addEventListeners();
			},
			/**
			 * Register event listeners.
			 */
			addEventListeners:function(){
				//this.removeEventListeners();
				this.getApp().bind(fb.events.Application.RESIZE,this.onStageResize,this);
			},
			/**
			 * Unbind all events, useful when destroying an object
			 */
			removeEventListeners:function(){
				this.unbind('',null,this);
			},
			/**
			 * Called from the constructor, use this function to set up defaults etc
			 */
			init:function(options){

			},
			/**
			 * Create child views in this function
			 */
			createChildren : function(){

			},

			/**
			 * Automatically build
			 * @param $el optional target to search within
			 */
			autoAddChildren : function($el){
				var $candidates = $el ? $el.find('[data-view-class]'): this.$('[data-view-class]');

				var $views = [];
				var self = this;

				//console.log('autoAddChildren',this);

				$candidates.each(function(i,el){

					var $el = $(el);

					var $parents = $el.parents('[data-view-class]');
					var thisViewCanAddChild = true;

					$parents.each(function(i,p){//we only want to add views which have no other possible parents
						var $parent = $(p);
						if($.contains(self.$el.get(0),$parent.get(0))){
							thisViewCanAddChild = false;
						}
					});

					if(thisViewCanAddChild){
						var viewClassString = $el.data('viewClass');
						var viewParams = $el.data('viewParams');

						if(typeof viewParams == 'string'){
							try{
								viewParams = $.parseJSON(viewParams);
								console.log(viewParams,typeof viewParams);
							}
							catch(exc){
								console.log(exc);
								viewParams = null;
							}
						}


						var Class = fb.Namespace.getClassByString(viewClassString);
						if(! viewParams){
							viewParams = {};
						}
						viewParams.el = $el;


						//console.log('adding child:',viewClassString,$el.get(0));

						//console.log(window);

						if(! Class){
							throw new Error('Class not defined: ' + viewClassString);
						}

						var child = self.addChild(new Class(viewParams));



					}

				});


			},


			/**
			 * Adds the child view to the children array and returns it. If the results of the child's getPath() function returns a URL,
			 * the child is added to the navigableChildren array too
			 * @param {fb.View} view
			 * @returns {fb.View}
			 */
			addChild:function(view){

				if(_.indexOf(this.children,view) == -1){
					this.children.push(view);
				}
				var path = view.getPath(true) == '/' ? view.getPath(true) : view.getPath();
				if(path){
					this.pathMap[view.getPath()] = view;
					this.navigableChildren.push(view);
				}
				return view;
				//view.trigger(fb.events.View.ADDED);
			},
			/**
			 * Gets the child at the given index
			 * @param index
			 * @returns {fb.View}
			 */
			getChildAt:function(index){
				return this.children[index];
			},
			/**
			 * Removes the child view
			 * @param view
			 */
			removeChild:function(view){
				var index = _.indexOf(this.children,view);
				if(index != -1){
					this.children.splice(index,1);
				}
				if(view.getPath() != null){
					index = _.indexOf(this.navigableChildren,view);
					if(index != -1){
						this.navigableChildren.splice(index,1);
					}
					delete this.pathMap[view.getPath()];
				}
				view.unbind();
				view.remove();
				//view.trigger(fb.events.View.REMOVED);
			}
			,rmView : function(view){
				view.unbind();
			},
			/**
			 * Gets a child from the given URL path, or null if not found
			 * @param {string} path
			 * @returns {fb.View}
			 */
			getChildByPath:function(path){
				var v = null;
				path = path.replace(/^[#\/]/,'');

				_.each(this.pathMap,function(view){
					var _p = view.getPath();
					//console.log(_p,path,path.indexOf(_p));
					if(_p === path || (_p.length && path.indexOf(_p) == 0)){
						//if(! v){
							v = view;
						//}
					}
				},this);
				return v;
			},
			/**
			 * Gets the path from an object. By default leading slashes are disregarded, as Backbone strips them
			 * @param {boolean} keepLeadingSlash default is false
			 * @returns {string}
			 */
			getPath:function(keepLeadingSlash){//strip leading slashes
				if(keepLeadingSlash){
					return this.path.replace(/^[#]/,'');
				}
				return this.path.replace(/^[#\/]/,'');
			},
			/**
			 * Shows this View's element. Triggers a fb.events.View.SHOW_COMPLETE event
			 */
			show:function(){
				this.$el.show();
				this.trigger(fb.events.View.SHOW_COMPLETE);
			},
			/**
			 * Hides this View's element. Triggers a fb.events.View.HIDE_COMPLETE event
			 */
			hide:function(){
				this.$el.hide();
				this.trigger(fb.events.View.HIDE_COMPLETE);
			},
			/**
			 * Gets or sets the width of the element
			 * @param [value] if provided sets width, else gets width
			 * @param [cascade] if true, then call the onParentResize method of all children
			 * @returns {null|number}
			 */
			width:function(value,cascade){
				if(! _.isUndefined(value)){
					return this.size(value,null,cascade);
				}
				else{
					return this.size().width;
				}
			},
			/**
			 * Gets or sets the height of the element
			 * @param [value] if provided sets height, else gets height
			 * @param [cascade] if true, then call the onParentResize method of all children
			 * @returns {null|number}
			 */
			height:function(value,cascade){
				if(! _.isUndefined(value)){
					return this.size(null,value,cascade);
				}
				else{
					return this.size().height;
				}
			},
			/**
			 * Gets or sets the width and height of the element
			 * @param {number} [width]
			 * @param {number} [height]
			 * @param [cascade] if true, then call the onParentResize method of all children
			 * @returns {{width:number,height:number} | null}
			 */
			size:function(width,height,cascade){
				var w = this.$el.width();
				var h = this.$el.height();

				if(! _.isUndefined(width) || ! _.isUndefined(height)){

					if(! _.isUndefined(width) || ! _.isNull(width)){
						//cascade = cascade && w != width;
						this.$el.width(width);
					}
					if(! _.isUndefined(height) || ! _.isNull(height)){
						//cascade = cascade && h != height;
						this.$el.height(height);
					}
					if(cascade){
						_.each(this.children,function(child){
							child.onParentResize(this.$el.width(),this.$el.height());
						},this);
					}
					return this;
				}
				else{
					return {width:w,height:h};
				}
			},
			/**
			 * Gets the next child which can be navigated to, based on the order added to the child array
			 * @param [cycle] if true, will return to opposite end of array when beginning or end reached
			 * @returns {fb.View|null}
			 */
			nextNavigableChild:function(cycle){
				if(! this.navigableChildren.length){
					return null;
				}
				var index = this.navigationIndex + 1;
				if(index >= this.navigableChildren.length && ! cycle){
					return null;
				}
				index = index % this.navigableChildren.length;
				return this.navigableChildren[index];
			},
			/**
			 * Gets the previous child which can be navigated to, based on the order added to the child array
			 * @param [cycle] if true, will return to opposite end of array when beginning or end reached
			 * @returns {fb.View|null}
			 */
			prevNavigableChild:function(cycle){
				if(! this.navigableChildren.length){
					return null;
				}
				var index = this.navigationIndex - 1;
				if(index < 0 && ! cycle){
					return null;
				}
				else if(index < 0 && cycle){
					index = this.navigableChildren.length-1;
				}
				//this.navigationIndex = index;
				return this.navigableChildren[index];
			},
			/**
			 * Gets or sets the current navigable child. This affects the navigationIndex property
			 * @param {fb.View} [child] idf provided, the
			 * @returns {fb.View}
			 */
			currentNavigableChild:function(child){

				if(_.isUndefined(child)){
					return this.navigableChildren[this.navigationIndex];
				}
				else{
					var index  = _.indexOf(this.navigableChildren,child);
					this.navigationIndex = index;
					if(index != -1){
						return this.currentNavigableChild();
					}

					return child;
					//this.navigationChild
				}
			},
			/**
			 * Gets the navigable child at the given index
			 * @param index
			 * @returns {fb.View|null}
			 */
			getNavigableChildAt:function(index){
				return this.navigableChildren[index];
			},
			/**
			 * Gets the index of the child view relative to other navigable views
			 * @param child
			 * @returns {number}
			 */
			getNavigableIndex:function(child){
				return _.indexOf(this.navigableChildren,child);
			},
			/**
			 * Called when the Application's view resizes
			 * @param width
			 * @param height
			 * @param windowWidth
			 * @param windowHeight
			 */
			onStageResize:function(width,height,windowWidth,windowHeight){},
			/**
			 * Called when the parent view is programatically resized
			 * @param width
			 * @param height
			 */
			onParentResize : function(width,height){},
			/**
			 * Returns an array of children of the given class
			 * @param classRef
			 * @returns {fb.View[]}
			 */
			getChildrenByClass:function(classRef){

				return _.filter(this.children,function(child){
					return child instanceof classRef;
				},this);
			},
			/**
			 * Returns the first child of the given class
			 * @param classRef
			 * @returns {fb.View|null}
			 */
			getFirstChildByClass:function(classRef){
				return _.first(this.getChildrenByClass(classRef));
			},
			/**
			 * Adds a tick function to the tick stack for execution on next tick
			 * @param name
			 * @param fxn
			 * @param scope scope to run the function in, if required
			 */
			addTickFunction:function(name,fxn,scope){
				var tickArray = _.toArray(this.tickStack);
				var isTicking = tickArray.length >0;
				if(scope){
					fxn = _.bind(fxn,scope);
				}
				if(! this.tickStack[name]){
					this.tickStack[name] = fxn;
				}
				if(! isTicking){
					requestAnimationFrame(_.bind(this.executeTickStack,this));
				}
			},
			executeTickStack:function(){
				var tickStack = this.tickStack;
				_.each(tickStack,function(fxn,index){
					fxn.apply();
					delete tickStack[index];

				});
			}



		})
	);
	/**
	 * @class fb.Application represents a master view / event listener. There can only active Application for a single request
	 * @extends fb.View
	 */
	fb.Application = fb.View.extend({
		/**
		 * @default $(window)
		 */
		el:window,
		width:0,
		height:0,
		minWidth:0,
		minHeight:0,
		pushState:false,
		/**
		 * Called by the Router when a route is received
		 * @param {string} value
		 */
		route:function(value){
			console.log('route received:' + value);
		},
		initialize:function(options){
			this.children = [];
			this.pathMap = {};
			this.tickStack = {};
			this.navigableChildren = [];
			this.init(options);
			$(window).resize(_.debounce(_.bind(this.onResize,this),100));
//		$(window).bind(_.debounce('orientationchange',_.bind(this.onResize,this)));


			this.addEventListeners();
		},
		/**
		 * Event handler, bound to window.resize() events
		 */
		onResize:function(){
			this.width = Math.max(this.minWidth,this.$el.width());
			this.height = Math.max(this.minHeight,this.$el.height());
			var wWidth = $(window).width();
			var wHeight = $(window).height();
			this.trigger(fb.events.Application.RESIZE,this.width,this.height,wWidth,wHeight);
		},
		events:{
		},
		addEventListeners: function(){
			this.removeEventListeners();
		},
		/**
		 * Starts the application
		 */
		start : function(){
			if(this.autoBuild){
				this.autoAddChildren();
			}
			this.createChildren();
			this.onResize();
			Backbone.history.start({pushState:this.pushState});
		}
	});
	/**
	 * @class fb.CollectionView a view for a corresponding fb.Collection
	 * @extends fb.View
	 */
	fb.CollectionView = fb.View.extend({
		/**
		 * @type fb.Collection
		 */
		collection:null,
		/**
		 * @type string The name of the template used to render
		 */
		itemTemplate:'',
		/**
		 * Renders a single item
		 * @param {fb.Model} item
		 * @returns {String}
		 */
		renderItem:function(item){
			return this.renderTemplate(this.itemTemplate,item);
		},
		/**
		 * Renders the entire collection by calling renderItem on each
		 * @returns {string}
		 */
		renderCollection:function(){
			var ret = '';
			this.collection.each(function(item){
				ret += this.renderItem(item);
			});
			return ret;
		},
		render:function(){
			this.$el.html(this.renderCollection());
		}
	});
	/**
	 * @class fb.Model
	 * @extends Backbone.Model
	 */
	fb.Model = Backbone.Model.extend(
		_.extend(fb.Mixin.getAll(),{
			initialize:function(attributes, options){
				//_.extend(this,options);
				this.init(attributes, options);
			},
			init:function(attributes,options){

			},
			set:function(key, value, options){
				var _bbAttrs = {};
				if(_.isObject(key)){
					_.each(key,function(item,_key){
						if(this.get(_key) instanceof Backbone.Model || this.get(_key) instanceof Backbone.Collection){
							_bbAttrs[_key] = key[_key];
							delete key[_key];//stop it from being set automatically
						}
					},this);

				};

				var ret = Backbone.Model.prototype.set.apply(this,arguments);
				_.each(_bbAttrs,function(item,_key){
					if(this.get(_key) instanceof Backbone.Collection){
						this.get(_key).reset(item);
					}
					else if(this.get(_key) instanceof Backbone.Model){
						this.get(_key).set(item);
					}
					//reset the passed argument so it is not modified
					key[_key] = item;
				},this);
				return ret;
			},
			toJSON:function(){
				var serialized = this._super(fb.Model,'toJSON');
				_.each(serialized,function(item,key){
					if(item instanceof Backbone.Model){
						serialized[key] = item.toJSON();
					}


				},this);
				return serialized;
			}
		})
	);


	/**
	 * The application-wide model
	 * @class fb.AppModel
	 * @extends fb.Model
	 */
	fb.AppModel = fb.Model.extend({

	});
	/**
	 *
	 * @class fb.Collection
	 * @extends Backbone.Collection
	 */
	fb.Collection = Backbone.Collection.extend(
		_.extend(fb.Mixin.getAll(),{
			/**
			 * This function is overriden to handle standard FB responses
			 * @param options
			 * @returns {Function}
			 */
			fetch: function(options) {
				options = options ? _.clone(options) : {};
				if (options.parse === undefined) options.parse = true;
				var collection = this;
				var success = options.success;
				options.error = Backbone.wrapError(options.error, collection, options);
				options.success = function(resp, status, xhr) {
					if(! resp.success){
						options.error.call();
					}
					collection[options.add ? 'add' : 'reset'](collection.parse(resp.data, xhr), options);
					if (success) success(collection, resp);
				};

				return (this.sync || Backbone.sync).call(this, 'read', this, options);
			}
		})
	);

	/**
	 * @class fb.Router routes URL requests
	 * @extends  Backbone.Router
	 */
	fb.Router =  Backbone.Router.extend(
		_.extend(fb.Mixin.getAll(),{
			defaultPath:'/',
			routes: {
				"*actions": "defaultRoute"
			},
			/**
			 * Generally only use one route and pass this to the application as required
			 * @see fb.Application#route
			 * @param actions
			 * @returns {boolean}
			 */
			defaultRoute: function( actions ){
				// The variable passed in matches the variable in the route definition "actions"


				if(actions == ''){
					actions = this.defaultPath;
				}
				this.getApp().route(actions);
				return false;
			}
		})
	);


	/**
	 *
	 * @namespace fb.events event constants
	 */
	fb.events = {

	};

	/**
	 * @namespace fb.events.Application Application level event constants
	 */
	fb.events.Application = {
		/**
		 * @type string triggered when the application view resizes
		 */
		RESIZE:'application:resize',
		/**
		 * @type string triggered when there is an error
		 */
		ERROR:'application:error'
	};
	/**
	 * @namespace fb.events.View View level event constants
	 */
	fb.events.View = {
		/**
		 * @type string triggered when a view should be shown
		 */
		SHOW:'view:show',
		/**
		 * @type string triggered when a view has been shown
		 */
		SHOW_COMPLETE:'view:show:complete',
		/**
		 * @type string triggered when a view should be hidden
		 */
		HIDE:'view:hide',
		/**
		 * @type string triggered when a view has been hidden
		 */
		HIDE_COMPLETE:'view:hide:complete',
		/**
		 * @type string should be triggered when some action has completed, eg. an image has been loaded
		 */
		COMPLETE:'view:complete',
		/**
		 * @type string triggered when a child view is added
		 */
		ADDED:'view:added',
		/**
		 * @type string triggered when a child view is remvoed
		 */
		REMOVED:'view:removed'

	};

	return fb;
});