define([
    'views/BaseView'

], function (BaseView) {
    var _class = BaseView.extend({
        autoBuild: true
        ,init: function () {
            this._super(_class, 'init');
        }
    });
    return _class;
});