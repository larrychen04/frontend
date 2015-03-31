define(['fb','App','AppModel','Router'],function(fb,Application,AppModel,Router){
	var model,router,app,templates;

	$(function(){
		model = new AppModel();
		router = new Router();
		templates = {};
		app = new Application({el:'body'});
		app.isOldIe = $('html').hasClass('lt-ie9');

		fb.Registry.register(app, model, router, templates);
		app.start();

		return app;
	});

	return {};
});