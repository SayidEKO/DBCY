//弹出窗
import { Component } from 'react'
import { TextareaItem, Picker } from 'antd-mobile'

import Radio from './radio'

import store from '../store/store'
import { getUserData } from '../utils/utils'
import { getType, getZPXQData } from '../request/api'

import { color_text_blue, font_text_title } from '../config'

export default class Alert extends Component {

  state = {
    //审批状态
    checkValue: '',
    //审批意见
    content: '',
    tag: '',
    //选中项
    pick: {},
    //数据
    pickData: []
  }

  onRadioClickCallBack(title) {
    const { pk } = this.props
    let tag = ''
    let pickData = []
    if (title === '改派' || title === '加签') {
      tag = title
      getType([{ refertype: 'psndoc' }]).then(result => {
        if (result.VALUES.length > 0) {
          getUserData(result.VALUES, pickData)
          this.setState({ tag, checkValue: title, pick: {}, pickData })
        }
      })
    } else if ('驳回') {
      let cuserid = store.getState().userModule.cuserid
      let params = { action: 'return_approve', cuserid, pk, billtype: "ZPXQ" }
      getZPXQData(params).then(result => {
        if (result.VALUES.length > 0) {
          result.VALUES.forEach(item => {
            let obj = {
              value: item.activity_id,
              label: item.approvestatus
            }
            pickData.push(obj)
          })
          this.setState({ tag, checkValue: title, pick: {}, pickData })
        }
      })
    } else {
      this.setState({ tag, checkValue: title, pick: {}, pickData })
    }
  }

  //确定
  onSubmit() {
    const { onAlertClickSubmit } = this.props
    const { checkValue, content, pick } = this.state
    onAlertClickSubmit(checkValue, content, pick)
    this.setState({ checkValue: '', pick: {}, content: '', tag: '' })
  }

  //取消
  onCancel() {
    const { onAlertClickCancel } = this.props
    onAlertClickCancel()
  }

  //参照选中
  onOk(e) {
    const { pickData } = this.state
    pickData.forEach(item => {
      if (item.value === e[0]) {
        this.setState({ pick: item })
      }
    })
  }

  render() {
    const { showAlert } = this.props
    const { pickData, checkValue, tag, pick, content } = this.state
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
              <Radio title='批准' checkValue={checkValue} onRadioClickCallBack={(title) => this.onRadioClickCallBack(title)} />
              <Radio title='不批准' checkValue={checkValue} onRadioClickCallBack={(title) => this.onRadioClickCallBack(title)} />
              <Picker cols={1}
                data={pickData}
                onOk={(e) => this.onOk(e)}>
                <Radio title='驳回' checkValue={checkValue} onRadioClickCallBack={(title) => this.onRadioClickCallBack(title)} />
              </Picker>
              <Picker cols={1}
                data={pickData}
                onOk={(e) => this.onOk(e)}>
                <Radio title='改派' checkValue={checkValue} onRadioClickCallBack={(title) => this.onRadioClickCallBack(title)} />
              </Picker>
              <Picker
                cols={1}
                data={pickData}
                onOk={(e) => this.onOk(e)}>
                <Radio title='加签' checkValue={checkValue} onRadioClickCallBack={(title) => this.onRadioClickCallBack(title)} />
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
                <div style={{ marginLeft: 10 }}>{pick.label}</div>
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