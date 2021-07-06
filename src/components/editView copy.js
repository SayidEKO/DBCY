import { Component } from 'react'
import { DatePicker, Picker, Icon } from 'antd-mobile'
import Radio from './radio';

import { color_text_black, color_text_blue, color_text_gray, font_text_title } from '../config';
import { getType } from '../request/api';
import { getUserData, getDeep, getDepartment } from '../utils/utils';

const CustomChildren = props => (
  <div onClick={props.onClick} style={{ fontSize: font_text_title }}>
    <div style={{ display: 'flex', padding: 10, alignItems: 'center' }}>
      <div style={{ flex: 1, color: color_text_blue }}>{props.children}</div>
      <div style={{ textAlign: 'right', color: props.edit ? color_text_black : color_text_gray }}>{props.extra}</div>
      <Icon type='right' color={props.edit ? color_text_black : color_text_gray} />
    </div>
    <div style={{ borderBottom: '1px solid #BBBBBB', marginLeft: 10, marginRight: 10, display: props.hiddenLine ? 'none' : 'flex' }} />
  </div>
);

export default class EditView extends Component {

  state = {
    //选中的数据
    pickerValue: [],
    //数组深度
    pickDataDeepLength: 1,
    //数据
    pickData: [],
  }

  child() {
    const { edit, type, value, index, onEditCallBack } = this.props
    switch (type) {
      case 'datepicker':
      case 'datetimepicker':
        return (
          <div style={{ display: 'flex', float: 'right', pointerEvents: edit ? 'fill' : 'none' }}>
            <DatePicker mode="date" onChange={date => onEditCallBack(index, date.toLocaleDateString())}>
              <div>{value.length === 0 ? new Date(Date.now()).toLocaleDateString() : value}</div>
            </DatePicker>
            <img alt='' src={require('../assets/imgs/calendar.png').default} style={{ height: 20, marginLeft: 5 }} />
          </div>
        );
      case 'input':
      case 'number':
        return (
          <input
            type={type === 'number' ? 'number' : 'text'}
            readOnly={!edit}
            defaultValue={value}
            onBlur={e => onEditCallBack(index, e.target.value)}
            style={{
              width: '100%',
              borderWidth: 0,
              textAlign: 'right'
            }} />
        );
      case 'radio':
        return (
          <div style={{
            display: 'flex', float: 'right',
            pointerEvents: edit ? 'fill' : 'none',
            alignItems: 'center',
            fontSize: font_text_title
          }}>
            <Radio checkValue={value} onRadioClickCallBack={title => onEditCallBack(index, '是')}>是</Radio>
            <Radio checkValue={value} onRadioClickCallBack={title => onEditCallBack(index, '否')}>否</Radio>
          </div>
        )
      default:
        return null;
    }
  }

  getData(type) {
    const { pickData, } = this.state
    const { define } = this.props
    if (type === 'refer') {
      getType([{ refertype: define }]).then(result => {
        if (result.VALUES.length > 0) {
          let pickData = []
          let pickDataDeepLength = 1
          switch (define) {
            //部门相关
            case 'dept':
              pickData = getDepartment(result.VALUES)
              pickDataDeepLength = getDeep(pickData[0].children, 1)
              break
            //人员相关
            case 'psndoc':
              break
            default:
              result.VALUES.forEach(item => {
                let obj = {
                  vale: item.pk_group,
                  label: item.name
                }
                pickData.push(obj)
              })
              break
          }
          this.setState({ pickData, pickDataDeepLength })
        }
      });
    } else {
      let items = define.split(',')
      items.forEach(item => {
        let chars = item.split('=')
        pickData.push({ value: chars[1], label: chars[0] })
      })
    }
    this.setState({ pickData })
  }

  onOk(index, v) {
    const { onEditCallBack } = this.props
    const { pickData } = this.state
    this.setState({ pickerValue: v })
    pickData.forEach(item => {
      if (item.value === v[0]) {
        onEditCallBack(index, item)
      }
    })
  }

  render() {
    const {
      edit,         //是否可编辑
      type,         //表示字段类型
      title,        //标题
      value,        //值
      index,        //下标
      hiddenLine,   //是否隐藏下划线
    } = this.props
    const { pickData, pickerValue, pickDataDeepLength } = this.state

    if (type === 'refer' || type === 'select') {
      return (
        <div style={{ background: 'white' }}>
          <Picker
            style={{ fontSize: font_text_title }}
            cols={pickDataDeepLength}
            data={pickData}
            disabled={!edit}
            value={pickerValue}
            //默认值
            extra={value}
            onOk={v => this.onOk(index, v)}
            onPickerChange={e => {
              pickData.forEach(item => {
                //只算最外层的深度
                if (item.value === e[0]) {
                  this.setState({ pickerValue: e, pickDataDeepLength: getDeep(item.children, 1) })
                }
              })
            }}>
            <CustomChildren
              edit={edit}
              hiddenLine={hiddenLine}
              onClick={() => this.getData(type)}>{title}</CustomChildren>
          </Picker>
        </div>
      )
    } else {
      return (
        <div style={{ background: 'white', fontSize: font_text_title }}>
          <div style={{ padding: 10, display: 'flex', alignItems: 'center' }}>
            <div style={{ flex: 1, color: color_text_blue }}>{title}:</div>
            <div style={{ flex: 3, textAlign: 'right', color: edit ? 'black' : 'gray' }}>
              {this.child()}
            </div>
          </div>
          <div style={{ borderBottom: '1px solid #BBBBBB', marginLeft: 10, marginRight: 10, display: hiddenLine ? 'none' : 'flex' }} />
        </div>
      )
    }
  }
}