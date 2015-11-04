/**
 * Created by Cherish on 2015/11/3.
 */

var TouchLayer = cc.Layer.extend({
    //sprite:null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();
        this.init();

        //return true;
    },

    init:function () {

        if( 'touches' in cc.sys.capabilities ) {
            cc.eventManager.addListener(cc.EventListener.create({
                event: cc.EventListener.TOUCH_ALL_AT_ONCE,
                onTouchesEnded:function (touches, event) {
                    if (touches.length <= 0)
                        return;
                    //event.getCurrentTarget().moveSprite(touches[0].getLocation());
                    event.getCurrentTarget().onTouch(touches[0]);
                }
            }), this);
        }

        else if ('mouse' in cc.sys.capabilities ) {
            cc.eventManager.addListener({
                event: cc.EventListener.MOUSE,
                onMouseUp: function (event) {
                    //event.getCurrentTarget().moveSprite(event.getLocation());
                    event.getCurrentTarget().onTouch(event);
                }
            }, this);
        }

        return true;


    },

    onTouch:function (event) {

        cc.log( "touch" );

    }


});