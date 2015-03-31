define([
    'views/BaseView', 'model/AppEvents'

], function (BaseView, AppEvents) {
    var _class = BaseView.extend({
        autoShow: true,
        $content: null,
        $appendToEl: null,
        generateMarkup: true,
        autoBuild: true,
        template: '<div class="overlay-window"></div>',
        init: function () {
            this._super(_class, 'init');            
            if (!this.$el.html()) {
                this.$el = $(this.template);
                if (!this.$appendToEl) {
                    this.$appendToEl = $('main');
                }
                this.$el.appendTo(this.$appendToEl);
                this.$appendToEl.css('position', 'relative');
            }

            if(_class.additionalCssClasses){
                this.$el.addClass(_class.additionalCssClasses);
            }


            //this.$close  = this.$el.children('.close');
            if (!this.$content) {
                this.$content = this.$el.children().not('a');
            }
            else if (this.$content instanceof jQuery) {
                this.$content.appendTo(this.$el);
            }
            if (this.autoShow) {
                this.show();
            }

        },
        addEventListeners: function () {
            this._super(_class, 'addEventListeners');
            _.bindAll(this, 'onClose');
            this.$el.click(this.onClose);
        },
        showOverlay: function () {

            this.$el.show();
            var self = this;
            $('body').addClass('overlay-enabled');
            this.$content.css('margin-top', (-1*this.$content.height()));
            this.$content.animate({
                opacity: 1,
                marginTop:"100px"
            }, 1000, "linear", function() {
                self.getApp().onRestOverlayDisplay(self);
            });
            
            this.trigger(AppEvents.OVERLAY_OPENED, this);
            this.getApp().trigger(AppEvents.OVERLAY_OPENED, this);
        },
        show: function () {
            var self = this;
            if (this.getApp().overlayDisplay) {
                this.getApp().overlayDisplay.hide();
                setTimeout(function(){ 
                    self.showOverlay();
                }, 800);
            } else {
                this.showOverlay();
            }
        },
        hide: function () {
            var self = this;
            this.$content.animate({
                opacity: 0
            }, 800, "linear", function(){ 
                if (!self.getApp().overlayDisplay)
                    $('body').removeClass( "overlay-enabled");
                self.$el.hide();
                self.getApp().onRestOverlayDisplay(null);
            });
        },
        onClose: function (e) {
            if (e.target != this.$('.shadow').get(0) && e.target != this.$el.get(0)) {
                return true;
            }
            if (e) {
                e.stopPropagation();
            }
            this.hide();
            return false;
        }
    },{
        additionalCssClasses:''
    });
    return _class;
});