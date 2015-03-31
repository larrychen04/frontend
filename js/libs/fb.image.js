(function($){
$.fn.fbImageLoad = function (handler,errorHandler,fireForDataUris) {
	var isFF = navigator.userAgent.search(/firefox/gi) != -1;
	this.each(function () {
		var $loadable = $(this);
		var loader = this;

		var _handler = function (event) {
			$loadable.unbind('load', _handler);
			handler.apply(this, [event]);
		}

		var _errorHandler = function(event){
			$loadable.unbind('error', _errorHandler);
			if(errorHandler){
				errorHandler.apply(this, [event]);
			}
		}

		$loadable.load(_handler);
		$loadable.error(_errorHandler);
		var complete = loader.src && loader.complete;//$loadable.attr('complete');

		//alert(this);

		/*var src= $(this).attr('fb:src');
		 if(src && src.length){
		 $loadable.attr('src',src);
		 }*/

		if (complete) {
			if (typeof loader.naturalWidth != "undefined" && loader.naturalWidth == 0) {//indicates an error
				$loadable.trigger("error");
				$loadable.unbind('error', _errorHandler);
				return;
			}

			if (loader.src.search(/^data:.+$/gi) == -1) {
				$loadable.trigger("load");
				$loadable.unbind('load', _handler);
				return;
			}
			else if(fireForDataUris){//ignore data urls unless specified
				$loadable.trigger("load");
				$loadable.unbind('load', _handler);
			}
			else{
				//console.log('ignoring data uri:' +loader.src);
			}
			return;
		}
		if (!loader) {
			return;
		}


		if (loader.readyState != null) {
			if (loader.readyState.toLowerCase() == "complete" && loader.complete) {
				$loadable.trigger("load");
				$loadable.unbind('load', _handler);
			}
			else {

				function checkLoad() {
					if (loader.complete) {
						clearInterval(interval);
						$loadable.trigger("load");
						$loadable.unbind('load', _handler);
					}
				}
				var interval = setInterval(checkLoad, 10);

			}


		}
	});
	return this;
};
//
})(jQuery);