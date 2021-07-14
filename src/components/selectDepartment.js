//弹出选择器
import { Component } from 'react'
import { Badge, Tabs, Icon } from 'antd-mobile'

import { getDeep } from '../utils/utils'

import { font_text_title } from '../config'

export default class SelectDepartment extends Component {

  static defaultProps = {
    dataSource: [],               //数据源
    show: false,                  //是否显示
    onClickMaskCallBack: null,    //点击蒙板回调
    onSelectResultCallBack: null  //结果回调
  }

  state = {
    dataSource: [],    //数据源
    selectData: [],   //选中的数据下标
    tabs: [],          //tab标签名
    tableIndex: 0,    //table下标
    height: 0,
  }

  static getDerivedStateFromProps(props, state) {
    if (props.dataSource.length !== 0) {
      //深度
      let deep = getDeep(props.dataSource, 0)
      //tabls长度和数据深度不一样表示是新的数据
      if (state.tabs.length !== deep) {
        let tabs = []
        for (let i = 0; i < deep; i++) {
          tabs.push({ title: <Badge>请选择</Badge> })
        }
        return { dataSource: props.dataSource, tabs }
      }

      // table选中第一个的时候重新赋值
      if (state.tableIndex === 0) {
        return { dataSource: props.dataSource }
      }
      return {}
    }
    return { dataSource: [], selectData: [], tableIndex: 0, tabs: [] }
  }

  componentDidMount() {
    let height = document.documentElement.clientHeight / 2 - 100
    this.setState({ height })
  }

  render() {
    const { show, onClickMaskCallBack, } = this.props
    const { dataSource, selectData, height, tableIndex, tabs } = this.state

    return (
      <div style={{
        display: show ? 'flex' : 'none',
        position: 'absolute',
        width: '100vw',
        height: '100vh',
        top: 0,
        zIndex: 10,
      }}>
        {/* 蒙板 */}
        <div
          onClick={e => onClickMaskCallBack()}
          style={{ position: 'fixed', width: '100%', height: '100%', opacity: .5, background: 'lightGray' }} />

        {/* 内容 */}
        <div
          style={{
            position: 'fixed',
            width: '100%',
            height: '50%',
            bottom: 0,
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
            background: 'white',
            boxShadow: '0px 0px 5px #000'
          }}>

          <div>
            {/* <div style={{ display: 'flex', height: 50, float: 'right', alignItems: 'center', color: color_button_blue }}>
              <div onClick={e => this.onSearch()} style={{ marginRight: 10 }}>搜索</div>
            </div> */}
            <Tabs
              tabs={tabs}
              page={Number(tableIndex)}
              onChange={(tab, index) => this.onChange(index)}
              tabBarTextStyle={{ fontSize: font_text_title }}>
              <div style={{ overflow: 'scroll', height }}>
                {
                  dataSource.map((item, index) => {
                    return (
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div
                          key={item.value}
                          style={{ fontSize: font_text_title, padding: 15, flex: 1 }}
                          onClick={e => this.onItemClick(item, tableIndex, index)}>
                          {item.label}
                        </div>
                        <Icon type='check' color='green' style={{ display: selectData[tableIndex] === index ? 'flex' : 'none', marginRight: 20 }}></Icon>
                      </div>
                    )
                  })
                }
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    )
  }

  /**
   * table点击事件
   * @param {*} tableIndex 
   */
  onChange(tableIndex) {
    const { dataSource } = this.props
    const { selectData } = this.state

    let selectIndex = selectData[tableIndex]
    //selectIndex等于undefined表示还未这一级table还未选择过
    if (selectIndex === undefined) {
      this.setState({ tableIndex, dataSource: [] })
    } else {
      let temp = dataSource
      if (selectData[tableIndex] === -1) {
        this.setState({ tableIndex, dataSource: [] })
      } else {
        selectData.forEach((v, i) => {
          if (i < tableIndex) {
            temp = temp[v].children
          }
        })
        this.setState({ tableIndex, dataSource: temp })
      }
    }
  }

  /**
   * item点击事件
   * @param {点击的数据} item 
   * @param {点击的table下标} tableIndex 
   * @param {item的下标} index 
   */
  onItemClick(item, tableIndex, index) {
    const { onSelectResultCallBack } = this.props
    const { selectData, tabs } = this.state
    //记录下标
    selectData[tableIndex] = index
    //修改tab的标签名
    tabs[tableIndex].title = <Badge>{item.label}</Badge>

    if (item.children !== undefined && item.children.length > 0) {
      //修改dataSource
      let dataSource = item.children
      //修改tab下标
      let newTableIndex = tableIndex + 1
      //重制后面的table
      tabs.forEach((v, i) => {
        if (i > tableIndex) {
          v.title = <Badge>请选择</Badge>
          selectData[i] = -1
        }
      })
      this.setState({ tableIndex: newTableIndex, dataSource, tabs })
    } else {
      tabs.forEach(item => {
        item.title = <Badge>请选择</Badge>
      })
      this.setState({ dataSource: [], tableIndex: 0, tabs, selectData: [] }, () => {
        onSelectResultCallBack(item)
      })

    }
  }

  onSearch() {
  }
}