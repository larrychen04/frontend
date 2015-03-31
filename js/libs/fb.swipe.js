(function($){
/**
 *
 * Adds swipe functionality to a jQuery selector.
 *
 * Options:
 *
 * horizontal:boolean (true): detect horizontal swipes
 * vertical:boolean (false): detect vertical swipes
 * minDistance:integer (50): amount in pixels user needs to swipe to trigger swipe events
 * maxDistance: integer(2* minDistance): if user swipes more than this, swipe events will be triggered even if they haven't released the touch
 * moveHint:boolean (true): move the element while a user is swiping
 * moveHintRestoreDuration:float (0.25): if moveHint=true, the time taken in seconds to tween the element back to its starting place
 * preventDefaultEvents:boolean(false): prevent default touchmove events
 *
 * Events:
 *
 * swipeleft,swiperight,swipeup,swipedown: triggered when user swipes in given direction
 * swipemove: if moveHint=false,triggered while user is swiping, passes dx and dy properties indicating how far the user has swiped in horizontal / vertical directions.
 * swipecancel: if moveHint=false, triggered when user stops swiping and have not swiped by the threshold amount

 * @param options
 * @return jQuery
 */

$.fn.fbSwipe = function(options){

	if(window.Modernizr){
		$.support.touch = Modernizr.touch;
	}

	var settings = $.extend({},$.fn.fbSwipe.defaults,options);
	var $context = this;



	var $touchable = settings.touchTarget || $context;

	if(! $touchable.length){
		return $context;
	}

	var dx = 0;
	var dy = 0;
	var rx = 0;
	var ry = 0;
	var elX = 0;
	var elY = 0;
	var el = $touchable.get(0);
	var isTouching = false;

	if(settings.maxDistance == null){
		settings.maxDistance = 2 *settings.minDistance;
	}

	function onTouchStart(e){
		isTouching = true;
		var touch = e.touches[0];
		dx = 0;
		dy = 0;
		rx = touch.pageX;
		ry = touch.pageY;
		elX = parseFloat($context.css('left')) ||0;
		elY = parseFloat($context.css('top'))||0;

		//console.log(rx +":" +ry +":" +elX +":" +elY);
	};

	function onTouchEnd(e){
		if(! isTouching){
			return;
		}
		isTouching = false;
		if(settings.horizontal){
			if(Math.abs(dx) >= settings.minDistance){
				$context.trigger(dx > 0 ? 'swiperight' : 'swipeleft');
			}
			else{
				$context.trigger('swipecancel');
			}
		}
		if(settings.vertical){
			if(Math.abs(dy) >= settings.minDistance){
				$context.trigger(dy > 0 ? 'swipedown' : 'swipeup');
			}
			else if(settings.moveHint){
			}
			else{
				$context.trigger('swipecancel');
			}
		}
	};




	function onTouchMove(e){

		if(! isTouching){
			e.preventDefault();
			return;
		}

		var touch = e.touches[0];
		dx = touch.pageX - rx;
		dy = touch.pageY - ry;

		var preventDefault = settings.preventDefaultCallback ? settings.preventDefaultCallback.call(null,dx,dy) :  function(){

			if(settings.horizontal &&settings.vertical){
				return true;
			}
			var tooSmall = settings.ignoreBelow;
			if(Math.abs(dx) < tooSmall && Math.abs(dy) <tooSmall){//ignore small movements
				return false;
			}
			if(settings.horizontal && Math.abs(dx) > Math.abs(dy)){//prevent if swiping horizontally
				return true;
			}
			if(settings.vertical && Math.abs(dy) > Math.abs(dx)){//prevent if swiping vertically
				return true;
			}
			return false;
		}();
		if(preventDefault){
			e.preventDefault();
		}
		if(settings.horizontal && Math.abs(dx) >= settings.maxDistance){
			onTouchEnd();
			return;
		}
		if(settings.vertical && Math.abs(dy) >= settings.maxDistance){
			onTouchEnd();
			return;
		}
		if(settings.moveHint){
			if(settings.horizontal && Math.abs(dx) > settings.ignoreBelow){
				$context.css('x',elX + dx);
			}
			if(settings.vertical && Math.abs(dy) > settings.ignoreBelow){
				$context.css('y',elY + dy);
			}
		}
		else if(Math.abs(dx) > settings.ignoreBelow || Math.abs(dy) > settings.ignoreBelow){
			$context.trigger('swipemove',dx,dy);
		}

	};

	this.addEventListeners = function(){
		if(! $.support.touch){
			return;
		}
		el.addEventListener('touchstart',onTouchStart);
		el.addEventListener('touchend',onTouchEnd);
		el.addEventListener('touchmove',onTouchMove);
	};


	this.removeEventListeners = function(){
		if(!$.support.touch){
			return;
		}
		el.removeEventListener('touchstart',onTouchStart);
		el.removeEventListener('touchend',onTouchEnd);
		el.removeEventListener('touchmove',onTouchMove);
	};


	$context.addEventListeners();

	return $context;

};
$.fn.fbSwipe.defaults = {
	horizontal:true,
	vertical:false,
	moveHint:true,
	moveHintRestoreDuration:0.25,
	minDistance:50,
	maxDistance:null,
	ignoreBelow:10,
	preventDefaultCallback:null
};

})(jQuery);