//弹出窗
import { Component } from 'react'
import { TextareaItem, Picker } from 'antd-mobile'

import Radio from './radio'
import { color_text_blue, font_text_title } from '../config'
import { getType } from '../request/api'
import { getUserData, getDepartment } from '../utils/utils'

export default class Alert extends Component {

  state = {
    //审批状态
    checkValue: '',
    //审批意见
    content: '',
    tag: '',
    //选中人
    checkUser: {},
    //改派人，加签人
    checkUserData: []
  }

  onRadioClickCallBack(title) {
    let tag = ''
    if (title === '改派' || title === '加签') {
      tag = title
      getType([{ refertype: 'psndoc' }]).then(result => {
        if (result.VALUES.length > 0) {
          let checkUserData = []
          getUserData(result.VALUES, checkUserData)
          this.setState({ tag, checkValue: title, checkUser: {}, checkUserData })
        }
      })
    } else if ('驳回') {
      
    } else {
      this.setState({ tag, checkValue: title, checkUser: {} })
    }
  }

  //确定
  onSubmit() {
    const { onAlertClickSubmit } = this.props
    const { checkValue, content, checkUser } = this.state
    onAlertClickSubmit(checkValue, content, checkUser)
    this.setState({ checkValue: '', checkUser: {}, content: '', tag: '' })
  }

  //取消
  onCancel() {
    const { onAlertClickCancel } = this.props
    onAlertClickCancel()
  }

  //参照选中
  onOk(e) {
    const { checkUserData } = this.state
    checkUserData.forEach(item => {
      if (item.value === e[0]) {
        this.setState({ checkUser: item })
      }
    })
  }

  render() {
    const { showAlert } = this.props
    const { checkUserData, checkValue, tag, checkUser, content } = this.state
    return (
      <div>
        <div style={{
          display: showAlert ? 'flex' : 'none',
          position: 'absolute',
          zIndex: 10,
          width: '100%',
          height: '100vh',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        >
          {/* 蒙板 */}
          <div style={{ position: 'absolute', width: '100%', height: '100%', opacity: .5, background: 'lightGray' }} />
          {/* 内容 */}
          <div style={{
            position: 'absolute',
            width: '90vw',
            height: 230,
            borderRadius: 5,
            background: 'white',
            boxShadow: '0px 0px 5px #000'
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
              <Radio checkValue={checkValue} onRadioClickCallBack={(title) => this.onRadioClickCallBack(title)} >批准</Radio>
              <Radio checkValue={checkValue} onRadioClickCallBack={(title) => this.onRadioClickCallBack(title)} >不批准</Radio>
              <Picker cols={1}
                data={checkUserData}
                onOk={(e) => this.onOk(e)}>
                <Radio checkValue={checkValue} onRadioClickCallBack={(title) => this.onRadioClickCallBack(title)} >驳回</Radio>
              </Picker>
              <Picker cols={1}
                data={checkUserData}
                onOk={(e) => this.onOk(e)}>
                <Radio checkValue={checkValue} onRadioClickCallBack={(title) => this.onRadioClickCallBack(title)} >改派</Radio>
              </Picker>
              <Picker
                cols={1}
                data={checkUserData}
                onOk={(e) => this.onOk(e)}>
                <Radio checkValue={checkValue} onRadioClickCallBack={(title) => this.onRadioClickCallBack(title)} >加签</Radio>
              </Picker>
            </div>
            <div style={{ border: '2px solid red', borderRadius: 5, margin: 10, fontSize: 8, color: 'red' }}>
              <TextareaItem
                rows={4}
                count={100}
                placeholder='请输入审批批语'
                value={content}
                onChange={e => this.setState({ content: e })}
                style={{ fontSize: font_text_title }} />
            </div>
            <div style={{ display: 'flex', width: '100%', color: color_text_blue }}>
              <div style={{ display: checkValue === '改派' || checkValue === '加签' ? 'flex' : 'none', flex: 1, marginLeft: 10 }}>
                <div>{tag + ':'}</div>
                <div style={{ marginLeft: 10 }}>{checkUser.label}</div>
              </div>
              <div style={{ display: 'flex', marginRight: 10, marginLeft: 'auto' }}>
                <button style={{ marginRight: 10 }} onClick={() => this.onSubmit()} >确定</button>
                <button onClick={() => this.onCancel()}>取消</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}