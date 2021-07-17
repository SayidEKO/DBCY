
import { Component } from 'react'
import { Badge, Tabs, Toast } from 'antd-mobile'

import { font_text_title } from '../config'
import { getDeep } from '../utils/utils'

export default class CustomTabs extends Component {

  static defaultProps = {
    selectDepartment: [], //已经选中的部门
    departmentData: [], //部门数据
    onClickTable: null, //tab点击事件
    onItemClick: null, //人员选中事件
  }

  state = {
    tabs: [],           //标签
    dataSource: [],     //人员
    tableIndex: 0,  //tab下标
    selectDepartment: [],//tab选过的下标
    height: document.documentElement.clientHeight / 2 - 100
  }

  static getDerivedStateFromProps(props, state) {
    let departmentData = props.departmentData
    let selectDepartment = props.selectDepartment
    let tabs = state.tabs
    if (departmentData.length !== 0) {
      //深度
      let deep = getDeep(departmentData, 0)
      //tabls长度和数据深度不一样表示是新的数据
      if (tabs.length !== deep) {
        for (let i = 0; i < deep; i++) {
          tabs.push({ title: <Badge>请选择</Badge> })
        }
      }

      for (let i = 0; i < selectDepartment.length; i++) {
        let departmentID = selectDepartment[i]
        for (let j = 0; j < departmentData.length; j++) {
          if (departmentID === departmentData[j].value) {
            tabs[i].title = <Badge>{departmentData[j].label}</Badge>
            //如果是最后一个部门去找当前部门的人员
            if (i === selectDepartment.length - 1) {
              let data = departmentData[j].psndoc
              return { dataSource: data === undefined ? [] : data, tabs }
            }
            departmentData = departmentData[j].children
          }
        }
      }
    }
  }

  render() {
    const { dataSource, height, tabs, tableIndex } = this.state
    return (
      <Tabs
        tabs={tabs}
        page={Number(tableIndex)}
        swipeable={false}
        onTabClick={(tab, index) => this.onClickTable(index)}
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
                    onClick={e => this.onItemClick(item)}>
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

  onItemClick(item) {
    const { onItemClick } = this.props
    this.setState({ dataSource: [], tableIndex: 0, selectDepartment: [], tabs: [] })
    onItemClick(item)
  }

  /**
   * tab的点击事件
   * @param {*} index 
   */
  onClickTable(index) {
    const { onClickTable, departmentData, selectDepartment } = this.props
    const { tabs } = this.state
    let department = departmentData

    selectDepartment.splice(index)
    //重置tab
    tabs.forEach((item, i) => {
      if (i >= index) {
        item.title = <Badge>请选择</Badge>
      }
    })

    if (index === 0) {
      this.setState({ tableIndex: index })
    } else {
      if (selectDepartment[index - 1] === undefined) {
        Toast.fail('请先选择上级部门', 1, null, false)
        return
      }
      selectDepartment.forEach(departmentID => {
        for (let i = 0; i < department.length; i++) {
          if (departmentID === department[i].value) {
            department = department[i].children
            break
          }
        }
      })
    }
    //没有下级部门
    if (department.length === 0) {
      Toast.fail('没有下级部门', 1, null, false)
    } else {
      this.setState({ tableIndex: index, tabs }, () => {
        //返回下级部门
        onClickTable(department, index)
        this.props.onClick()
      })
    }
  }
}