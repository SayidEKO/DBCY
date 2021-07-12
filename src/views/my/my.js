import Base from "../base";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { List } from "antd-mobile";

import { getWorkerBook, uploadFile } from "../../request/api";

const Item = List.Item;

var menus = [

  {
    title: '我的假勤',
    url: ''
  },
  {
    title: '我的合同',
    url: ''
  },
  {
    title: '我的证件',
    url: ''
  },
  {
    title: '我的业绩',
    url: ''
  },
  {
    title: '工资条',
    url: ''
  },
  {
    title: '入异离',
    url: ''
  },
  {
    title: '考勤查询',
    url: '/my/attendance'
  },
  {
    title: '社保查询',
    url: ''
  },
  {
    title: '证明申请',
    url: ''
  },
  {
    title: '员工手册',
    url: ''
  },
  {
    title: '上传附件',
    url: ''
  }
]

class My extends Base {
  constructor(props) {
    super(props)
    this.state = {
      data: 'ww'
    }
  }

  onItemClick(obj, user_code) {
    switch (obj.title) {
      case '员工手册':
        getWorkerBook([{ user_code }]).then(result => {
          //签订地址
          let url = result.VALUES[0].url
          window.location.href = url
        })
        break;

      default:
        if (obj.url) {
          this.props.history.push(obj.url, {title: obj.title});
        }
        break;
    }
  }

  onFileSelect(e) {
    let file = e.nativeEvent.target.files[0]
    //重置value不然下次无法响应onChange事件
    e.target.value = ''
    uploadFile(file).then(result => {
      console.log(result)
    })
  }

  render() {
    const { user_name, user_code } = this.props
    return (
      <div>
        <div style={{ backgroundColor: 'white', textAlign: 'center', padding: '20px' }}>
          <img
            alt=''
            src={require('../../assets/imgs/avatar.png').default}
            style={{ height: '100px', width: '100px' }} />
          <div style={{ paddingTop: "20px" }}>{user_name}</div>
        </div>
        <div>
          <List>
            {
              menus.map(obj => {
                if (obj.title === '上传附件') {
                  return (
                    <Item
                      key={obj.title}
                      thumb={<i className="iconfont icon-dingdan"></i>}
                      arrow="horizontal">
                      <div style={{ display: 'flex' }}>
                        <div>{obj.title}</div>
                        {/* capture="camera" */}
                        <input type='file' multiple style={{ opacity: 0 }} onChange={(e) => this.onFileSelect(e)} />

                      </div>
                    </Item>
                  )
                } else {
                  return (
                    <Item
                      key={obj.title}
                      thumb={<i className="iconfont icon-dingdan"></i>}
                      arrow="horizontal"
                      // extra={<Badge text={2} overflowCount={10}  />}
                      onClick={() => this.onItemClick(obj, user_code)}>
                      {obj.title}
                    </Item>
                  )
                }

              })
            }
          </List>
        </div>
      </div>
    )
  }
}

//映射函数(绑定属性在porps)
const mapStateToProps = state => {
  return {
    user_code: state.userModule.user_code,
    user_name: state.userModule.user_name
  }
}

export default connect(mapStateToProps)(withRouter(My))
