import axios from 'axios';
import { http } from './http'
import store, { addTodo } from '../store/store';

//企业id
const CorpID = 'ww13638b88f8e0e007'
//东本储运
// const DBCYId = "1000004"
const DBCYSecret = "dm249crh0P60rh757WIilJocgMEGuUPauN-cEmi1sO8"

// 获取access_token
export const getAccess_TokenUrl = () => axios.get('/cgi-bin/gettoken?corpid=' + CorpID + '&corpsecret=' + DBCYSecret)

//----------获取token
const getToken = () => {
  let params = {}
  params.SID = Math.floor(Math.random()*(100));
  params.KEY = 'wdhl'
  params.TYPE = 2
  params.SRCSYS = '企业微信'
  params.VERIFY = 'token'
  params.DATA = [{ user_code: store.getState().userModule.user_code }]
  return http('post', '/service/ncBaseDataSynServlet', params)
}

export const ncBaseDataSynServlet = async (type, data, billtype) => {
  let params = {}
  params.SID = Math.floor(Math.random()*(100));
  params.KEY = 'wdhl'
  params.TYPE = type
  params.billtype = billtype
  params.SRCSYS = '企业微信'
  params.DATA = data
  //每次请求前先获取token
  const result = await getToken();
  params.VERIFY = result.TonKen;
  //如果没有用户信息则保存下来
  if (store.getState().userModule.cuserid === '') {
    store.dispatch(addTodo('SET_USER_CODE', result.VALUES[0].user_code))
    store.dispatch(addTodo('SET_USER_CUSERID', result.VALUES[0].cuserid))
    store.dispatch(addTodo('SET_USER_USERNAME', result.VALUES[0].user_name))
  }
  console.log(params);
  return await http('post', '/service/ncBaseDataSynServlet', params); 
}

//上传文件
export const uploadFile = async (file, pk = '1001ZZ10000000009EQY') => {
  const formData = new FormData();
  formData.append('TYPE', 11)
  formData.append('KEY', 'wdhl')
  formData.append('SID', Math.floor(Math.random()*(100)))
  formData.append('billtype', 'ZPXQ')
  formData.append('SRCSYS', '企业微信')
  formData.append('pk',pk)
  formData.append('file', file)
  return await http('post', '/service/fileDataUpLoadServlet', formData)
}