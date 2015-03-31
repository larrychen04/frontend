define([
    'views/Form'
    ,'model/AppEvents'
],
function(Form,AppEvents){
    var _class = Form.extend({
        data: null
        ,init : function(){
            this._super(_class,'init');
            this.defaultContent();
        }
        ,addEventListeners : function(){
            this._super(_class,'addEventListeners');
            this.$el.find('input.search-term-string').bind('keyup', _.bind(this.searchByString,this));
            this.$el.find('a.select-all').bind('click', _.bind(this.selectAll,this));
            this.$el.find('a.deselect-all').bind('click', _.bind(this.deselectAll,this));
        }
        ,defaultContent: function() {
            if (this.data == null){
                this.data = this.getData();
            }
            this.render(this.data);
        }
        ,render: function(people) {
            this.$el.find('ul').empty();
            var self = this;
            this.$el.find('.count-person').text(people.length);
            _.each(people, function(person){
                var $content = $(self.template({person: person}));
                $content.find('span.reg-list-check').bind('click', _.bind(self.updateStatus, this, self));
                self.$el.find('ul').append($content);
            });
        }
        ,updateStatus : function(self, e) {
            var $el = $(e.currentTarget);
            if ($el.hasClass('active')) {
                $el.removeClass('active').addClass('inactive');
                self.data[$el.closest('li').attr('data-person-id')].status = 'inactive';
            } else {
                $el.removeClass('inactive').addClass('active');
                self.data[$el.closest('li').attr('data-person-id')].status = 'active';
            }
        }
        ,selectAll : function(e) {
            if (this.data == null){
                this.data = this.getData();
            }
            var self = this;
            this.$el.find('ul li').each(function(){
                self.data[$(this).attr('data-person-id')].status = 'active';
                $(this).find('.reg-list-check').removeClass('inactive').addClass('active');
            });
        }
        ,deselectAll: function(e) {
            if (this.data == null){
                this.data = this.getData();
            }
            var self = this;
            this.$el.find('ul li').each(function(){
                self.data[$(this).attr('data-person-id')].status = 'inactive';
                $(this).find('.reg-list-check').removeClass('active').addClass('inactive');
            });
        }
        ,searchByString : function(e) {
            e.stopPropagation();
            var $el = $(e.currentTarget);
            var self = this;
            if (this.data == null){
                this.data = this.getData();
            }
            if ($el.val().length) {
                var people =  _.filter(self.data, function(person){ return person.name.indexOf($el.val()) > -1; });
                this.render(people);
            } else {
                this.render(this.data)
            }
        }
        ,getData: function() {
            var person = new Object();
            var people = new Array();
            for(var i=0; i< 1000; i++){
                person.id = i;
                person.status = 'inactive';
                person.avatar = '/img/company-icon.png';
                person.name = this.createRadomString() + ' ' + this.createRadomString();
                person.description = "Hiring Manager at Commonwealth Bank";
                people.push(person);
                person = new Object();
            }
            return people;
        }
        ,template: _.template([
            '<li class="col-sm-6 col-md-4" data-person-id="<%= person.id %>">',
                '<div class="reg-list-block">',
                    '<span class="reg-list-check <%= person.status %>">Following</span>',
                    '<img src="<%= person.avatar %>" class="nv-reg-list-avatar-img" alt="user-avatar"/>',
                    '<span class="nv-reg-list-name"><%= person.name %></span>',
                '</div>',
            '</li>'
        ].join('')) 
        ,createRadomString : function() {
            var text = "";
            var possible = "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz";
            for( var i=0; i < 7; i++ )
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            return text;
        }                       
    });
    return _class;
});


