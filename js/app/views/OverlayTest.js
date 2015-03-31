define([
    'views/BaseView',
    'views/Overlay',
    'views/overlay/Layer1'
],
function(BaseView, Overlay, Layer1){
    var _class =  BaseView.extend({
        autoBuild:true
        ,overlay: null
        ,events:{
            'click a.overlay':'openOverlay'
        }
        ,createChildren: function () {
            this._super(_class, 'createChildren');
            this.Overlay = this.getFirstChildByClass(Layer1);
            this.$overlayContent          = this.Overlay.$el;
        }
        ,addEventListeners: function () {
            this._super(_class, 'addEventListeners');
            this.Overlay.bind(AppEvents.OVERLAY_TEST, _.bind(this.overlay_test,this));
        }
        ,overlay_test: function(val) {
            this.$el.find('input.overlay').val(val);
        }
        ,openOverlay: function() {
            if (!this.overlay) {
                this.overlay = new Overlay({
                    $content: this.$overlayContent,
                    $appendToEl: $('body'),
                    autoBuild: false
                });
            }
            else {
                this.overlay.show();
            }
            return false;
        }
    });
    return _class;
});