//单选按钮
import { Component } from 'react'
import { font_text_title } from '../config'

export default class Radio extends Component {

  static defaultProps = {
    edit: true,                 //是否可以编辑
    data: {},                  //数据
    checkValue: '',           //选中值
    onRadioClickCallBack: null  //回调
  }

  render() {
    const { edit, data, checkValue, onRadioClickCallBack } = this.props
    
    return (
      <div onClick={this.props.onClick}>
        <div
          onClick={() => onRadioClickCallBack(data.value)}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: 5,
            fontSize: font_text_title,
            //pointerEvents禁止onClick事件
            pointerEvents: edit ? 'fill' : 'none'
          }}>
          <input type='radio' checked={checkValue === data.value } onChange={() => { }} />
          <div style={{ marginLeft: 5 }}>{data.label}</div>
        </div>
      </div>
    )
  }
}