//单选按钮
import { Component } from 'react'
import { font_text_title } from '../config'

export default class Radio extends Component {

  static defaultProps = {
    edit: true,                 //是否可以编辑
    title: '',                  //标题
    checkValue: '是',           //选中值
    onRadioClickCallBack: null  //回调
  }

  render() {
    const { edit, title, checkValue, onRadioClickCallBack } = this.props
    let temp = title === '是' ? 'Y' : 'N'
    let value = ''
    if (title === '是') {
      value = 'Y'
    }else if (title === '否') {
      value = 'N'
    }
    return (
      <div onClick={this.props.onClick}>
        <div
          onClick={() => onRadioClickCallBack(value)}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: 5,
            fontSize: font_text_title,
            //pointerEvents禁止onClick事件
            pointerEvents: edit ? 'fill' : 'none'
          }}>
          <input type='radio' checked={checkValue === title || checkValue === temp} onChange={() => { }} />
          <div style={{ marginLeft: 5 }}>{title}</div>
        </div>
      </div>
    )
  }
}