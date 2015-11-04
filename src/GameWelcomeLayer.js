// 游戏欢迎视图
var GameWelcomeLayer = cc.Layer.extend({
    
    // 实现欢迎视图的初始化方法
    init:function () {

        // 调用父类的初始化方法(每个继承自Layer的子类都要调用该方法)
        this._super();

        // 获取窗体大小，以便控件布局
        var size = cc.director.getWinSize();
        
        // 添加背景图片
        var spriteBg = cc.Sprite.create(s_HelloWorld);		// s_HelloWorld在resource.js中定义
        spriteBg.setAnchorPoint(0.5, 0.5);
        spriteBg.setPosition(size.width / 2, size.height / 2);
        spriteBg.setScale(size.height/spriteBg.getContentSize().height);	// 缩放比率以当前窗体高度为准，两边可能会有空边
        this.addChild(spriteBg, 0);
        
        // 添加游戏名称
        var labelGameTitle = cc.LabelTTF.create("水果特攻队", "Impact", 38);
        labelGameTitle.setPosition(size.width / 2, size.height / 3 * 2 + 40);
        labelGameTitle.setColor(cc.color(13, 66, 197));
        this.addChild(labelGameTitle, 5);
        
        // 添加LOGO图片
        var logoSprite = cc.Sprite.create("res/logo.png");
        logoSprite.setPosition(size.width / 2, size.height / 3 * 2 - 40);
        this.addChild(logoSprite, 5);

		// 添加开始菜单按钮
        var itemStartGame = cc.MenuItemImage.create("res/btn/btnStartGameNor.png", "res/btn/btnStartGameDown.png", this.menuCallBack, this);
        itemStartGame.setPosition(size.width / 2, size.height / 3);
        var menu = cc.Menu.create(itemStartGame);
        menu.setPosition(0, 0);		// 这里设置位置貌似没什么用处
        this.addChild(menu);
    },
    
    // 实现菜单的回调方法
    menuCallBack:function(sender){
    	// 播放单击按钮的音效
        cc.audioEngine.playEffect(EFFECT_BUTTON_CHICK);
        
        // 设置游戏模式
        //gGameMode = eGameMode.Challenge;
        gGameMode = eGameMode.Timer;
        
        // 创建游戏主界面对象
        var nextLayer = new GamePatternMatrix;
        nextLayer.init();
        var nextScene = cc.Scene.create();
        nextScene.addChild(nextLayer);
        
        // 切换到游戏主视图界面
        //cc.director.replaceScene(cc.TransitionSlideInT.create(0.4, nextScene));	// 在cocos2dx js 3.0中没有找到这个方法
        cc.director.runScene(new cc.TransitionSlideInT(0.5, nextScene));	// 从上到下切换场景
    }
});

var GameWelcomeScene = cc.Scene.extend({
    onEnter:function () {
    	// 调用父类的初始化方法
        this._super();
        
        // 初始化成绩数据管理对象
        gScoreData.initData();

        // 加载plist的图片资源
        cc.spriteFrameCache.addSpriteFrames(res.baseResource_plist);
        
        // 创建游戏欢迎视图对象
        var layer = new GameWelcomeLayer();
        this.addChild(layer);
        layer.init();
        
        // 设置声音参数
        cc.audioEngine.setMusicVolume(1.0);
        cc.audioEngine.setEffectsVolume(1.0);
        if(0){
        	// 播放背景音乐(有点吵，所以给屏蔽掉了)
	        cc.audioEngine.playMusic(MUSIC_BACKGROUND, true);
        }
    }
});
