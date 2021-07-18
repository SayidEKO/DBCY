import axios from 'axios' // 引入axios
import { Toast } from 'antd-mobile';

// 环境的切换
// if (process.env.NODE_ENV === 'development') {
//   axios.defaults.baseURL = 'http://xj.vaiwan.com'
// }
// else if (process.env.NODE_ENV === 'debug') {
//   axios.defaults.baseURL = 'http://xj.vaiwan.com'
// }
// else if (process.env.NODE_ENV === 'production') {
//   axios.defaults.baseURL = 'http://xj.vaiwan.com'
// }

Toast.config({duration:1, mask: false})

//通过axios.defaults.timeout设置默认的请求超时时间。例如超过了30s，就会告知用户当前请求超时，请刷新等。
axios.defaults.timeout = 30000;
//post请求的时候，我们需要加上一个请求头，所以可以在这里进行一个默认的设置，即设置post的请求头为application/x-www-form-urlencoded;charset=UTF-8
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

/**
 * http request 拦截器
 */
axios.interceptors.request.use(config => {
  //文件上传接口不做处理
  if (config.url.indexOf('ncBaseDataSynServlet') !== -1) {
    config.data = JSON.stringify(config.data);
    // config.data = qs.stringify(config.data);
    config.headers = { "Content-Type": "application/json" };
  }
  return config;
}, error => {
  return Promise.reject(error);
});

/**
 * http response 拦截器
 */
axios.interceptors.response.use(response => {
  Toast.hide()
  if (response !== undefined) {
    if (response.data.STATUS === 'ERROR') {
      Toast.fail(response.data.MESSAGE, 1)
      return
    }
  }
  return response;
}, error => {
  Toast.hide()
  message(error)
});

//统一接口处理，返回数据
export function http(fecth, url, param) {
  Toast.loading('加载中...', 0, null, true)
  return new Promise((resolve, reject) => {
    switch (fecth) {
      case "get":
        get(url, param).then(response => resolve(response)).catch(error => reject(error));
        break;
      case "post":
        post(url, param).then(response => resolve(response)).catch(error => reject(error));
        break;
      default:
        break;
    }
  });
}

/**
 * 封装get方法
 * @param url  请求url
 * @param params  请求参数
 * @returns {Promise}
 */
export function get(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.get(url, { params: params }).then(response =>
      resolve(response.data)
    ).catch(error => {
      message(error)
      reject(error);
    });
  });
}


/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post(url, data) {
  return new Promise((resolve, reject) => {
    axios.post(url, data).then(response => {
      if (response !== undefined) {
        resolve(response.data);
      }
    }, error => {
      message(error)
      reject(error);
    });
  });
}

//失败提示
function message(error) {
  if (error && error.response) {
    switch (error.response.status) {
      case 400:
        Toast.fail(error.response.data.error.details);
        break;
      case 401:
        Toast.fail("未授权，请登录");
        break;

      case 403:
        Toast.fail("拒绝访问");
        break;

      case 404:
        Toast.fail("请求地址出错");
        break;

      case 408:
        Toast.fail("请求超时");
        break;

      case 500:
        Toast.fail("服务器内部错误");
        break;

      case 501:
        Toast.fail("服务未实现");
        break;

      case 502:
        Toast.fail("网关错误");
        break;

      case 503:
        Toast.fail("服务不可用");
        break;

      case 504:
        Toast.fail("网关超时");
        break;

      case 505:
        Toast.fail("HTTP版本不受支持");
        break;
      default:
    }
  }
}