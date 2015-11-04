cc.game.onStart = function(){
    var designSize = cc.size(480, 800);			// 设定一个默认大小，用于判断是否是高清屏幕
    var screenSize = cc.view.getFrameSize();	// 获取浏览器窗口大小
	
	// 设置图片资源目录
    if(!cc.sys.isNative && screenSize.height < 800){
    	// 如果不是原生设备并且浏览器窗口高度小于设定值，则使用标准大小资源图片
        designSize = cc.size(320, 480);
        cc.loader.resPath = "res/Normal";
    }else{
    	// 原生设备，或浏览器窗口大于设定值，则使用高清资源图片
        cc.loader.resPath = "res/HD";
    }
    // 设置游戏视图按指定大小满屏显示
    cc.view.setDesignResolutionSize(designSize.width, designSize.height, cc.ResolutionPolicy.SHOW_ALL);

    // 使用自定义的loading类
    GameLoadingLayer.preload(g_resources, function () {
    	// loading完毕后，显示游戏欢迎界面
        cc.director.runScene(new GameWelcomeScene());
    }, this);
};
cc.game.run();