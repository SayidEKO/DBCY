/**
 * 预加载
 */
import { Component } from 'react'
import { withRouter } from 'react-router-dom'

import { getWorkerBook, getUserInfo } from '../request/api';

import { isEmpty } from "../utils/utils";

import custom from "../utils/custom";
import { router2workerbook, router2work } from "../utils/routers";

import { DEBUG } from '../config';
import { Toast } from 'antd-mobile';
import store, { addTodo } from '../store/store';



class Index extends Component {

  /**
   * 检查是否是签订员工手册
   */
  checkUser(user_code, param) {
    //获取员工手册(这里需要调2次，第一创建，第二次签订)
    getWorkerBook([{ user_code }]).then(result => {
      getWorkerBook([{ user_code }]).then(result => {
        //签订地址
        let url = result.VALUES[0].url
        //表示已读未读
        let def1 = result.VALUES[0].info[0].def1
        //Def1等于N并且有url则跳转签名
        if (def1 === 'N' && url !== '' && url !== undefined) {
          localStorage.setItem('sign', false)
          router2workerbook(this, url)
        } else {
          custom(this, param)
        }
      })
    })
  }

  componentDidMount() {
    let search = this.props.location.search
    search = search.split('&')

    let code = search[0]
    let param = search[1]
    //获取code
    if (!isEmpty(code)) {
      code = code.slice(6, code.length)
    }
    //获取参数
    if (!isEmpty(param)) {
      param = param.slice(6, param.length)
    }

    if (DEBUG) {
      router2work(this)
    } else {
      getUserInfo(code).then(ressult => {
        let toke = ressult.TonKen
        let cuserid = ressult.VALUES[0].cuserid
        let user_name = ressult.VALUES[0].user_name
        let user_code = ressult.VALUES[0].user_code
        store.dispatch(addTodo('SET_USER_TOKEN', toke))
        store.dispatch(addTodo('SET_USER_CUSERID', cuserid))
        store.dispatch(addTodo('SET_USER_USERNAME', user_name))
        store.dispatch(addTodo('SET_USER_USERCODE', user_code))
        this.checkUser(user_code, param)
      })
    }
  }

  render() {
    return null
  }
}

export default withRouter(Index)