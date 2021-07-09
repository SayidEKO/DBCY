import React, { Component } from 'react'
import { DatePicker, Icon } from 'antd-mobile'

import Radio from './radio';

import { getType } from '../request/api';

import { getDepartment, getFormatDate, getLabel, isEmpty } from '../utils/utils';

import { color_text_black, color_text_blue, color_text_gray, color_text_red, font_text_title } from '../config';

export default class EditView extends Component {

  static defaultProps = {
    index: 0,             //下标
    onEditCallBack: null  //回调（返回index，value, code）value如果是数组表示是选项
  }

  render() {
    const { item } = this.props
    //标题
    let title = item.label
    //值
    let value = getLabel(item)
    //字段类型
    let type = item.itemtype
    //字段编码
    let code = item.code
    //参照编码
    let define = item.define1
    //是否可以编辑(N:可编辑 Y:不可编辑)
    let canEdit = item.disabled === 'N'
    //是否必填(N:不必填 Y:必填)
    let tempRequired = item.required === 'Y'
    //是否显示(N:隐藏 Y:显示)
    let tempVisible = item.visible === 'Y'
    //是否有误
    let hasError = item.hasError
    //颜色
    let color
    if (!canEdit) {
      color = color_text_gray
    } else {
      color = hasError ? color_text_red : color_text_blue
    }

    return (
      <div
        onClick={e => {
          if (canEdit) {
            this.onClick(type, define, code)
          }
        }}
        style={{
          display: tempVisible ? 'inline' : 'none',
          pointerEvents: canEdit ? 'fill' : 'none',
          background: 'white'
        }}>
        <div style={{ padding: 10, display: 'flex', alignItems: 'center', fontSize: font_text_title }}>
          <div style={{ display: tempRequired ? 'inline' : 'none', color: color_text_red, marginRight: 5 }}>*</div>
          {/* 标题 */}
          <div style={{ color }}>{title}:</div>
          {/* 内容 */}
          <div style={{ flex: 1, textAlign: 'right', color: canEdit ? color_text_black : color_text_gray }}>
            {this.child(canEdit, type, value, code)}
          </div>
        </div>
        <div style={{ borderBottom: '1px solid #BBBBBB', marginLeft: 10, marginRight: 10 }} />
      </div>
    )
  }

  child(canEdit, type, value, code) {
    const { index, onEditCallBack } = this.props
    switch (type) {
      case 'datepicker':
      case 'datetimepicker':
        return (
          <div style={{ display: 'flex', float: 'right', alignItems: 'center' }}>
            <DatePicker mode="date" onChange={date => onEditCallBack(index, getFormatDate('YYYY-mm-dd HH:MM:SS', date), code)}>
              <div>{isEmpty(value) ? '请选择' : value.split(' ')[0]}</div>
            </DatePicker>
            <img alt='' src={require('../assets/imgs/calendar.png').default} style={{ height: 20, marginLeft: 5 }} />
          </div>
        );
      case 'input':
      case 'number':
        return (
          <input
            type={type === 'number' ? 'number' : 'text'}
            defaultValue={value}
            onBlur={e => onEditCallBack(index, e.target.value, code)}
            style={{ width: '100%', borderWidth: 0, textAlign: 'right' }} />
        );
      case 'radio':
        return (
          <div style={{ display: 'flex', float: 'right' }}>
            <Radio edit={canEdit} title='是' checkValue={value} onRadioClickCallBack={title => onEditCallBack(index, title, code)} />
            <Radio edit={canEdit} title='否' checkValue={value} onRadioClickCallBack={title => onEditCallBack(index, title, code)} />
          </div>
        )
      case 'refer':
      case 'select':
        return (
          <div style={{ display: 'flex', float: 'right', alignItems: 'center' }}>
            <div>{isEmpty(value) ? '请选择' : value}</div>
            <Icon type='right' color='lightGray' />
          </div>
        )
      default:
        return null;
    }
  }

  onClick(type, define, code) {
    const { index, onEditCallBack } = this.props
    if (type === 'refer' || type === 'select') {
      let pickData = []
      if (type === 'refer') {
        getType([{ refertype: define }]).then(result => {
          if (result.VALUES.length > 0) {
            switch (define) {
              case 'dept'://部门相关
              case 'psndoc'://人员相关
                pickData = getDepartment(result.VALUES)
                break
              case 'group'://集团
                this.getObject(pickData, result.VALUES, 'name', 'pk_group')
                break
              case 'org'://组织
                this.getObject(pickData, result.VALUES, 'name', 'pk_org')
                break
              case 'postarchives'://招聘岗位
                this.getObject(pickData, result.VALUES, 'postname', 'pk_post')
                break
              case 'labordefdoc'://用工方式
              case 'recruitdefdoc'://招聘理由
                this.getObject(pickData, result.VALUES, 'name', 'pk_defdoc')
                break
              default:
                break
            }
            onEditCallBack(index, pickData, code)
          }
        });
      } else {
        let items = define.split(',')
        items.forEach(item => {
          let chars = item.split('=')
          pickData.push({ value: chars[1], label: chars[0] })
        })
        onEditCallBack(index, pickData, code)
      }
    }
  }

  /**
   * 
   * @param {组装后的数据} pickData 
   * @param {愿数据} data 
   * @param {name} label 
   * @param {code} value 
   */
  getObject(pickData, data, label, value) {
    data.forEach(item => {
      let obj = {
        value: item[value],
        label: item[label],
        children: []
      }
      pickData.push(obj)
    })
  }
}