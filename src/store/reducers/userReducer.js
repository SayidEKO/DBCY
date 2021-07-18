// 初始token为空
let defaultState = {
  //用户编码
  // user_code: 'zhangsan',
  user_code: '',
  cuserid: '',
  user_name: '',
  token: '',
  pk_group: '0001M1100000000008K4',
  pk_org: '0001M1100000000022E7'
}

export const UserReducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'SET_USER_USERCODE':
      return { ...state, user_code: action.msg }
    case 'SET_USER_TOKEN':
      return { ...state, token: action.msg }
    case 'SET_USER_CUSERID':
      return { ...state, cuserid: action.msg }
    case 'SET_USER_USERNAME':
      return { ...state, user_name: action.msg }
    default:
      return { ...state }
  }
}