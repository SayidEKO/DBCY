//弹出选择器
import { Component } from 'react'
import { Picker } from 'antd-mobile'

import CustomTabs from './customTabs'

import { color_button_blue } from '../config'



export default class SelectPerson extends Component {

  static defaultProps = {
    dataSource: [],               //数据源
    show: false,                  //是否显示
    onClickMaskCallBack: null,    //点击蒙板回调
    onSelectResultCallBack: null,  //结果回调
  }

  state = {
    tableIndex: 0,    //table下标
    //下级部门数据
    departmentData: [],
    //tab选过的下标
    selectDepartment: []
  }

  render() {
    const { show, onClickMaskCallBack, dataSource } = this.props
    const { selectDepartment, departmentData } = this.state

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
                departmentData={dataSource}
                selectDepartment={selectDepartment}
                onClickTable={(data, index) => this.onClickTable(data, index)}
                onItemClick={item => this.onItemClick(item)} />
            </Picker>
          </div>
        </div>
      </div>
    )
  }

  /**
   * CustomTabs人员选中回调
   * @param {*} item 
   */
  onItemClick(item) {
    const { onSelectResultCallBack } = this.props
    //清空CustomTabs人员选中项
    this.setState({ selectDepartment: [] })
    onSelectResultCallBack(item)
  }

  /**
   * CustomTabs选项卡点击
   * @param {*} departmentData 下级部门
   * @param {*} tableIndex 
   */
  onClickTable(departmentData, tableIndex) {
    const { selectDepartment } = this.state
    //清空之后的选项
    selectDepartment.splice(tableIndex)
    this.setState({ departmentData, tableIndex, selectDepartment })
  }

  /**
   * pickerView点击事件(部门选中)
   */
  onClickPicker(e) {
    const { tableIndex, selectDepartment } = this.state
    //记录部门
    selectDepartment[tableIndex] = e[0]
    this.setState({ selectDepartment })
  }

  onSearch() {
  }
}