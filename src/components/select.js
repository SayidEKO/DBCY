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
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ background: 'lightGray', padding: 10 }}>序号</div>
                      <div >{index + 1}</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ background: 'lightGray', padding: 10 }}>发送人</div>
                      <div style={{ padding: 10 }}>{item.sendman}</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ background: 'lightGray', padding: 10 }}>发送日期</div>
                      <div style={{ padding: 10 }}>{item.senddate}</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ background: 'lightGray', padding: 10 }}>审批人</div>
                      <div style={{ padding: 10 }}>{item.dealman}</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ background: 'lightGray', padding: 10 }}>审批日期</div>
                      <div style={{ padding: 10 }}>{item.dealdate}</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ background: 'lightGray', padding: 10 }}>环节</div>
                      <div style={{ padding: 10 }}>{item.approvelink}</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ background: 'lightGray', padding: 10 }}>审批状况</div>
                      <div style={{ padding: 10 }}>{item.approvestatus}</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ background: 'lightGray', padding: 10 }}>审批意见</div>
                      <div style={{ padding: 10 }}>{item.checknote}</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ background: 'lightGray', padding: 10 }}>批语</div>
                      <div style={{ padding: 10 }}>{item.checknote}</div>
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