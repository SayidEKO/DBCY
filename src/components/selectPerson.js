//弹出选择器
import { Component } from 'react'
import { Badge, Picker, Toast } from 'antd-mobile'

import CustomTabs from './customTabs'

import { getDeep } from '../utils/utils'

import { color_button_blue } from '../config'

//tab选过的下标
let selecTabIndex = []

export default class SelectPerson extends Component {

  static defaultProps = {
    dataSource: [],               //数据源
    show: false,                  //是否显示
    onClickMaskCallBack: null,    //点击蒙板回调
    onSelectResultCallBack: null,  //结果回调
  }

  state = {
    dataSource: [],    //数据源
    selectData: [],   //选中的数据下标
    tabs: [],          //tab标签名
    tableIndex: 0,    //table下标
    departmentData: [],
    tabData: []
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

  render() {
    const { show, onClickMaskCallBack, onSelectResultCallBack } = this.props
    const { tabData, tableIndex, tabs, departmentData } = this.state

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
            <div style={{ display: 'flex', height: 50, float: 'right', alignItems: 'center', color: color_button_blue }}>
              <div onClick={e => this.onSearch()} style={{ marginRight: 10 }}>搜索</div>
            </div>
            <Picker
              cols={1}
              data={departmentData}
              onOk={(e) => this.onClickPicker(e)}>
              <CustomTabs
                tabs={tabs}
                dataSource={tabData}
                tableIndex={tableIndex}
                selecTabIndex={selecTabIndex}
                onClickTable={(index) => this.onClickTable(index)}
                onChange={index => this.onChange(index)}
                onItemClick={item => onSelectResultCallBack(item)} />
            </Picker>

          </div>
        </div>
      </div>
    )
  }



  /**
   * pickerView点击事件(部门选中)
   */
  onClickPicker(e) {
    const { dataSource, tabs, tableIndex } = this.state
    let temp = dataSource
    //记录部门
    selecTabIndex[tableIndex] = e[0]

    selecTabIndex.forEach((item, index) => {
      for (let i = 0; i < temp.length; i++) {
        if (item === temp[i].value) {
          tabs[index].title = <Badge>{temp[i].label}</Badge>
          if (index === selecTabIndex.length - 1) {
            this.setState({ tabData: temp[i].psndoc })
          }
          temp = temp[i].children
          break
        }
      }
    })

    console.log(e);
  }


  /**
   * tab的点击事件
   * @param {*} index 
   */
  onClickTable(index) {
    const { dataSource, tabs } = this.state
    let temp = dataSource

    //删除当前部门的下级
    selecTabIndex.splice(index)
    tabs.forEach((item, i) => {
      if (i > index) {
        item.title = <Badge>请选择</Badge>
      }
    })
    if (index === 0) {
      this.setState({ departmentData: dataSource, tableIndex: index, tabData: [] })
    } else {
      selecTabIndex.forEach((item, index) => {
        for (let i = 0; i < temp.length; i++) {
          if (item === temp[i].value) {
            temp = temp[i].children
            break
          }
        }
      })
      this.setState({ departmentData: temp, tableIndex: index, tabData: [], tabs })
    }
  }

  onSearch() {
  }
}