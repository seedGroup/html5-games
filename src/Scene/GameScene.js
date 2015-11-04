/**
 * Created by Caoyp on 2015/11/2.
 */

var GameLayer = cc.LayerGradient.extend({
    _role:null,
    _startTimeLabel:null,
    _startTime:null,
    _palette:null,

    ctor:function () {
        this._super(cc.color(0,0,0,255), cc.color(0x46,0x82,0xB4,255));
        this.initPhysics();
        this.init();
    },

    initPhysics: function () {
        var winSize = cc.director.getWinSize();
        this._space = new cp.Space();
        this.setupDebugNode();

        // 设置重力
        this._space.gravity = cp.v(-50, 0);
        var staticBody = this._space.staticBody;

        // 设置空间边界
        var walls = [ new cp.SegmentShape(staticBody, cp.v(0, 0),
            cp.v(winSize.width, 0), 0),
            //new cp.SegmentShape(staticBody, cp.v(0, winSize.height),
            //    cp.v(winSize.width, winSize.height), 0),
            //new cp.SegmentShape(staticBody, cp.v(0, 0),
            //    cp.v(0, winSize.height), 0),
            new cp.SegmentShape(staticBody, cp.v(winSize.width, 0),
                cp.v(winSize.width, winSize.height), 0)
        ];
        for (var i = 0; i < walls.length; i++) {
            var shape = walls[i];
            shape.setElasticity(1);
            shape.setFriction(1);
            this._space.addStaticShape(shape);
        }
    },

    setupDebugNode: function () {
        this._debugNode = new cc.PhysicsDebugNode(this._space);
        this._debugNode.visible = true;
        this.addChild(this._debugNode);
    },


    init:function () {


        _role = g_roleInstance.getAnimation();
        _role.setAnchorPoint(0.5,0.5);
        _role.x = g_viewWidth / 4;
        _role.y = g_viewHeight / 2;
        _role.scale = 0.6;
        this.addChild(_role);

        _startTime = 5;
        var _startTimeLabel = new cc.LabelBMFont("5", "res/fonts/futura-48.fnt");
        _startTimeLabel.setAnchorPoint(0.5,0.5);
        _startTimeLabel.x = g_viewWidth / 2;
        _startTimeLabel.y = g_viewHeight / 2;
        this.addChild(_startTimeLabel, 0, 10);
        var fade = cc.fadeOut(0.4);
        var fade_in = fade.reverse();
        var seq = cc.sequence(fade, cc.delayTime(0.2), fade_in);
        var repeat = seq.repeatForever();
        _startTimeLabel.runAction(repeat);
        this.schedule(this.updateTime, 1, 4, 1);

        this._palette = new Palette(cc.Sprite.create(),cc.Sprite.create(),new cc.DrawNode(),new cc.DrawNode(), this);
        this._palette.attach(this);

        this.schedule(this.update, 0.1);

        this.createBird ();

        return true;
    },

    createBird:function(){
        var animationTest = this.createAnimation("BirdAtlas", 8, 10);
        var animate = cc.animate(animationTest);
        var idle = cc.repeatForever(animate);

        var up = cc.moveBy(0.4, cc.p(0, 8));
        var back = up.reverse();
        var swing = cc.sequence(up, back).repeatForever();

        var bird = cc.Sprite.create();
        bird.x = cc.director.getWinSize().width / 2;
        bird.y = cc.director.getWinSize().height / 2;

       var body = new cp.Body(1, cp.momentForBox(1, 113, 50));
        body.setPos(cc.p(cc.director.getWinSize().width / 2, cc.director.getWinSize().height / 2));
        this._space.addBody(body);

        //var shape = new cp.BoxShape(body, 113, 50);
        var shape = this.createPolygonShape (this._space, body, ShapePlist);
        /*shape.setElasticity(0.5);
        shape.setFriction(0.5);*/
        //this._space.addShape(shape);

        this.addChild(bird);

        bird.runAction(idle);
        bird.runAction(swing);
    },

    createAnimation:function(aniName, count, fps) {
        var animation = cc.Animation.create();
        animation.setDelayPerUnit(1/fps);

        cc.spriteFrameCache.addSpriteFrames("res/" + aniName + ".plist", "res/" + aniName + ".png");

        for (var i = 0; i < count; i ++)
        {
            var frame = cc.spriteFrameCache.getSpriteFrame("ba_" + i + ".png");
            animation.addSpriteFrame(frame);
        }

        return animation;
    },

    createPolygonShape:function(targetSpace, targetBody, fileName) {
        cc.loader.loadTxt(fileName, function(err, txt){
            if(!err){
                //cc.log ("=====" + txt.getty + "=====");
                var data = cc.plistParser.parse(txt);
                var pointMap = new Array ();

                var bodies = data["bodies"];

                for (var key in bodies) {
                    var elements = bodies[key];
                    var fixtures = elements["fixtures"];
                    var fixArray = fixtures[0];

                    for (var key2 in fixArray) {
                        if (key2 == "polygons") {
                            var pointArray = fixArray[key2];
                            //cc.log("!!" + pointArray.length + "!!");
                            for (var i = 0 ; i < pointArray.length; i++) {
                                var element = pointArray[i];
                                //cc.log("-----------------");
                                for (var pintGroup in element) {
                                    var pointStr = element[pintGroup].toString();
                                    var pointStrArray = pointStr.split(",");
                                    var dic = {"0":1, "1":0};
                                    //cc.log(element.length + "," + pointStr);
                                    for (var j = 0; j < pointStrArray.length; j++)
                                    {
                                        var sTxt = j % 2 ? "}" : "{";
                                        var idx = j % 2 ? 0 : 1;

                                        var points = pointStrArray[j].toString().split(sTxt);
                                        var point = points[idx];

                                        dic[j] = Number(point);
                                        //dic.add(j, Number(point));
                                        // cc.log(j+" #### "+ Number(point)+" ####");
                                    }

                                    pointMap.push (dic);
                                }
                            }
                        }
                    }
                }
               // cc.log("Points Num: "+ pointMap.length +" ");

                var decodedPoints = new Array();
                for (var kk = 0; kk< pointMap.length; kk++)
                {
                    var ppp = pointMap[kk];
                    //cc.log("Map 0 : "+ ppp[0] );
                    //cc.log("Map 1 : "+ ppp[1] );

                    var fp = Number(ppp[0]);
                    var sp = Number(ppp[0]);

                    decodedPoints.push(fp);
                    decodedPoints.push(sp);
                }

               cc.log("||: " + decodedPoints.length);

                for (var kk2 = 0; kk2< decodedPoints.length; kk2++)
                {
                    var ppp = decodedPoints[kk2];
                    cc.log("Map Number : "+ ppp );
                }

                var polygonShape = new cp.PolyShape(targetBody, decodedPoints, cp.v(0,0));
                polygonShape.setElasticity(0.5);
                polygonShape.setFriction(0.5);

                targetSpace.addShape(polygonShape);
            }
        });


        //  var bodies = root["bodies"];

        // cc.log("======"+bodies.length+"=====");

        //  var s = new cp.PolyShape (targetBody,)
    },

    updateTime:function () {

        //-- _startTime;

        //this._startTimeLabel.setString(cc.string(_startTime));

    },

    update:function (dt) {

        ///var timeStep = 0.03;
        //this._space.step(timeStep);
        //this._space.reindexStatic();
        this._palette.update();
        //_role.y -= 10;
        //g_roleInstance.update();

    }

});

GameLayer.scene = function () {
    var scene = new cc.Scene();
    var backgroundLayer = new BackgroundLayer();
    var gameLayer = new GameLayer();
    var fogLayer = new FogLayer();
    var touchLayer = new TouchLayer();
    scene.addChild(backgroundLayer);
    scene.addChild(gameLayer);
    scene.addChild(fogLayer);
    scene.addChild(touchLayer);
    return scene;
};