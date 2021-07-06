import { Component } from "react";

import { Checkbox } from "antd-mobile";
import { getValue } from "../utils/utils";

export default class WorkTagListItem extends Component {

  render() {
    const { itemData, multiSelect, onItemClick, index } = this.props
    let checked = itemData.checked
    return (
      <div
        onClick={() => onItemClick(index)}
        style={{ display: 'flex', alignItems: 'center', background: '#F5F5F9' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            margin: 5,
            padding: 5,
            width: '100%',
            background: 'white',
            borderRadius: 10
          }}>
          <Checkbox checked={checked} style={{ display: multiSelect ? 'flex' : 'none', padding: 5 }} />
          <div>
            {
              itemData.data.card_head.map((item, index) => {
                return (
                  <div key={index} style={{ display: 'flex', fontSize: 12 }}>
                    <div style={{ padding: 5 }}>{item.label}:</div>
                    <div style={{ padding: 5, color: 'gray' }}>{getValue(item)}</div>
                  </div>
                )
              })
            }
            {
              itemData.data.card_body.map((item, index) => {
                return (
                  <div key={index} style={{ display: 'flex', fontSize: 12 }}>
                    <div style={{ padding: 5 }}>{item.label}:</div>
                    <div style={{ padding: 5, color: 'gray' }}>{getValue(item)}</div>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    )
  }
}