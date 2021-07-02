import { Component } from 'react'
import { DatePicker, Picker, Icon, Toast, Checkbox } from 'antd-mobile'

import { withRouter } from 'react-router-dom';

const CheckboxItem = Checkbox.AgreeItem

const CustomChildren = props => (
  <div style={{ fontSize: 10 }}>
    <div onClick={props.onClick} style={{ display: 'flex', padding: 10, alignItems: 'center' }}>
      <div style={{ flex: 1, color: '#3B3568' }}>{props.children}</div>
      <div style={{ textAlign: 'right', color: '#BBBBBB', }}>{props.extra}</div>
      <Icon type='right' color={'#BBBBBB'} />
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
        return (
          <div
            id='editView'
            suppressContentEditableWarning
            contentEditable={edit ? "true" : "false"}>
            {value}
          </div>
        );
      case 'radio':
        return (
          <div style={{ display: 'flex', float: 'right', pointerEvents: edit ? 'fill' : 'none' }}>
            <CheckboxItem
              checked={value === '是'}
              onChange={() => onEditCallBack(index, '是')}>
              <div style={{ fontSize: 10, color: edit ? 'black' : 'gray' }}>是</div>
            </CheckboxItem>
            <CheckboxItem
              checked={value === '否'}
              onChange={() => onEditCallBack(index, '否')} >
              <div style={{ fontSize: 10, color: edit ? 'black' : 'gray' }}>否</div>
            </CheckboxItem>
          </div>
        )
      default:
        return null;
    }
  }

  getData() {
    let pickData = [
      { value: 'chocolate', label: 'Chocolate' },
      { value: 'strawberry', label: 'Strawberry' },
      { value: 'vanilla', label: '信息管理科' },
    ];
    Toast.loading('loading')
    setTimeout(() => {
      Toast.hide()
      this.setState({ pickData })
    }, 1000);
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
            <CustomChildren onClick={() => this.getData()} hiddenLine={hiddenLine}>{title}</CustomChildren>
          </Picker>
        </div>
      )
    } else {
      return (
        <div style={{ padding: 10, background: 'white', fontSize: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ flex: 1, color: '#3B3568' }}>{title}:</div>
            <div style={{ flex: 3, textAlign: 'right', color: edit ? 'black' : 'gray' }}>
              {this.child()}
            </div>
          </div>
          <div style={{ borderBottom: '1px solid #BBBBBB', marginTop: 10, display: hiddenLine ? 'none' : 'flex' }} />
        </div>
      )
    }
  }
}

export default withRouter(EditView)