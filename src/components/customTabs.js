//弹出选择器
import { Component } from 'react'
import { Tabs } from 'antd-mobile'

import { font_text_title } from '../config'

export default class CustomTabs extends Component {

  static defaultProps = {
    tabs: [],       //标签
    tableIndex: 0,  //tab下标
    dataSource: [],  //人员
    onClickTable: null, //tab点击事件
    onItemClick: null, //人员选中事件
  }

  state = {
    height: document.documentElement.clientHeight / 2 - 100
  }

  render() {
    const { tabs, tableIndex, dataSource, onClickTable, onItemClick } = this.props
    const { height } = this.state
    return (
      <Tabs
        tabs={tabs}
        page={Number(tableIndex)}
        swipeable={false}
        onTabClick={(tab, index) => {
          onClickTable(index)
          this.props.onClick()
        }}
        tabBarTextStyle={{ fontSize: font_text_title }}>
        <div style={{ display: 'flex', alignItems: 'center', height }}>

          <div style={{
            height,
            width: '100%',
            overflow: 'scroll',
            display: dataSource.length === 0 ? 'none' : 'inline'
          }}>
            {
              dataSource.map(item => {
                return (
                  <div
                    key={item.value}
                    style={{ fontSize: font_text_title, padding: 15 }}
                    onClick={e => onItemClick(item)}>
                    {item.name}
                  </div>
                )
              })
            }
          </div>
          <div style={{
            width: '100%',
            display: dataSource.length === 0 ? 'inline' : 'none',
            textAlign: 'center',
          }}>暂无人员</div>
        </div>
      </Tabs>
    )
  }
}