define([
    'views/BaseView'
],
function(BaseView){
    var _class = BaseView.extend({
        email: null
        ,firstName: null
        ,lastName: null
        ,password: null
        ,confirmPassword: null
        ,init : function(){
            this._super(_class,'init');
        }
        ,passwordFieldViewId : function() {
            return this.$el.find('input.password').attr('data-parsley-id');
        }
        ,confirmPasswordFieldViewId : function() {
            return this.$el.find('input.confirmPassword').attr('data-parsley-id');
        }
        ,checkPasswordValid : function() {
            var result = {type: "error", msg: ""};

            this.email     = this.$el.find('input.email').val();
            this.firstName = this.$el.find('input.firstname').val();
            this.lastName  = this.$el.find('input.lastname').val();
            this.password  = this.$el.find('input.password').val();
            this.confirmPassword = this.$el.find('input.confirmPassword').val();

            //Except Not null, not empty
            if(!this.password.trim().length){
                result.type = 'success';
                return result;
            }

            //Length should be >=8
            if(this.password.length < 8){
                result.msg = 'Your password needs to be at least 8 characters long.';
                return result;
            }

            //Length should be <=20
            if(this.password.length > 20){
                result.msg = 'Your password is limited to less than 20 characters.';
                return result;
            }

            //Should be a mix of number and character
            var isAlphanumeric = /^(?=.*[0-9])(?=.*[a-z])([a-z0-9]+)$/i;
            if(!isAlphanumeric.test(this.password)){
                result.msg = 'Your password needs to include at least one letter and one number.';
                return result;
            }

            //There should be no whitespace in the password
            if (/\s/.test(this.password)) {
                result.msg = 'Your password should be no whitespace.';
                return result;
            }

            //A password cannot contain any parts of your email
            if(this.email && this.email.length > 0){
                var emailAt = this.email.indexOf("@"),
                    firstPart = this.email.substring(0, emailAt),
                    secondPart = this.email.substring(emailAt+1, this.email.length).substring(0, this.email.substring(emailAt+1, this.email.length).indexOf('.'));

                if(firstPart && secondPart && (this.password.search(firstPart) > -1 || this.password.search(secondPart) > -1)){
                    result.msg = 'Password can\'t contain any part of your email address';
                    return result;
                }
            }

            //A password cannot match first name.
            if(this.firstName && this.firstName.length > 2 && (this.password.toLowerCase().search(this.firstName.toLowerCase()) > -1)) {
                result.msg = 'Your password can\'t match your first name';
                return result;
            }

            //A password cannot match last name.
            if(this.lastName && this.lastName.length > 2 && (this.password.toLowerCase().search(this.lastName.toLowerCase()) > -1)) {
                result.msg = 'Your password can\'t match your last name';
                return result;
            }
            
            //A password cannot be easy to guess
            if(this.isWeak(this.password)){
                result.msg = 'Your password is too common.';
                return result;
            } 

            result.type = "success";
            return result;
        }
        ,isWeak: function(value){
            var dumbPasswords = [
                'password12345',
                'pw124567',
                '1234567pw',
                '12345678',
                'qwertyu1',
                'abc12345',
                '12345abc',
                'password1',
                'iloveyou1',
                'trustno1',
                'incorrect',
                'abcd1234'
            ];
            var isWeak = false;
            dumbPasswords.forEach(function(dumbPassword){
                if(value == dumbPassword){
                    isWeak = true;
                }
            });
            return isWeak;
        }  
        ,checkConfirmPasswrodValid : function() {
            var result = {type: "error", msg: ""};

            this.password  = this.$el.find('input.password').val();
            this.confirmPassword = this.$el.find('input.confirmPassword').val();

            //Except Not null, not empty
            if(!this.confirmPassword.trim().length){
                result.type = 'success';
                return result;
            }

            if (this.password != this.confirmPassword) {
                result.msg = "Passwords don\'t match.";
                return result;
            }

            result.type = 'success';
            return result;
        }
    });
    return _class;
});