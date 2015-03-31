
var Rectangle = require(['model/Rectangle'],function(Rectangle){
    QUnit.module('Rectangle');
    QUnit.test( "Create", function( assert ) {
        var w = 203, h=101,l=12,t=17;
        var r1 = new Rectangle(l,t,w,h);

        assert.equal(r1.width,w,"width is set correctly");
        assert.equal(r1.height,h,"height is set correctly");
        assert.equal(r1.left,l,"left is set correctly");
        assert.equal(r1.top,t,"top is set correctly");
    });

    QUnit.test( "Clone", function( assert ) {
        var w = 203, h=101,l=12,t=17;
        var r1 = new Rectangle(l,t,w,h);

        var r2 = r1.clone();

        assert.deepEqual(r1,r2,"deep copy equal");

        assert.notStrictEqual(r1,r2,"not strictly equal");

    });


    // QUnit.test( "Scale", function( assert ) {
    //     var w = 203, h=101,l=12,t=17;
    //     var r1 = new Rectangle(l,t,w,h);



    //     var scales = [10,9,8,7,6,5,4,3,2,1,0.9,0.8,0.7,0.6,0.5,0.4,0.3,0.2,0.1];

    //     _.each(scales,function(scale){

    //         var scaledR1 = r1.scale(scale);

    //         assert.equal(r1.width * scale, scaledR1.width,"width is scaled correctly");
    //         assert.equal(r1.height * scale, scaledR1.height,"height is scaled correctly");
    //         assert.equal(r1.left * scale, scaledR1.left,"left is scaled correctly");
    //         assert.equal(r1.top * scale, scaledR1.top,"top is scaled correctly");

    //     });
    // });
    // QUnit.test( "Scale with rounding", function( assert ) {
    //     var w = 203, h=101,l=12,t=17;
    //     var r1 = new Rectangle(l,t,w,h);



    //     var scales = [10,9,8,7,6,5,4,3,2,1,0.9,0.8,0.7,0.6,0.5,0.4,0.3,0.2,0.1];

    //     _.each(scales,function(scale){

    //         var scaledR1 = r1.scale(scale,true);

    //         assert.equal(Math.round(r1.width * scale), scaledR1.width,"width is scaled correctly");
    //         assert.equal(Math.round(r1.height * scale), scaledR1.height,"height is scaled correctly");
    //         assert.equal(Math.round(r1.left * scale), scaledR1.left,"left is scaled correctly");
    //         assert.equal(Math.round(r1.top * scale), scaledR1.top,"top is scaled correctly");

    //     });
    // });

    QUnit.test( "In bounds", function( assert ) {
        var w = 203, h=101,l=2,t=9;
        var r1 = new Rectangle(l,t,w,h);

        var rTest = new Rectangle(l,t,w,h);

        assert.ok(rTest.inBounds(r1),'same');
        rTest = new Rectangle(l+1,t,w,h);
        assert.ok(! rTest.inBounds(r1),'left + 1');

        rTest = new Rectangle(l,t+1,w,h);
        assert.ok(! rTest.inBounds(r1),'top + 1');

        rTest = new Rectangle(l,t,w+1,h);
        assert.ok(! rTest.inBounds(r1),'width + 1');

        rTest = new Rectangle(l,t,w,h+1);
        assert.ok(! rTest.inBounds(r1),'height + 1');



        rTest = new Rectangle(l+1,t,w-1,h);
        assert.ok(rTest.inBounds(r1),'left + 1, width-1');

        rTest = new Rectangle(l,t+1,w,h-1);
        assert.ok(rTest.inBounds(r1),'top + 1, height-1');

        rTest = new Rectangle(l+1,t,w-1,h);
        assert.ok(rTest.inBounds(r1),'left + 1, width-1');


        rTest = new Rectangle(l-1,t,w,h);
        assert.ok(! rTest.inBounds(r1),'left -1');

        rTest = new Rectangle(l,t-1,w,h);
        assert.ok(! rTest.inBounds(r1),'top -1');

        rTest = new Rectangle(l-1,t-1,w,h);
        assert.ok(! rTest.inBounds(r1),'left -1 , top -1');

        rTest = new Rectangle(l-1,t-1,w-1,h-1);
        assert.ok(! rTest.inBounds(r1),'all -1');

        rTest = new Rectangle(l+1,t+1,w+1,h+1);
        assert.ok(! rTest.inBounds(r1),'all +1');

        rTest = new Rectangle(l+1,t+1,w-1,h-1);
        assert.ok(rTest.inBounds(r1),'shrink by 1');

    });

    QUnit.test("Get scale from rect",function(assert){
        var w = 200, h=100,l=0,t=0;
        var r1 = new Rectangle(l,t,w,h);
        var r2 = new Rectangle(l,t,w,h);

        assert.equal(r1.getScaleFromRectangle(r2),1,'same size');

        r2 = new Rectangle(l,t,w/2,h/2);
        assert.equal(r1.getScaleFromRectangle(r2),2, 'half size');

        r2 = new Rectangle(l,t,w/2,h/4);
        assert.equal(r1.getScaleFromRectangle(r2),2, 'half width, quarter height');

        r2 = new Rectangle(l,t,w/2,h/4);
        assert.equal(r1.getScaleFromRectangle(r2,true),4, 'half width, quarter height, maximal');


        r2 = new Rectangle(l,t,w* 2, h* 2);
        assert.equal(r1.getScaleFromRectangle(r2),1/2, 'double size');

        r2 = new Rectangle(l,t,w*2,h*4);
        assert.equal(r1.getScaleFromRectangle(r2),1/4, 'double width, quadruple height');

        r2 = new Rectangle(l,t,w*2,h*4);
        assert.equal(r1.getScaleFromRectangle(r2,true),1/2, 'double width, quadruple height, maximal');


    });

    QUnit.test( "Fit to bounds", function( assert ) {
        var l= 0,t= 0,w=200,h=100;

        var bounds = new Rectangle(l,t,w,h);

        var r1 = new Rectangle(l,t,w,h).fitToBounds(bounds),r2;

        assert.deepEqual(r1,bounds,"no change");
        assert.notStrictEqual(r1,bounds,"no same reference");

        r1 = new Rectangle(l,t,w+1,h).fitToBounds(bounds);
        assert.deepEqual(r1,bounds,"needs to shrink width");

        r1 = new Rectangle(l,t,w,h+1).fitToBounds(bounds);
        assert.deepEqual(r1,bounds,"needs to shrink height");

        r1 = new Rectangle(l-1,t,w,h).fitToBounds(bounds);
        assert.deepEqual(r1,bounds,"needs to move left");

        r1 = new Rectangle(l,t-1,w,h).fitToBounds(bounds);
        assert.deepEqual(r1,bounds,"needs to move top");

        r1 = new Rectangle(l+1,t,w-1,h)
        r2 = r1.fitToBounds(bounds);
        assert.deepEqual(r1,r2,"in bounds, so don't touch!");

        r1 = new Rectangle(l,t,w-1,h)
        r2 = r1.fitToBounds(bounds);
        assert.deepEqual(r1,r2,"in bounds, so don't touch!");



    });

});


