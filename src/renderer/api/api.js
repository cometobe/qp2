import axios from 'axios';

axios.defaults.timeout = 100000;
// axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
axios.defaults.baseURL = 'http://127.0.0.1:5000/api';

//返回状态判断
axios.interceptors.response.use((res) => {
  if (res.status != 200) {
    // _.toast(res.data.msg);
    return Promise.reject(res);
  }
  return res;
}, (error) => {
  // _.toast("网络异常", 'fail');
  console.log(error);
  return Promise.reject(error);
});

export function get (url, params) {
  console.log("get api地址",url,params)
  return new Promise((resolve, reject) => {
    axios.get(url, {params: params})
      .then(response => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function post(url, params) {
  // console.log('传输前1', params)
  return new Promise((resolve, reject) => {
    axios.post(url, params)
      .then(response => {
        resolve(response.data);
        // console.log('传输前2', params)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function del(url) {
  return new Promise((resolve, reject) => {
    console.log("删除api地址",url)
    axios.get(url)
      .then(response => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error)
      })
  })
}