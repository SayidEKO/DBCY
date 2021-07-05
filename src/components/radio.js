//单选按钮
import { Component } from 'react'
import { font_text_title } from '../config'

export default class Radio extends Component {

  render() {
    const { children, checkValue, onRadioClickCallBack } = this.props
    return (
      <div onClick={this.props.onClick}>
        <div
          onClick={() => onRadioClickCallBack(children)}
          style={{ display: 'flex', alignItems: 'center', padding: 5, fontSize: font_text_title }}>
          <input type='radio' checked={checkValue === children} onChange={e => console.log(e)}/>
          <div style={{ marginLeft: 5 }}>{children}</div>
        </div>
      </div>
    )
  }
}