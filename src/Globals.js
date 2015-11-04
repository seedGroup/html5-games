/**
 * Created by Caoyp on 2015/11/2.
 */

var g_roleInstance;

var g_roleInitialSpeed = -20;
var g_roleInitialAcceleratedSpeed = 80;

var g_viewWidth;
var g_viewHeight;

var g_gameState = {
    ready:1,
    playing:2,
    over:3
};

var g_drawSegmentWidth = 10;
var g_segmentSpeed = 2;

var g_gameScale = 0.7;
