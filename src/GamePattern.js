// 自定义事件通知的标识
var MSG_CHECK_PATTERN = "MSG_CHECK_PATTERN";
var MSG_SWAP_PATTERN = "MSG_SWAP_PATTERN";

// 两个水果交换的方向
var eSwapDirection = {"Up":0,"Down":1,"Left":2,"Right":3};

// 水果精灵的扩展属性：普通、炸弹、冰冻、石头
var ePatternExtraAttr = {"Normal":0,"Bomb":1,"Freeze":2,"Stone":3};

// 水果的状态：普通、移动、销毁、爆炸
var ePatternStatus = {"Normal":0,"Move":1,"Destroy":2,"Explode":3};

// 水果精灵类
var GamePatternSprite = cc.Sprite.extend({
    m_ePatternType:-1,	// 水果类型，本例中有7个类型
    m_eExtraAttr:ePatternExtraAttr.Normal,	// 扩展属性：0普通、1炸弹、2冰冻、3石头
    m_eSwapDirection:eSwapDirection.Up,		// 交换的方向
    m_nRowIndex:0,		// 水果所在的行索引
    m_nColIndex:0,		// 水果所在的列索引
    m_extraTypeSpr:null,	// 显示扩展类型的精灵，如：炸弹、冰冻、石头
    m_checkSpr:null,		// 没用到
    m_bSwapEnable:true,		// 是否允许主动交换(只有Normal类型的才允许主动交换，其余的只能被动交换)
    
    // 在外部引用的属性
    g_pSwapPattern:null,	// 用于交换两个位置的水果
    g_nRemoveBatchIndex:0,	// 批量消除的索引值
    g_nMoveBatchIndex:0,	// 批量移动的索引值
    g_bIsRecover:false,		// 标记是否为准备交换状态
    g_ePatternStatus:ePatternStatus.Normal,		// 标记水果状态
	
	// 实现初始化方法，由调用者来决定类型及扩展属性值
    init:function (type, extraAttr) {
    
    	// 照例，要调用父类的方法
        this._super();
        
        //console.info("IN GamePattern::init...type=" + type + ", extraAttr=" + extraAttr + "\n");
        
        // 设置扩展属性值：0普通、1炸弹、2冰冻、3石头
        this.m_eExtraAttr = extraAttr;
        if(extraAttr == ePatternExtraAttr.Stone)
            this.m_ePatternType = -1;
        else
            this.m_ePatternType = type;
        
        // 设置水果类型，共7种类型的水果
        if (this.m_ePatternType == -1 || extraAttr == ePatternExtraAttr.Freeze)
            this.m_bSwapEnable = false;		// 如果水果类型无效，或扩展属性为冰冻，则不允许主动交换
        else
            this.m_bSwapEnable = true;

        switch (this.m_eExtraAttr)
        {
        	// 如果是炸弹或冰冻，则扩展类型精灵是显示在水果纸上的
            case ePatternExtraAttr.Bomb:
            {
                this.m_extraTypeSpr = cc.Sprite.createWithSpriteFrameName("#pattern_mark_explode.png");
                break;
            }
            case ePatternExtraAttr.Freeze:
            {
                this.m_extraTypeSpr = cc.Sprite.createWithSpriteFrameName("#pattern_mark_freeze.png");
                break;
            }
            default:
                break;
        }

        if (this.m_eExtraAttr == ePatternExtraAttr.Stone){
        	// 如果扩展类型为石头，则不显示石头图片了，直接显示石头图片
            this.initWithSpriteFrameName("pattern_mark_petrifaction.png");
        }else  {
        	// 显示水果图片
            var str = "cocos"+("00"+ type).slice(-2)+".png";
            this.initWithSpriteFrameName(str);
        }

		// 如果扩展类型精灵不为null，则将其添加进来
        if (this.m_extraTypeSpr != null){
            var size = this.getContentSize();
            this.m_extraTypeSpr.setPosition(size.width/2,size.height/2);
            this.addChild(this.m_extraTypeSpr);
        }
        
        //console.info("IN GamePattern::init::m_ePatternType=" + this.m_ePatternType + ", m_eExtraAttr=" + this.m_eExtraAttr + ", m_bSwapEnable=" + this.m_bSwapEnable + "\n");
        
        // 设置触摸的侦听事件，以便让水果精灵响应触摸操作
        var touchListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,	// 单次点击
            swallowTouches: true,
            
            // 分别调用自定义方法
            onTouchBegan: function (touch, event) {
            	var target = event.getCurrentTarget();
		        return target.onPatternTouchBegan(touch, event);
            },
            onTouchMoved: function (touch, event) {
            	var target = event.getCurrentTarget();
            	target.onPatternTouchMoved(touch, event);
            },
            onTouchEnded: function (touch, event) {
            	var target = event.getCurrentTarget();
            	target.onPatternTouchEnded(touch, event);
            }
        });
        
		// 添加到事件管理器中去
        cc.eventManager.addListener(touchListener, this);
        
    },
    
    // 显示销毁水果精灵的动画效果及音效
    destroyPattern:function(frams){
    	// 先标记为销毁状态
        this.g_ePatternStatus = ePatternStatus.Destroy;

		// 显示一个销毁效果的图片精灵
        var effectSprite = cc.Sprite.createWithSpriteFrameName("#pattern_destroy_00.png");
        effectSprite.setPosition(22.5,22.5);
        this.addChild(effectSprite);
        
        // 创建一个销毁动画，frams为销毁动画的图片数组
        var animation = cc.Animation.create(frams, 0.025);
        effectSprite.runAction(cc.Animate.create(animation));
		
		// 显示渐隐效果
        this.runAction(cc.FadeOut.create(0.5));
        
        // 播放清除音效
        cc.audioEngine.playEffect(EFFECT_PATTERN_CLEAR);
    },
    
    // 显示爆炸水果精灵的动画效果及音效
    explodePattern:function(frams){
    	// 先标记为爆炸状态
        this.g_ePatternStatus = ePatternStatus.Explode;
        
        // 显示一个爆炸效果的图片精灵
        var effectSprite = cc.Sprite.createWithSpriteFrameName("#pattern_explode_00.png");
        effectSprite.setPosition(22.5,22.5);
        this.addChild(effectSprite);
        
        // 创建一个销毁动画，frams为爆炸动画的图片数组
        var animation = cc.Animation.create(frams,0.025);
        effectSprite.runAction(cc.Animate.create(animation));
		
		// 显示渐隐效果
        this.runAction(cc.FadeOut.create(0.5));
        
        // 播放爆炸音效
        cc.audioEngine.playEffect(EFFECT_PATTERN_BOMB);
    },
    
    // 移除冰冻属性，变为普通属性
    removeFreeze:function(){
        if (this.m_eExtraAttr == ePatternExtraAttr.Freeze)
        {
        	// 设置为普通属性，允许主动交换，去掉扩展属性精灵
            this.m_eExtraAttr = ePatternExtraAttr.Normal;
            this.m_bSwapEnable = true;
            this.removeChild(this.m_extraTypeSpr,true);
            this.m_extraTypeSpr = null;
        }
    } ,
    
    // 移动水果精灵位置
    moveTo:function( duration, position){
    	//console.info("IN GamePattern::moveTo...\n");
        if (this.g_ePatternStatus == ePatternStatus.Normal)
        {
        	//console.info("IN GamePattern::moveTo::this.g_ePatternStatus == ePatternStatus.Normal\n");
            this.g_ePatternStatus = ePatternStatus.Move;
            //var action = cc.Sequence.create(cc.MoveTo.create(duration,position),cc.CallFunc.create(this.onMoveEnd.bind(this),this));	// 2x的调用方式，也可用，但以后可能会被弃用
            var action = cc.sequence(cc.moveTo(duration,position),cc.callFunc(this.onMoveEnd.bind(this),this));
            this.runAction(action);
        }else{
	        //console.info("IN GamePattern::moveTo:: != ePatternStatus.Normal\n");
        }
    },
    
    // 交换水果的位置，执行的也是移动操作
    swapTo:function(duration, position){
    	//console.info("IN GamePattern::swapTo...\n");
        if (this.g_ePatternStatus === ePatternStatus.Normal)
        {
        	//console.info("IN GamePattern::swapTo::this.g_ePatternStatus == ePatternStatus.Normal\n");
            this.g_ePatternStatus = ePatternStatus.Move;
            //this.runAction(cc.MoveTo.create(duration,cc.p(position.x,position.y)));	// 2x的调用方式
            this.runAction(cc.moveTo(duration,cc.p(position.x,position.y)));
        }else{
	        //console.info("IN GamePattern::swapTo:: != ePatternStatus.Normal\n");
        }
    },
    
    // 处理水果精灵的点击、拖拽事件
    onPatternTouchBegan: function (touch, event) {
    	//console.info("IN GamePattern::onTouchBegan::m_nRowIndex=%d, m_nColIndex=%d\n", this.m_nRowIndex, this.m_nColIndex);
    	
    	var target = event.getCurrentTarget();
        var locationInNode = target.convertToNodeSpace(touch.getLocation());
        var s = target.getContentSize();
        var rect = cc.rect(0, 0, s.width, s.height);
        
        if (this.m_bSwapEnable && this.g_ePatternStatus==ePatternStatus.Normal && cc.rectContainsPoint(rect, locationInNode)){
        	// 如果当前水果精灵允许交换，并且为普通状态（不是销毁、爆炸等状态），并且点击范围在这个水果精灵范围内
            if (this.m_eExtraAttr == ePatternExtraAttr.Normal || this.m_eExtraAttr == ePatternExtraAttr.Bomb)
            {
            	// 如果扩展属性为普通的或炸弹的（冰冻和石头不允许点击及移动）
            	//console.info("IN GamePattern::onPatternTouchBegan::send an event:MSG_CHECK_PATTERN\n");
            	
                this.m_bHandleTouch = true;
                //gNotification.postNotification(MSG_CHECK_PATTERN,this);
                var event = new cc.EventCustom(MSG_CHECK_PATTERN);
	            event.setUserData(this);
	            cc.eventManager.dispatchEvent(event);

                return true;
            }else{
	            //console.info("IN GamePattern::onPatternTouchBegan::return false_02\n");
            }
        }else{
	        //console.info("IN GamePattern::onPatternTouchBegan::return false_01, m_bSwapEnable=" + this.m_bSwapEnable + ", g_ePatternStatus=" + this.g_ePatternStatus + ", ePatternStatus.Normal=" + ePatternStatus.Normal + "\n");
        }
        
        return false;
    },
    onPatternTouchMoved: function (touch, event) {
    	//console.info("IN GamePattern::onPatternTouchMoved\n");
        if (this.m_bHandleTouch && this.g_ePatternStatus === ePatternStatus.Normal){
        	// 如果指定了按下操作，并且水果状态为普通状态（“===”操作符用于保证类型匹配等），则判断拖拽状态
        	
        	// 获取当前点击位置及上次位置，用于判断拖拽方向
            var getPoint = touch.getLocation();
            var lx = getPoint.x -  this.getPositionX();
            var ly = getPoint.y -  this.getPositionY();
            if (lx > 45){
            	// 向右
                this.m_bHandleTouch = false;
                if (ly > lx)
                    this.m_eSwapDirection = eSwapDirection.Up;			// 向上
                else if (ly + lx < 0)
                    this.m_eSwapDirection = eSwapDirection.Down;		// 向下
                else
                    this.m_eSwapDirection = eSwapDirection.Right;		// 向右
                    
                // 通知调用者交换水果位置。v2x使用“gNotification.postNotification(MSG_SWAP_PATTERN,this);”，v3x使用事件管理器来管理
                var event = new cc.EventCustom(MSG_SWAP_PATTERN);
	            event.setUserData(this);
	            cc.eventManager.dispatchEvent(event);
	            
            }else if (lx < -45){
            	// 向左
                this.m_bHandleTouch = false;
                if (ly < lx)
                    this.m_eSwapDirection = eSwapDirection.Down;		// 向下
                else if(ly + lx > 0)
                    this.m_eSwapDirection = eSwapDirection.Up;			// 向上
                else
                    this.m_eSwapDirection = eSwapDirection.Left;		// 向左
                
                var event = new cc.EventCustom(MSG_SWAP_PATTERN);
	            event.setUserData(this);
	            cc.eventManager.dispatchEvent(event);
	            
            }else if (ly > 45){
            	// 向上
                this.m_bHandleTouch = false;
                this.m_eSwapDirection = eSwapDirection.Up;
                
                var event = new cc.EventCustom(MSG_SWAP_PATTERN);
	            event.setUserData(this);
	            cc.eventManager.dispatchEvent(event);
	            
            }else if (ly < -45){
            	// 向下
                this.m_bHandleTouch = false;
                this.m_eSwapDirection = eSwapDirection.Down;
                
                var event = new cc.EventCustom(MSG_SWAP_PATTERN);
	            event.setUserData(this);
	            cc.eventManager.dispatchEvent(event);
            }
        }
    },
    onPatternTouchEnded: function (touch, event) {
    	//console.info("IN GamePattern::onPatternTouchEnded\n");
    },
    
    // 水果移动动画结束的回调操作
    onMoveEnd:function(){
        this.g_ePatternStatus = ePatternStatus.Normal;
    },
    
    // 判断点击范围，已弃用，使用触摸事件管理器的方法“cc.rectContainsPoint(...)”来判断了
    containsTouchLocation:function (touch) {
        var getPoint = touch.getLocation();

        var lx = 0 | (getPoint.x -  this.getPosition().x);//this.getPositionX();
        var ly = 0 | (getPoint.y -  this.getPosition().y);//this.getPositionY();
        if(lx>-22.5 && lx<22.5 && ly>-22.5 && ly<22.5)
            return true;
        return false;
    },
    
    onEnter:function () {
       /*
       // 响应点击操作，v3x中不用了
       if(cc.sys.platform == "browser")
            cc.sys.registerTargetedDelegate(1, true, this);
        else
            cc.sys.registerTargettedDelegate(1,true,this);*/
        this._super();
    },
    onExit:function () {
        //cc.sys.unregisterTouchDelegate(this);		// 响应点击操作，v3x中不用了
        this._super();
    }
});
