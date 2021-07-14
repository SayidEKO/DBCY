//弹出选择器
import { Component } from 'react'

import { font_text_title } from '../config'
import { isEmpty } from '../utils/utils'

export default class Select extends Component {

  static defaultProps = {
    dataSource: [],               //数据源
    show: false,                  //是否显示
    onClickMaskCallBack: null,    //点击蒙板回调
    onSelectResultCallBack: null  //结果回调
  }

  render() {
    const { show, onClickMaskCallBack, dataSource } = this.props
    return (
      <div style={{
        display: show ? 'flex' : 'none',
        position: 'absolute',
        width: '100vw',
        height: '100vh',
        top: 0,
        zIndex: 10,
      }}>
        {/* 蒙板 */}
        <div
          onClick={e => onClickMaskCallBack()}
          style={{ position: 'fixed', width: '100%', height: '100%', opacity: .5, background: 'lightGray' }} />

        {/* 内容 */}
        <div
          style={{
            position: 'fixed',
            width: '100%',
            height: '50%',
            bottom: 0,
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
            background: 'white',
            boxShadow: '0px 0px 5px #000'
          }}>
          <div style={{ whiteSpace: 'nowrap', overflowX: 'auto' }}>
            {
              dataSource.map((item, index) => {
                return (
                  <div
                    key={index}
                    style={{ fontSize: font_text_title, display: 'flex' }}
                    onClick={e => this.onClick(item)}>
                    <div style={{ padding: 10, textAlign: 'center' }}>
                      <div >序号</div>
                      <div >{index + 1}</div>
                    </div>
                    <div style={{ padding: 10, textAlign: 'center' }}>
                      <div >发送人</div>
                      <div >{item.sendman}</div>
                    </div>
                    <div style={{ padding: 10, textAlign: 'center' }}>
                      <div >发送日期</div>
                      <div >{item.senddate}</div>
                    </div>
                    <div style={{ padding: 10, textAlign: 'center' }}>
                      <div >审批人</div>
                      <div >{item.dealman}</div>
                    </div>
                    <div style={{ padding: 10, textAlign: 'center' }}>
                      <div >审批日期</div>
                      <div >{item.dealdate}</div>
                    </div>
                    <div style={{ padding: 10, textAlign: 'center' }}>
                      <div >环节</div>
                      <div >{item.approvelink}</div>
                    </div>
                    <div style={{ padding: 10, textAlign: 'center' }}>
                      <div >审批状况</div>
                      <div >{item.approvestatus}</div>
                    </div>
                    <div style={{ padding: 10, textAlign: 'center' }}>
                      <div >审批意见</div>
                      <div >{item.checknote}</div>
                    </div>
                    <div style={{ padding: 10, textAlign: 'center' }}>
                      <div >批语</div>
                      <div >{item.checknote}</div>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    )
  }

  onClick(item) {
    const { onSelectResultCallBack, onClickMaskCallBack } = this.props
    if (!isEmpty(onSelectResultCallBack)) {
      onSelectResultCallBack(item)
    }
    onClickMaskCallBack()
  }
}