define([
    'views/Form'
    ,'model/AppEvents'
    ,'views/Fields/Password'
],
function(Form,AppEvents,Password){
    var _class = Form.extend({
        passwordView: null
        ,init : function(){
            this._super(_class,'init');
            this.start();
        }
        ,createChildren : function () {
            this._super(_class, 'createChildren');
            this.passwordView = this.getFirstChildByClass(Password);
        }
        ,substringMatcher : function(self) {
            return function findMatches(q, cb) {
                console.log(5);
                var matches = [];
                setTimeout(function() {
                    if (self.$el.find('input.company-name.tt-input').val() == q){
                        $.getJSON(
                            '/company.php',
                            { query: q },
                            function (data) {
                                matches = data.companies;
                                matches.push({imageUrl: '', name: q, status: 'new'});
                                return cb(matches);
                            }
                        );
                    }
                }, 450)
            }
        }
        ,start : function() {
            var self = this;
            this.$el.find('input.company-name').typeahead({
              hint: true,
              highlight: true,
              minLength: 1
            },
            {
              name: 'companies',
              displayKey: 'name',
              templates: {
                suggestion: function(data){
                    if (data.status != 'undefined' && data.status == "new") {
                        return '<img src="' + data.imageUrl + '" width="30px"/><span><strong>Create new company "' + data.name + '"</strong></span>';
                    } else {
                        return '<img src="' + data.imageUrl + '" width="30px"/><span>' + data.name + '</span>';
                    }
                }
              },
              source: self.substringMatcher(self)
            }
            );
        }
        ,checkPasswrodValid : function () {
            var checkPasswordValid = this.passwordView.checkPasswordValid();
            if (checkPasswordValid.type == 'error') {
                this.displayCustomError(this.$parsleyFormInstance.fieldsMappedById["ParsleyField-"+this.passwordView.passwordFieldViewId()], checkPasswordValid.msg);
                return false;
            }

            return true;
        }
        ,checkConfirmPasswrodValid : function () {
            var checkConfirmPasswrodValid = this.passwordView.checkConfirmPasswrodValid();
            if (checkConfirmPasswrodValid.type == 'error') {
                this.displayCustomError(this.$parsleyFormInstance.fieldsMappedById["ParsleyField-"+this.passwordView.confirmPasswordFieldViewId()], checkConfirmPasswrodValid.msg);
                return false;            
            }

            return true;
        }
        ,displayCustomError: function (parsleyField, message) {
            parsleyField.$element
                .addClass('parsley-error')
                .popover('destroy')
                .popover({
                    container: 'body',
                    placement: 'bottom',
                    template: '<div class="popover error" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>',
                    content: message
                })
                .popover('show');
        }
        ,onFieldBlur : function(e){
            var $el = $(e.currentTarget);
            $el.removeAttr('data-parsley-trigger');

            if ($el.val().length) {
                var id = $el.attr('data-parsley-id');
                var parsleyField = this.$parsleyFormInstance.fieldsMappedById["ParsleyField-"+id];
                parsleyField.validate();
            } else {
                $el.removeClass('parsley-error');
            }

            this.checkPasswrodValid();

            if($el.hasClass('confirmPassword')) {
                this.checkConfirmPasswrodValid();
            }
        }
    });
    return _class;
});


