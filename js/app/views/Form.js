define([
    'views/BaseView'
    ,'model/AppEvents'
],
function(BaseView,AppEvents){
    var _class = BaseView.extend({
        $parsleyFormInstance : null
        ,autoBuild:true
        ,init : function(){
            this._super(_class,'init');
        }
        ,addEventListeners :function(){
            this._super(_class,'addEventListeners');

            this.$el.find('input,select,textarea').bind('focus', _.bind(this.onFieldFocus,this));
            this.$el.find('input,select,textarea').bind('blur', _.bind(this.onFieldBlur,this));
            this.$el.find('button').bind('click', _.bind(this.onSubmitClick,this));

            this.$el.find('[data-disable-paste]').bind('paste', _.bind(this.onDisablePaste,this));

            this.$parsleyFormInstance = this.$el.parsley({
                    excluded: 'input.tt-hint'
                    ,errorsWrapper: ''
                    ,errorTemplate: ''
                    ,focus:'none'
                    ,trigger: false
                    ,openOnHover : true
                    ,errorsContainer: function(pEle) {
                        return '';
                    }
                }
            );
            $.listen('parsley:field:error', function (fieldInstance) {
                arrErrorMsg = ParsleyUI.getErrorsMessages(fieldInstance);
                errorMsg = arrErrorMsg.join(';');
                
                var $elementTarget = fieldInstance.$element;
                if (fieldInstance.$element.is('select'))
                    $elementTarget = fieldInstance.$element.parent().parent().find('div.selectric');

                $elementTarget
                    .popover('destroy')
                    .popover({
                        container: 'body',
                        placement: 'bottom',
                        template: '<div class="popover error" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>',
                        content: errorMsg
                    })
                    .popover('show');
            });

            $.listen('parsley:field:success', function (fieldInstance) {
                fieldInstance.$element.popover('destroy');
            });

            window.ParsleyValidator.addValidator('custom', function (value, requirement) {
                return requirement.length ==0 ||  value != requirement;
            }, -1).addMessage('en', 'custom', '');

            window.ParsleyValidator.addValidator('abn', function (value, requirement) {
                    var strippedValue  = value.replace(/\-/g,'');
                    var weights = [10,1,3,5,7,9,11,13,15,17,19];
                    var numbers = strippedValue.split("");
                    numbers[0] = numbers[0]-1;
                    var i;
                    var sum = 0;
                    for (i in numbers){
                        sum = sum + (parseInt(numbers[i]) * weights[i]);
                    }
                    return (sum / 89) % 1 == 0;

                }, 32).addMessage('en', 'abn', 'ABN invalid');

            window.ParsleyValidator.addValidator('acn', function (value, requirement) {
                var strippedValue  = value.replace(/\-/g,'');
                var weights = [8,7,6,5,4,3,2,1];
                var numbers = strippedValue.split("");
                var check = parseInt(numbers.pop());
                var i;
                var sum = 0;
                for (i in numbers){
                    sum = sum + (numbers[i] * weights[i]);
                }
                var remainder = sum % 10;
                var complement = 10 - remainder;
                if(complement == 10)
                    complement = 0;
                return  check === complement;
            }, 32).addMessage('en', 'acn', 'ACN invalid');

            $.listen('parsley:field:error', _.bind(this.onError,this));


            this.$el.find('select').selectric({
                //maxHeight:150,
                onClose : function(e){
                    $(e).blur();
                }
            });
        }
        ,onDisablePaste : function(e){
            e.preventDefault()
        }
        ,onError :function(e){
            var $el = e.$element;
            var $errorEl = $el.eq(0).closest('.field').find('.parsley-errors-list');
            if(parseInt($errorEl.css('width')) == 0){
                // TweenMax.killTweensOf($errorEl.eq(0));
                // if($el.hasClass('parsley-error')){
                //     TweenMax.fromTo($errorEl.eq(0),0.5,{width:'100%','opacity':0},{opacity:1});
                // }else{
                //     TweenMax.to($errorEl.eq(0),0.5,{width:'100%'});
                // }
            }
        }
        ,onFieldFocus :function(e){

            e.stopPropagation();
            var $el = $(e.currentTarget);
            $el.attr('data-parsley-trigger','blur');
            $el.popover("destroy");

            // close all select fields if they are open
            // $.each($('.field .selectricOpen select'),function(){
            //     $(this).data('selectric').close();
            // });

            // var Selectric = $el.data('selectric');
            // if(Selectric != undefined){
            //     Selectric.open();
            // }

            if(Modernizr.touch)
                $('header').hide();
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
            // var $el = $(e.currentTarget);
            // var selectic = $el.data('selectric');
            // if(selectic != undefined){
            //     e.stopPropagation();
            // }
            // if(Modernizr.touch) {
            //     $('header').show();
            // }
        }
        ,onSubmitClick : function(e) {
            e.stopPropagation();

            var isValid = this.isValid();
            if(isValid){
                this.$el.get(0).submit();
            } else {

            }
            return isValid;
        }
        ,isValid:function(){
            if(this.$parsleyFormInstance.isValid()){
                return true;
            }
            this.$parsleyFormInstance.validate();

            return false;
        }
    });
    return _class;
});


