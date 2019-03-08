;
(function(undefined) {
  var _global,
    GET_IP_URL = 'http://pv.sohu.com/cityjson?ie=utf-8',
    GAODE_MAP_URL = 'http://restapi.amap.com/v3/ip',
    GAODE_MAP_KEY = '';
  // 对象合并
  function extend(o, n, override) {
    for (var key in n) {
      if (n.hasOwnProperty(key) && (!o.hasOwnProperty(key) || override)) {
        o[key] = n[key];
      }
    }
    return o;
  };

  /*
   * getGps 方法获取用户的GPS信息（需要回调函数）
   * getIp 方法获取用户的IP信息 （需要回调函数）
   * getLocationByIp 方法通过IP获取用户的大概位置 （需要回调函数）
   * 其他默认全部在DevicesInfo 初始化的时候放在了infos里面
  */

  // 获取devices信息
  function DevicesInfo(opt) {
    this.opt = opt;
    this._init(opt);
  };

  /*
    * infos 字段中包括
    * os 为操作系统
    * netWork 网络连接情况
    * userAgent 客户端基本属性
    * appVersion 浏览器版本号
    * screenHeight 屏幕高度
    * screenWidth 屏幕宽度
    * language 当前使用语言
    * orientation 横竖屏
  */
  DevicesInfo.prototype = {
    constuctor: this,
    _init: function(opt) {
      var def = {
        mapKey: GAODE_MAP_KEY
      };
      this.def = extend(def, opt, true);
      this.infos = {
        os: this.getSystemInfo(),
        netWork: this.getNetWork(),
        userAgent: navigator.userAgent,
        appVersion: navigator.appVersion,
        screenHeight: window.screen.height,
        screenWidth: window.screen.width,
        language: navigator.language,
        orientation: this.getOrientationStatu()
      }
    },
    /*
      获取用户GPS
    */
    getGps: function(cb) {
      var _this = this;
      if (navigator.geolocation) {
        console.log('GPS：获取定位');
        navigator.geolocation.getCurrentPosition(function(position) {
          console.log('GPS_position： ', position);
          // _this.infos = extend(_this.infos, position, true);
          cb && cb(position);
        }, function(error) {
          console.log('GPS: 获取失败!');
          cb && cb(error);
        });
      } else {
        cb && cb({code:  2, message: 'GPS is not allowed!'});
        console.log('GPS: GPS不可用！')
      };
    },
    /*
      获取用户联网后的IP地址（包括IP地址，所在城市）
    */
    getIp: function(cb) {
      if (document.getElementById('getIdElement'))
        return;
      var body = document.body;
      var script = document.createElement('script');
      script.id = 'getIdElement';
      script.type = 'text/javascript';
      script.async = 'async';
      script.src = GET_IP_URL;
      script.charset = 'gb2312';
      body.appendChild(script);

      var reg = /^(complete|loaded)$/;
      var _this = this;
      var returnInfoFn = function(data) {
        // _this.infos = extend(_this.infos, data, true);
        if (cb)
          cb(data);
        };
      if (script.readyState) {
        script.onreadystatechange = function() {
          if (reg.test(script.readyState)) {
            script.onreadystatechange = null;
            returnInfoFn({ip: returnCitySN["cip"], ip_adress: returnCitySN["cname"]});
          }
        };
      } else {
        script.onload = function() {
          returnInfoFn({ip: returnCitySN["cip"], ip_adress: returnCitySN["cname"]});
        }
      }
    },
    /*
      通过IP获取用户大概位置
    */
    getLocationByIp: function(cb) {
      var _this = this;
      fetch(GAODE_MAP_URL + '?' + 'key=' + _this.def.mapKey, {
        headers: {
          'content-type': 'application/json'
        }
      }).then(function(res) {
        return res.json()
      }).then(function(data) {
        if (data.info === 'OK') {
          _this.infos = extend(_this.infos, {
            getLocationByIp: data
          }, true)
        }
        cb && cb(data);
      }).catch(function(err) {
        console.error(err);
      })
    },
    getSystemInfo: function() {
      var OS = '';
      var OSArray = {};
      var UserAgent = navigator.userAgent.toLowerCase();
      OSArray.Windows = (navigator.platform == 'Win32') || (navigator.platform == 'Windows');
      OSArray.Mac = (navigator.platform == 'Mac68K') || (navigator.platform == 'MacPPC') || (navigator.platform == 'Macintosh') || (navigator.platform == 'MacIntel');
      OSArray.iphone = UserAgent.indexOf('iPhone') > -1;
      OSArray.ipod = UserAgent.indexOf('iPod') > -1;
      OSArray.ipad = UserAgent.indexOf('iPad') > -1;
      OSArray.Android = UserAgent.indexOf('Android') > -1;
      for (var i in OSArray) {
        if (OSArray[i]) {
          OS = i;
        }
      }
      return OS;
    },
    getNetWork: function() {
      var netWork;
      switch (navigator.connection.effectiveType) {
        case 'wifi':
          netWork = "wifi"; // wifi
          break;
        case '4g':
          netWork = "4G"; // 4g
          break;
        case '2g':
          netWork = "2G"; // 2g
          break;
        case '3g':
          netWork = "3G"; // 3g
          break;
        case 'ethernet':
          netWork = "以太网"; // ethernet
          break;
        case 'default':
          netWork = "未知"; // 未知
          break;
      }
      return netWork;
    },
    getOrientationStatu: function() {
      var orientationStatu;
      if (window.screen.orientation.angle == 180 || window.screen.orientation.angle == 0) { // 竖屏
        orientationStatu = "竖屏";
      }
      if (window.screen.orientation.angle == 90 || window.screen.orientation.angle == -90) { // 横屏
        orientationStatu = "横屏";
      }
      return orientationStatu;
    }
  }
  // 插件暴露
  _global = (function() {
    return this || (0, eval)('this')
  }());

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = DevicesInfo;
  } else if (typeof define === 'function' && define.amd) {
    define(function() {
      return DevicesInfo
    });
  } else {
    !('DevicesInfo' in _global) && (_global.DevicesInfo = DevicesInfo);
  }
}())
