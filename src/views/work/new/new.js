//新增页面
import Base from '../../base';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Toast } from 'antd-mobile'

import Table from '../../../components/table'
import EditView from '../../../components/editView'
import TabbarButton from '../../../components/tabbarButton'
import SelectView from "../../../components/selectView";


import store, { addTodo } from '../../../store/store';

import { getTemplate, getZPXQData } from '../../../request/api'

import { isEmpty, checkData, getFormatDate } from '../../../utils/utils';



//存表体模板
let templatesource = []
//用于记录表名
let tableName = ''
//记录表的下标
let tableIndex = -1
//记录选择字段的下标
let selectIndex = -1

class New extends Base {
  constructor(props) {
    super(props)
    this.state = {
      //高度
      height: document.documentElement.clientHeight,
      dataSource: [],
      showSelect: false,
      selectData: []
    }
  }

  //获取详情模版
  getTemplate() {
    const { userName, cuserid } = this.props
    let areacode_str = []
    let tables = this.props.location.state.table
    let funcode = this.props.location.state.funcode_detail.save
    let billtype = this.props.location.state.bill_type
    //获取表
    tables.forEach(item => {
      areacode_str.push({ code: item })
    })
    getTemplate([{ funcode, areacode_str }]).then(result => {
      if (result.VALUES.length !== 0) {
        let dataSource = []
        result.VALUES.forEach(template => {
          for (let key in template) {
            //排序
            template[key].sort((a, b) => { return a.position - b.position })
            if (key === 'card_head') {
              //添加默认值
              template[key].forEach(v => {
                if (v.label === '制单人') {
                  v.value = {
                    value: cuserid,
                    label: userName
                  }
                } else if (v.code === 'billtype') {
                  v.value = {
                    value: billtype.code,
                    label: billtype.name
                  }
                }
                //用于检查数据
                v.hasError = false
              })
              //数据
              dataSource.push(template)
            } else {
              //新增是没有表体数据，只加模版
              templatesource.push(template)
              dataSource.push({ [key]: [] })
            }
          }
        })
        this.setState({ dataSource })
        store.dispatch(addTodo('SET_DETAIL_DataSource', dataSource))
      }
    })
  }

  static getDerivedStateFromProps(props, state) {
    let table = props.table
    if (!isEmpty(table)) {
      props.propDataSource.forEach(item => {
        for (let key in item) {
          if (key === tableName) {
            if (tableIndex === -1) {
              item[tableName].push(table)
            } else {
              item[tableName][tableIndex] = table
            }
          }
        }
      })
      //用完重置
      tableName = ''
      tableIndex = -1
      store.dispatch(addTodo('SET_DETAIL_Table', null))
      store.dispatch(addTodo('SET_DETAIL_DataSource', props.propDataSource))
    }
    return { dataSource: props.propDataSource }
  }

  componentDidMount() {
    const { dataSource } = this.state
    let element = document.getElementById('action');
    if (element !== null) {
      let height = document.documentElement.clientHeight - element.clientHeight;
      this.setState({ height })
    }
    //获取模板
    if (dataSource.length === 0) {
      this.getTemplate()
    }
  }

  render() {
    const { height, dataSource, showSelect, selectData } = this.state
    return (
      <div style={{ background: 'white' }}>
        <SelectView
          show={showSelect}
          dataSource={selectData}
          onSelectResultCallBack={item => this.onSelectResultCallBack(item)}
          onClickMaskCallBack={() => this.setState({ showSelect: false })} />
        <div style={{ overflow: 'scroll', height }}>
          {
            dataSource.map((tags, tagIndex) => {
              for (let key in tags) {
                if (key === 'card_head') {
                  return (
                    tags[key].map((item, index) => {
                      return (
                        <EditView
                          key={index}
                          index={index}
                          item={item}
                          onEditCallBack={this.onEditCallBack} />
                      )
                    })
                  )
                } else {
                  return (
                    <Table
                      key={key}
                      title={key}
                      templateSource={templatesource[tagIndex - 1][key]}
                      tableSource={tags[key]}
                      onTableAddLisenter={this.onTableAddLisenter}
                      onTableEditLisenter={this.onTableEditLisenter}
                      onTableDeleteLisenter={this.onTableDeleteLisenter} />
                  )
                }
              }
              return null
            })
          }
        </div>

        <div id='action' style={{ position: 'fixed', bottom: 0, width: '100%' }}>
          <TabbarButton
            sectorMenuItems={['保存']}
            style={[{ flex: 1, padding: 10, borderRadius: 10, background: '#1296db' }]}
            onClickTabbarButton={title => this.onClickTabbarButton()} />
        </div>

      </div>
    )
  }
  //----------------------------------------TabbarButton----------------------------------------
  onClickTabbarButton() {
    const { cuserid } = this.props
    const { dataSource } = this.state
    let head = {}, bodys = {}
    if (checkData(dataSource, head, bodys)) {
      this.setState({ dataSource }, () => {
        Toast.fail('请检查后在提交！', 1, null, false)
      })
    } else {
      if (JSON.stringify(bodys) === '{}') {
        //表体没有数据
        Toast.info('请添加子表后在提交！', 1, null, false)
      } else {
        head.pk_group = this.props.pk_group
        head.pk_org = this.props.pk_org
        //创建人
        head.creator = cuserid
        //创建时间
        head.creationtime = getFormatDate('YYYY-mm-dd HH:MM:SS', new Date(Date.now()))
        //审批状态
        head.approvestatus = -1
        getZPXQData({ action: 'add', cuserid, head, bodys }).then(result => {
          console.log(result);
          Toast.success(result.MESSAGE, 1, () => {
            this.props.history.goBack()
          })
        })
      }
    }
  }

  //----------------------------------------Table----------------------------------------
  /**
   * 新增
   * @param {*} value 
   */
  onTableAddLisenter = (value) => {
    tableName = value
  }

  /**
   * 编辑
   * @param {*} index 
   * @param {*} value 
   */
  onTableEditLisenter = (index, value) => {
    tableIndex = index
    tableName = value
  }

  /**
   * 删除
   * @param {*} index 
   * @param {*} title 
   */
  onTableDeleteLisenter = (index, title) => {
    const { dataSource } = this.state
    dataSource.forEach(item => {
      for (let key in item) {
        if (key === title) {
          item[key].splice(index, 1)
        }
      }
    })
    store.dispatch(addTodo('SET_DETAIL_DataSource', dataSource))
    this.setState({ dataSource })
  }

  //----------------------------------------Edit----------------------------------------
  onEditCallBack = (index, value) => {
    if (Array.isArray(value)) {
      if (value.length === 0) {
        selectIndex = -1
        Toast.info('暂无数据！', 1)
      } else {
        selectIndex = index
        this.setState({ showSelect: true, selectData: value })
      }
    } else {
      const { dataSource } = this.state
      dataSource[0].card_head[index].value = value
      this.setState({ dataSource })
    }
  }

  //----------------------------------------Select----------------------------------------
  onSelectResultCallBack(item) {
    const { dataSource } = this.state
    dataSource.forEach(v => {
      let temp = v.card_head
      if (temp !== undefined) {
        temp[selectIndex].value = item
      }
    })
    this.setState({ dataSource, showSelect: false })
  }
}

//映射函数(绑定属性在porps)
const mapStateToProps = state => {
  return {
    userName: state.userModule.user_name,
    cuserid: state.userModule.cuserid,

    pk_group: state.userModule.pk_group,
    pk_org: state.userModule.pk_org,
    flag: state.listModule.flag,
    propDataSource: state.detailModule.dataSource,
    table: state.detailModule.table,
  }
}

export default connect(mapStateToProps)(withRouter(New))