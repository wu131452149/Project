import Cache from "./Cache.js"

/**
 * Http请求工具包
 *
 * @version 2.0
 * @author 杨伟立
 */
export default {
  /**
   * 默认服务器端请求地址
   */
  defaultUrl: './action',
  isSessionTimeout: false,
  /**
   * 向服务端发送命令请求
   * 发送时使用ajax的方式避免跨域
   *
   * @param sendUrl 服务器端地址
   * @param command 提交的数据
   * @param callback 请求成功后的回调
   * @param errorCallback 请求失败后的回调
   * @param async 使用异步请求还是同步请求
   * @param timeout 超时时间
   * @param method 请求的方式，一般要么是GET，要么是POST
   * @author 杨伟立
   * @version 2.0
   */
  sendCommand: function sendCommand(sendUrl, command, callback, errorCallback, async, timeout, method) {
    var self = this;
    if (self.isSessionTimeout) {
      return;
    }
    sendUrl = sendUrl || self.defaultUrl;
    if ($.type(sendUrl) !== "string") {
      method = timeout;
      timeout = async;
      async = errorCallback;
      errorCallback = callback;
      callback = command;
      command = sendUrl;
      sendUrl = self.defaultUrl;
    }
    if (async !== false) {
      async = true;
    }
    var time = timeout || 20000;
    method = method || "GET";
    $.ajax({
      type: method,
      url: sendUrl,
      async: async,
      data: command,
      timeout: time,
      dataType: "jsonp",
      jsonp: "callback",
      success: function (data, status) {
        if (typeof callback == "function") {
          callback(data);
        }
        if (data && !data.Succeed && data.SessionTimeout == 1) {
          self.isSessionTimeout = true;
          $(window).off('beforeunload');
          alert("您的会话已超时，请重新登录!");
          window.location.href = "./";
          return;
        }
      },
      error: function (xhr, status, error) {
        if (errorCallback && (typeof errorCallback == "function")) {
          errorCallback(xhr, status, error);
        } else {
          if (xhr.statusText != 'success') {
            callback({success:false, code: 500});
          }
        }
      }
    });
  },
  /**
   * 向服务器端发送Action
   *
   * @param action action地址
   * @param callback 请求结束后的回调，回调时会带上请求结果数据
   * @param method 请求的方式，一般要么是GET，要么是POST
   * @param hideLoading 是否不显示“正在加载中”的蒙版
   * @param async 使用异步请求还是同步请求
   * @param timeout 超时时间
   * @param showLoading 是否显示“正在获取数据...”层
   * @author 杨伟立
   * @version 2.0
   */
  sendAction: function (action, callback, method, hideLoading, async, timeout) {
    var self = this;
    if (self.isSessionTimeout) {
      return;
    }
    if (async !== false) {
      async = true;
    }
    var loadingIndicator = $(".loading-indicator");
    if (Cache.session.id) {
      if(!hideLoading){
        loadingIndicator.css("display", "block");
      }
      action.sessionId = Cache.session.id;
      action.action_id = Math.random();
      action.data = JSON.stringify(action.data) || JSON.stringify({
        idle: ""
      });
      if (!method) {
        method = "post";
      }
      if (method && method == "post") {
        self.sendPostCommand(action, function (response) {
          loadingIndicator.css("display", "none");
          callback(response);
        }, function () {
          loadingIndicator.css("display", "none");
          callback({
            succeed: false
          });
        }, async, timeout, self.defaultUrl);
      } else {
        self.sendCommand(action, function (response) {
          loadingIndicator.css("display", "none");
          callback(response);
        }, function () {
          loadingIndicator.css("display", "none");
          callback({
            succeed: false
          });
        }, async, timeout);
      }
    } else {
      self.isSessionTimeout = true;
      $(window).off('beforeunload');
      alert("您的会话已超时，请重新登录!");
      window.location.href = "./";
    }
  },
  /**
   * 向服务端发送POST命令请求
   *
   * @param command 提交的数据
   * @param callback 请求成功后的回调
   * @param errorCallback 请求失败后的回调
   * @param async 使用异步请求还是同步请求
   * @param timeout 超时时间
   * @param url 服务器端地址
   * @author 杨伟立
   * @version 2.0
   */
  sendPostCommand: function (command, callback, errorCallback, async, timeout, url) {
    var self = this;
    if (self.isSessionTimeout) {
      return;
    }
    if (async !== false) {
      async = true;
    }
    var time = timeout || 20000;
    $.ajax({
      type: "POST",
      url: url,
      async: async,
      data: command,
      timeout: time,
      dataType: "json",
      success: function (data) {
        if (typeof callback == "function") {
          callback(data);
        }
        if (data && !data.Succeed && data.SessionTimeout == 1) {
          self.isSessionTimeout = true;
          $(window).off('beforeunload');
          alert("您的会话已超时，请重新登录!");
          window.location.href = "./";
          return;
        }
      },
      error: function (xhr, status, error) {
        if (errorCallback && (typeof errorCallback == "function")) {
          errorCallback(xhr, status, error);
        } else {
          if (xhr.statusText != 'success') {
            callback({success:false, code: 500});
          }
        }
      }
    });
  },

  /**
   * 建立Promise请求
   *
   * @param action 提交的数据
   * @param callback 请求成功后的回调
   * @param method 请求方式get/post
   * @param hideLoading 是否显示"数据请求中"
   * @param async 使用异步请求还是同步请求
   * @param timeout 超时时间
   * @author dougj
   * @version 2.0
   */
//   sendPromiseAction: function (action, callback, method, hideLoading, async, timeout) {
//     if (async !== false) {
//       async = true;
//     }
//     if (Cache.session.id) {
//       var self = this;
//       var defaultUrl = this.defaultUrl;
//       action.sessionId = Cache.session.id;
//       action.action_id = Math.random();
//       action.data = JSON.stringify(action.data) || JSON.stringify({idle: ""});
//       method = method || "post";
//       if (method == "post") {
//         function sendPostPromiseFunction() {
//           return new Promise(function (resolve, reject) {
//             self.sendPostCommand(action, resolve,reject, async, timeout, defaultUrl);
//           });
//         }
//         sendPostPromiseFunction().then(function (response) {
//           if (callback && typeof callback === "function") {
//             callback(response);
//           }
//         }, function () {
//           callback({
//             succeed: false
//           });
//         });
//       } else {
//         function sendPromiseFunction() {
//           return new Promise(function (resolve, reject) {
//             self.sendCommand(action, resolve,reject, async, timeout);
//           });
//         }
//         sendPromiseFunction().then(function (response) {
//           if (callback && typeof callback === "function") {
//             callback(response);
//           }
//         }, function () {
//           callback({
//             succeed: false
//           });
//         });
//       }
//     } else {
//       alert("还未登陆, 不能发送请求");
//     }
//   }
};
