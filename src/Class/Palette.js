/**
 * Created by Caoyp on 2015/11/3.
 */

function Palette(sprite,sprite2,drawNode,drawNode2,gameLayer){

    this._sprite = sprite;
    this._sprite2 = sprite2;
    this._drawNode = drawNode;
    this._drawNode2 = drawNode2;
    this._gameLayer = gameLayer;

    this.init();

}


Palette.prototype.init = function () {
    this._sprite.addChild(this._drawNode);
    this._sprite2.addChild(this._drawNode2);

    this._sprite.x = g_viewWidth;
    this._sprite2.x = 2 * g_viewWidth;

    this._drawSegmentRectArray = new Array();
    this._drawSegmentRectArray2 = new Array();

    this.draw(this._drawNode, this._sprite, this._drawSegmentRectArray );
    this.draw(this._drawNode2, this._sprite2, this._drawSegmentRectArray2);


}

Palette.prototype.attach = function (parent) {
    parent.addChild(this._sprite);
    parent.addChild(this._sprite2);

}

Palette.prototype.draw = function (drawNode,sprite,segmentRectArray) {

    drawNode.clear();

    var segmentHeight = g_drawSegmentWidth;

    for ( var i=0; i < 3; ++i ) {
        var random = Math.random()* g_viewHeight / 2;

        for ( var j=0; j < 2; ++j ) {

            var originX;
            var originY;

            if ( j ) {
                originX = g_viewWidth * i / 3;
                originY = g_viewHeight / 2 + random;
                drawNode.drawSegment( cc.p( originX, originY ), cc.p( g_viewWidth * i / 3 + g_viewWidth / 6 - 2 * segmentHeight, g_viewHeight / 2 +random ), segmentHeight, cc.color( 255, 255, 255, 128 ) );
            } else {
                originX = g_viewWidth * i / 3;
                originY = random;
                drawNode.drawSegment( cc.p( originX ,originY ), cc.p( g_viewWidth * i / 3 + g_viewWidth / 6 - 2 * segmentHeight, random ), segmentHeight, cc.color( 255, 255, 255, 128 ) );
            }

            segmentRectArray.push( cc.rect( sprite.x + originX - segmentHeight, originY - segmentHeight, g_viewWidth / 6, 2 * segmentHeight ) );

        }
    }

    /*var body = new cp.Body(1, cp.momentForBox(1, g_viewWidth / 6, segmentHeight));
     body.setPos(cc.p(originX + g_viewWidth / 12, originY + segmentHeight / 2 ));
     this._gameLayer._space.addBody(body);

     var shape = new cp.BoxShape(body, g_viewWidth / 6, segmentHeight);
     shape.setElasticity(0.5);
     shape.setFriction(0.5);
     this._gameLayer._space.addShape(shape);

     var physicsSprite = cc.PhysicsSprite.create("res/CloseNormal.png");
     physicsSprite.setBody( body );
     physicsSprite.x = originX + g_viewWidth / 12;
     physicsSprite.y = originY + segmentHeight / 2;
     sprite.addChild(physicsSprite);*/

    /*var delta;

    for ( var i=0; i < 5; ++i ) {
        var direction = Math.floor(Math.random()*2);

        if ( direction ) {
            delta = g_gameDelta;
        } else {
            delta = - g_gameDelta;
        }

        if ( this._preBottomHeight + delta > g_viewHeight ) {
            delta = - g_gameDelta;
        } else if ( this._preBottomHeight + delta < 0 ) {
            delta = g_gameDelta;
        }

        this._preBottomHeight += delta;

        for ( var j=0; j < 2; ++j ) {

            if ( j ) {
                var points = [ cc.p(g_viewWidth * i/5 + 20, this._preBottomHeight + g_viewHeight / 2), cc.p(g_viewWidth * (1 + i)/5, this._preBottomHeight + g_viewHeight / 2), cc.p(g_viewWidth * (1 + i)/5, g_viewHeight), cc.p(g_viewWidth * i/5 + 20, g_viewHeight) ];
                drawNode.drawPoly(points, cc.color(255,0,0,128), 1, cc.color(0,128,128,255) );
            }
            else {
                var points = [ cc.p(g_viewWidth * i/5 + 20, 0), cc.p(g_viewWidth * (1 + i)/5, 0), cc.p(g_viewWidth * (1 + i)/5, this._preBottomHeight), cc.p(g_viewWidth * i/5 + 20, this._preBottomHeight) ];
                drawNode.drawPoly(points, cc.color(255,0,0,128), 1, cc.color(0,128,128,255) );
            }


        }
    }*/


    //for( var i=0; i < 10; i++) {
    //    drawNode.drawDot( cc.p(winSize.width/2, winSize.height/2), 10*(10-i), cc.color( Math.random()*255, Math.random()*255, Math.random()*255, 255) );
    //}

   /* //
    // Circles
    //
    for( var i=0; i < 10; i++) {
        drawNode.drawDot( cc.p(winSize.width/2, winSize.height/2), 10*(10-i), cc.color( Math.random()*255, Math.random()*255, Math.random()*255, 255) );
    }

    //
    // Polygons
    //
    var points = [ cc.p(winSize.height/4,0), cc.p(winSize.width,winSize.height/5), cc.p(winSize.width/3*2,winSize.height) ];
    drawNode.drawPoly(points, cc.color(255,0,0,128), 8, cc.color(0,128,128,255) );

    // star poly (triggers bugs)
    var o=80;
    var w=20;
    var h=50;
    var star = [
        cc.p(o+w,o-h), cc.p(o+w*2, o),                  // lower spike
        cc.p(o + w*2 + h, o+w ), cc.p(o + w*2, o+w*2),  // right spike
        cc.p(o +w, o+w*2+h), cc.p(o,o+w*2),             // top spike
        cc.p(o -h, o+w), cc.p(o,o)                     // left spike
    ];
    drawNode.drawPoly(star, cc.color(255,0,0,128), 2, cc.color(0,0,255,255) );*/


}

Palette.prototype.update = function () {

    this._sprite.x -= g_segmentSpeed;
    this._sprite2.x -= g_segmentSpeed;

    if ( this._sprite.x < - g_viewWidth ) {
        this._drawSegmentRectArray.splice(0,this._drawSegmentRectArray.length );
        this._sprite.x = g_viewWidth;
        this.draw(this._drawNode, this._sprite,this._drawSegmentRectArray);

     }

    if ( this._sprite2.x < - g_viewWidth ) {
        this._drawSegmentRectArray2.splice(0,this._drawSegmentRectArray2.length );
        this._sprite2.x = g_viewWidth;
        this.draw(this._drawNode2, this._sprite2,this._drawSegmentRectArray2);

    }

    this.updateSegmentRect();
    this.collisionDetection();

}

Palette.prototype.updateSegmentRect = function () {

    for ( var i = 0; i < this._drawSegmentRectArray.length; ++ i ) {
        this._drawSegmentRectArray[i].x -= g_segmentSpeed;
    }

    for ( var i = 0; i < this._drawSegmentRectArray2.length; ++ i ) {
        this._drawSegmentRectArray2[i].x -= g_segmentSpeed;
    }

}

Palette.prototype.collisionDetection = function () {
    var w = 56;
    var h = 56;
    var x = g_roleInstance.getAnimation().x - w/2;
    var y = g_roleInstance.getAnimation().y - h/2;

    //cc.log( "x=" + g_roleInstance.getAnimation().x + "y=" + g_roleInstance.getAnimation().y );

    for ( var i = 0; i < this._drawSegmentRectArray.length; ++ i ) {
        if ( cc.rectIntersectsRect( cc.rect( x, y, w, h ), this._drawSegmentRectArray[i] ) ) {
            //cc.log( "_drawSegmentRectArray1 collision" );
            //g_roleInstance.getAnimation().visible = false;

            cc.log( "x=" + this._drawSegmentRectArray[i].x + "y=" + this._drawSegmentRectArray[i].y );
        }

        //cc.log( "x=" + this._drawSegmentRectArray[i].x + "y=" + this._drawSegmentRectArray[i].y + "w=" + this._drawSegmentRectArray[i].width + "h=" + this._drawSegmentRectArray[i].height );

    }

    //cc.log( this._drawSegmentRectArray.length );
    //cc.log( this._drawSegmentRectArray2.length );

    for ( var i = 0; i < this._drawSegmentRectArray2.length; ++ i ) {
        if ( cc.rectIntersectsRect( cc.rect( x, y, w, h ), this._drawSegmentRectArray2[i] ) ) {
            //cc.log( "_drawSegmentRectArray2 collision" );
            //g_roleInstance.getAnimation().visible = false;

            cc.log( "x=" + this._drawSegmentRectArray2[i].x + "y=" + this._drawSegmentRectArray2[i].y );
        }

        //cc.log( "x=" + this._drawSegmentRectArray2[i].x + "y=" + this._drawSegmentRectArray2[i].y + "w=" + this._drawSegmentRectArray2[i].width + "h=" + this._drawSegmentRectArray2[i].height );

    }


}