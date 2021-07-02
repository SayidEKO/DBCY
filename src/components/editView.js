import { Component } from 'react'
import { DatePicker, Picker, Icon } from 'antd-mobile'

import { withRouter } from 'react-router-dom';
import { color_text_black, color_text_blue, color_text_gray, font_text_title } from '../config';
import { ncBaseDataSynServlet } from '../request/api';

const CustomChildren = props => (
  <div style={{ fontSize: font_text_title }}>
    <div onClick={props.onClick} style={{ display: 'flex', padding: 10, alignItems: 'center' }}>
      <div style={{ flex: 1, color: color_text_blue }}>{props.children}</div>
      <div style={{ textAlign: 'right', color: props.edit ? color_text_black : color_text_gray }}>{props.extra}</div>
      <Icon type='right' color={props.edit ? color_text_black : color_text_gray} />
    </div>
    <div style={{ borderBottom: '1px solid #BBBBBB', marginLeft: 10, marginRight: 10, display: props.hiddenLine ? 'none' : 'flex' }} />
  </div>
);

class EditView extends Component {

  state = {
    pickerValue: [],
    pickData: []
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
            <input 
            checked={value === 'Y'}
            type='radio' style={{ marginRight: 5 }} 
            onChange={e => onEditCallBack(index, 'Y')} />
            <div style={{ color: edit ? 'black' : 'gray' }}>是</div>
            <input 
            checked={value === 'N'}
            type='radio' style={{ marginLeft: 20, marginRight: 5 }} 
            onChange={e => onEditCallBack(index, 'N')}/>
            <div style={{ color: edit ? 'black' : 'gray' }}>否</div>
          </div>
        )
      default:
        return null;
    }
  }

  getData(type) {
    const { pickData } = this.state
    let define = this.props.define
    if (pickData.length === 0) {
      if (type === 'refer') {
        ncBaseDataSynServlet(8, [{ refertype: define }]).then(result => {
          if (result.VALUES.length > 0) {
            result.VALUES.forEach(item => {
              pickData.push({ value: item.pk_group, label: item.name })
            })
          }
        });
      } else {
        let items = define.split(',')
        items.forEach(item => {
          let chars = item.split('=')
          pickData.push({ [chars[0]]: chars[1] })
        })
      }
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
    const { pickData, pickerValue } = this.state

    if (type === 'refer' || type === 'select') {
      return (
        <div style={{ background: 'white' }}>
          <Picker
            cols={1}
            data={pickData}
            disabled={!edit}
            value={pickerValue}
            //默认值
            extra={value}
            onOk={(v) => this.onOk(index, v)}>
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

export default withRouter(EditView)