define([
    'views/BaseView',
    'views/Overlay',
    'views/overlay/Layer2'

], function (BaseView, Overlay, Layer2) {
    var _class = BaseView.extend({
        autoBuild: true
        ,overlay: null
        ,events:{
            'click a.overlay':'openOverlay',
            'click a.updateValue': 'updateValue'
        }
        ,createChildren: function () {
            this._super(_class, 'createChildren');
            this.Overlay = this.getFirstChildByClass(Layer2);
            this.$overlayContent          = this.Overlay.$el;
        }
        ,updateValue: function() {
            this.trigger(AppEvents.OVERLAY_TEST,this.getValue());
        }
        ,getValue: function() {
            return this.$el.find('input').val() ? this.$el.find('input').val() : 'empty value';
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