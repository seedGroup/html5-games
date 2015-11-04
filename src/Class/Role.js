/**
 * Created by Caoyp on 2015/11/2.
 */

function Role(animation, speed, acceleratedSpeed, state){

    this._animation = animation;
    this._speed = speed;
    this._acceleratedSpeed = acceleratedSpeed;
    this._state = state;

    this.init();

}

Role.prototype.getAnimation = function () {
    return this._animation;
}

Role.prototype.init = function () {

}

Role.prototype.update = function () {

    //this._animation.y += this._speed;
    //cc.log( this._animation.y );

}
