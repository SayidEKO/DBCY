//弹出窗
import { Component } from 'react'
import { TextareaItem } from 'antd-mobile'

import Radio from './radio'
import SelectPerson from "./selectPerson";

import store from '../store/store'
import { getDepartment } from '../utils/utils'
import { getType, getZPXQData } from '../request/api'

import { color_text_blue, font_text_title } from '../config'
import Select from './select';

export default class Alert extends Component {

  state = {
    //审批状态
    checkValue: '',
    //审批意见
    content: '',
    //选中项
    pick: {},
    //数据
    selectData: [],
    showSelect: false,
    selectPersonData:[],
    showSelectPerson: false
  }

  onRadioClickCallBack(value) {
    const { pk, billtype } = this.props
    let data = []
    if (value === 'T' || value === 'A') {
      getType([{ refertype: 'psndoc' }]).then(result => {
        if (result.VALUES.length > 0) {
          data = getDepartment(result.VALUES)
          this.setState({ checkValue: value, pick: {}, selectPersonData: data, showSelectPerson: true })
        }
      })
    } else if (value === 'R') {
      let cuserid = store.getState().userModule.cuserid
      let params = { action: 'return_approve', cuserid, pk, billtype }
      getZPXQData(params, billtype).then(result => {
        if (result.VALUES.length > 0) {
          this.setState({ checkValue: value, pick: {}, selectData:result.VALUES, showSelect: true })
        }
      })
    } else {
      this.setState({ checkValue: value, pick: {} })
    }
  }

  //确定
  onSubmit() {
    const { onAlertClickSubmit } = this.props
    const { checkValue, content, pick } = this.state
    onAlertClickSubmit(checkValue, content, pick)
    this.setState({ checkValue: '', pick: {}, content: '' })
  }

  render() {
    const { showAlert, onAlertClickCancel } = this.props
    const { checkValue, pick, content, showSelect, showSelectPerson, selectData, selectPersonData } = this.state
    let tag = ''
    if (checkValue === 'T') {
      tag = '改派: '
    } else if (checkValue === 'A') {
      tag = '加签: '
    }
    return (
      <div>
        <SelectPerson
          show={showSelectPerson}
          dataSource={selectPersonData}
          onSelectResultCallBack={item => this.setState({ pick: item, showSelectPerson: false })}
          onClickMaskCallBack={() => this.setState({ showSelectPerson: false })} />
        <Select
          show={showSelect}
          dataSource={selectData}
          onSelectResultCallBack={item => this.setState({ pick: item, showSelect: false })}
          onClickMaskCallBack={() => this.setState({ showSelect: false })} />
        <div style={{
          display: showAlert ? 'flex' : 'none',
          position: 'absolute',
          zIndex: 5,
          width: '100%',
          height: '100vh',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        >
          {/* 蒙板 */}
          <div 
          onClick={e => onAlertClickCancel()}
          style={{ position: 'absolute', width: '100%', height: '100%', opacity: .5, background: 'lightGray' }} />
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
              <Radio data={{ label: '批准', value: 'Y' }} checkValue={checkValue} onRadioClickCallBack={(title) => this.onRadioClickCallBack(title)} />
              <Radio data={{ label: '不批准', value: 'N' }} checkValue={checkValue} onRadioClickCallBack={(title) => this.onRadioClickCallBack(title)} />
              <Radio data={{ label: '驳回', value: 'R' }} checkValue={checkValue} onRadioClickCallBack={(title) => this.onRadioClickCallBack(title)} />
              <Radio data={{ label: '改派', value: 'T' }} checkValue={checkValue} onRadioClickCallBack={(title) => this.onRadioClickCallBack(title)} />
              <Radio data={{ label: '加签', value: 'A' }} checkValue={checkValue} onRadioClickCallBack={(title) => this.onRadioClickCallBack(title)} />
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
            <div style={{ display: 'flex', width: '100%', color: color_text_blue, fontSize: font_text_title }}>
              <div style={{ display: checkValue === 'T' || checkValue === 'A' ? 'flex' : 'none', flex: 1, marginLeft: 10 }}>
                <div>{tag}</div>
                <div style={{ marginLeft: 10 }}>{pick.name}</div>
              </div>
              <div style={{ display: 'flex', marginRight: 10, marginLeft: 'auto' }}>
                <button style={{ marginRight: 10 }} onClick={() => this.onSubmit()} >确定</button>
                <button onClick={() => onAlertClickCancel()}>取消</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}