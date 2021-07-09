import { Component } from "react";
import { Checkbox, Picker } from "antd-mobile";

import store from "../store/store";

import { getLabel } from "../utils/utils";

import { getZPXQData } from "../request/api";

import { color_backgroup, color_button_blue, font_text_title, } from "../config";

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
    let pickData = []
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
        <div style={{ display: 'flex', padding: 5, width: '100%', background: 'white', borderRadius: 10 }}
          onClick={e => onItemClick(index)}>
          <Checkbox checked={checked} style={{ display: multiSelect ? 'flex' : 'none', padding: 5 }} />
          <div style={{ width: '100%' }}>
            {
              itemData.data.card_head.map((item, index) => {
                return (
                  <div key={index} style={{ display: 'flex', fontSize: 12 }}>
                    <div style={{ padding: 5 }}>{item.label}:</div>
                    <div style={{ padding: 5, color: 'gray' }}>{getLabel(item)}</div>
                  </div>
                )
              })
            }
            {
              itemData.data.card_body.map((item, index) => {
                return (
                  <div key={index} style={{ display: 'flex', fontSize: 12 }}>
                    <div style={{ padding: 5 }}>{item.label}:</div>
                    <div style={{ padding: 5, color: 'gray' }}>{getLabel(item)}</div>
                  </div>
                )
              })
            }
          </div>
        </div>
        <div style={{ position: 'absolute', right: 15, display: flag === 0 ? 'none' : 'flex' }}>
          <Picker
            cols={1}
            data={pickData}
            style={{ fontSize: font_text_title }}>
            <CustomChildren onClick={e => this.getData(itemData.pk)}>流程</CustomChildren>
          </Picker>
        </div>
      </div>

    )
  }
}