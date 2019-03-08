# devicesinfo
获取设备基本信息

## API

```
 // 安装
 npm i devicesinfo

```

```
/*
 * getGps 方法获取用户的GPS信息（需要回调函数）
 * getIp 方法获取用户的IP信息 （需要回调函数）
 * getLocationByIp 方法通过IP获取用户的大概位置 （需要回调函数）
 * 其他默认全部在DevicesInfo 初始化的时候放在了infos里面
*/
 var devicesInfo = new DevicesInfo({
     mapKey: '************'     // mapKey 为高德地图api的app_key,如不填则无法使用getLocationByIp 方法
   });

   /*
    * start 开始倒计时 （倒计时开始时，dom元素有disabled 属性时，会触发disabled=true）
    * stop  结束倒计时 （倒计时结束时，dom元素有disabled 属性时，会触发disabled=fales）
   */

   /*
     * infos 字段中包括
     * os 为操作系统
     * osVersion 操作系统版本
     * netWork 网络连接情况
     * userAgent 客户端基本属性
     * appVersion 浏览器版本号
     * screenHeight 屏幕高度
     * screenWidth 屏幕宽度
     * language 当前使用语言
     * orientation 横竖屏
   */
   devicesInfo.infos; // devices 的基本信息
   devicesInfo.getIp(function (ip) {console.log(ip)});
   devicesInfo.getGps(function (pos) {console.log(pos)});
   devicesInfo.getLocationByIp(function (pos) {console.log(pos)});

   ```
