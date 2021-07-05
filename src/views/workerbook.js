/**
 * 员工手册
 */
import Base from './base'
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom'
import { Toast } from 'antd-mobile';

import TabbarButton from '../components/tabbarButton'

import { getJobBook } from '../request/api';


import { color_button_blue, color_button_gray } from '../config'

let url

class WorkerBook extends Base {
  constructor(props) {
    super(props)
    this.state = {
      //是否同意协议
      agree: false,
      content: ''
    }
    url = props.location.state
  }

  onClick = (title) => {
    if (!this.state.agree) {
      Toast.fail('请勾选后再操作！', 1)
      return
    }
    localStorage.setItem('sign', true)
    window.location.href = url
  }

  componentDidMount() {
    const { user_code } = this.props
    //如果已经跳转过签订页面则返回，重新获取该人员的签订情况
    if (localStorage.getItem('sign') === 'true') {
      this.props.history.goBack()
    }

    //获取岗位说明说
    getJobBook([{ user_code }]).then(result => {
      this.setState({ content: result.VALUES[0].info[0].leirong })
    })
  }

  render() {
    const { agree, content } = this.state
    return (
      <div style={{ textAlign: 'center' }}>
        <div>岗位说明书</div>
        <div>{content}</div>
        <div><input type="checkbox" onClick={value => {
          this.setState({ agree: !agree })
        }} /> 我已阅读</div>

        <div style={{ position: 'fixed', bottom: 0, width: '100%' }}>

          <TabbarButton
            sectorMenuItems={['签订手册']}
            style={[{ flex: 1, padding: 10, borderRadius: 10, background: agree ? color_button_blue : color_button_gray }]}
            sectorMenuItemFunctions={[this.onClick]} />
        </div>

      </div>
    )
  }
}

//映射函数(绑定属性在porps)
const mapStateToProps = state => {
  return {
    user_code: state.userModule.user_code
  }
}

export default connect(mapStateToProps)(withRouter(WorkerBook))