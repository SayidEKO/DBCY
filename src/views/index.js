/**
 * 预加载
 */
import { Component } from 'react'
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom'

import { getWorkerBook } from '../request/api';

import { isEmpty } from "../utils/utils";

import { router2workerbook, router2work, router2new } from "../utils/routers";

import { DEBUG, menus } from '../config';


class Index extends Component {

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
    

    const { user_code } = this.props
    if (DEBUG) {
      router2work(this)
      // let bodys = menus['人员管理'].child
      // bodys.forEach(body => {
      //   if (body.title === '招聘需求申请') {
      //     router2new(this, body)
      //   }
      // })
      
    } else {
      localStorage.setItem('sign', false)
      //获取员工手册(这里需要调2次，第一创建，第二次签订)
      getWorkerBook([{ user_code }]).then(result => {
        getWorkerBook([{ user_code }]).then(result => {
          //签订地址
          let url = result.VALUES[0].url
          //表示已读未读
          let def1 = result.VALUES[0].info[0].def1
          //Def1等于N并且有url则跳转签名
          if (def1 === 'N' && url !== '' && url !== undefined) {
            router2workerbook(this, url)
          } else {
            router2work(this)
          }
        })
      })
    }
  }

  render() {
    return null
  }
}
//映射函数(绑定属性在porps)
const mapStateToProps = state => {
  return {
    user_code: state.userModule.user_code
  }
}

export default connect(mapStateToProps)(withRouter(Index))