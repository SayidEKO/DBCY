import { Component } from "react";
import { Checkbox, Picker } from "antd-mobile";

import store from "../store/store";

import { getLabel } from "../utils/utils";

import { getZPXQData } from "../request/api";

import { color_backgroup, color_button_blue, font_list_button_text, font_list_text, } from "../config";

const CustomChildren = props => (
  <div
    style={{
      float: 'right',
      paddingLeft: 10,
      paddingRight: 10,
      paddingTop: 5,
      paddingBottom: 5,
      borderRadius: 5,
      color: 'white',
      background: color_button_blue
    }}
    onClick={props.onClick} >
    {props.children}
  </div>
);

export default class WorkTagListItem extends Component {

  state = {
    pickData: []
  }

  getData(pk) {
    const { billtype } = this.props
    let pickData = []
    let cuserid = store.getState().userModule.cuserid
    let params = { action: 'return_approve', cuserid, pk, billtype }
    getZPXQData(params, billtype).then(result => {
      if (result.VALUES.length > 0) {
        result.VALUES.forEach(item => {
          let obj = {
            value: item.activity_id,
            label: item.approvestatus
          }
          pickData.push(obj)
        })
        this.setState({ pickData })
      }
    })
  }

  render() {
    const { itemData, multiSelect, onItemClick, index } = this.props
    const { pickData } = this.state
    let checked = itemData.checked
    let flag = store.getState().listModule.flag
    return (
      <div style={{ display: 'flex', alignItems: 'center', background: color_backgroup, padding: 5 }}>
        <div
          onClick={e => onItemClick(index)}
          style={{
            display: 'flex',
            padding: 5,
            width: '100%',
            alignItems:'center',
            borderRadius: 10,
            background: 'white'
          }}>
          <Checkbox checked={checked} style={{ display: multiSelect ? 'flex' : 'none', padding: 5 }} />
          <div style={{ width: '100%' }}>
            {
              itemData.data.map(table => {
                return (
                  table.yqdata.map((word, index) => {
                    return (
                      <div key={table.code + index} style={{ display: 'flex', fontSize: font_list_text }}>
                        <div style={{ padding: 5 }}>{word.label}:</div>
                        <div style={{ padding: 5, color: 'gray' }}>{getLabel(word)}</div>
                      </div>
                    )
                  })
                )
              })
            }
          </div>
        </div>
        <div style={{ position: 'absolute', right: 15, display: flag === 0 ? 'none' : 'flex' }}>
          <Picker
            cols={1}
            data={pickData}
            style={{ fontSize: font_list_button_text }}>
            <CustomChildren onClick={e => this.getData(itemData.pk)}>流程</CustomChildren>
          </Picker>
        </div>
      </div>

    )
  }
}