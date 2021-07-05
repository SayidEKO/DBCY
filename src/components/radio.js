//单选按钮
import { Component } from 'react'
import { font_text_title } from '../config'

export default class Radio extends Component {

  onClick() {
    const { title, onRadioClickCallBack } = this.props
    onRadioClickCallBack(title)
  }

  render() {
    const { title, checkValue } = this.props
    return (
      <div onClick={this.props.onClick}>
        <div
          onClick={() => this.onClick()}
          style={{ display: 'flex', alignItems: 'center', padding: 5, fontSize: font_text_title }}>
          <input type='radio' checked={checkValue === title} />
          <div style={{ marginLeft: 5 }}>{title}</div>
        </div>
      </div>
    )
  }
}