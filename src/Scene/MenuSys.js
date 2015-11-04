/**
 * Created by Caoyp on 2015/11/2.
 */

var SysMenu = cc.LayerGradient.extend({
    //_ship:null,

    ctor:function () {
        this._super(cc.color(0,0,0,255), cc.color(0x46,0x82,0xB4,255));
        this.init();
    },

    roleAnimationLoaded:function (percent) {
        //load resources
        //if (percent >= 1) {
        //    this.init();
        //}

    },

    init:function () {
        //cc.spriteFrameCache.addSpriteFrames(res.flappy_packer_plist);
        //cc.spriteFrameCache.addSpriteFrames("CloseNormal.png");

        winSize = cc.director.getWinSize();

        //var star = cc.Sprite.create(cc.spriteFrameCache.getSpriteFrame("CloseNormal.png"));

        var playNormal = cc.Sprite.create("res/CloseNormal.png");
        var playTouch = cc.Sprite.create("res/CloseSelected.png");
        var playInvalid = cc.Sprite.create("res/CloseNormal.png");

        /*var newGame = new cc.MenuItemSprite(star, star1, star2, function () {
            this.onStar();
        }.bind(this));*/

        var newGame = new cc.MenuItemSprite(playNormal, playTouch, playInvalid, this.onPlay);

        var menu = new cc.Menu(newGame);
        menu.alignItemsVerticallyWithPadding(10);
        this.addChild(menu, 1, 2);
        menu.x = winSize.width / 2;
        menu.y = winSize.height / 2 - 80;
        this.schedule(this.update, 0.1);

        //ccs.load(g_role_animation_json);
        //ccs.armatureDataManager.addArmatureFileInfoAsync(g_role_animation_json);
        ccs.armatureDataManager.addArmatureFileInfo(g_role_animation_json);
        //ccs.Armature.create;
        var roleSprite = ccs.Armature.create("feizhu");
        roleSprite.getAnimation().playWithIndex(0);
        g_roleInstance = new Role(roleSprite, g_roleInitialSpeed, 0, g_gameState.ready);

        return true;
    },

    onPlay:function (pSender) {
        //load resources
        cc.LoaderScene.preload(g_game_resources, function () {
            var scene = GameLayer.scene();
            cc.director.runScene(new cc.TransitionFade(1.2, scene));
        }, this);

    },

    update:function () {

    }

});

SysMenu.scene = function () {
    var scene = new cc.Scene();
    var sysMenuLayer = new SysMenu();
    scene.addChild(sysMenuLayer);
    return scene;
};