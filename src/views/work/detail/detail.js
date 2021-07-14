//详情页面
import Base from '../../base';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Toast } from 'antd-mobile'

import Table from '../../../components/table'
import Alert from '../../../components/alert'
import SelectDepartment from "../../../components/selectDepartment";
import EditView from '../../../components/editView'
import TabbarButton from '../../../components/tabbarButton'

import store, { addTodo } from '../../../store/store';

import { getTemplate, getZPXQData } from '../../../request/api'

import { getValue, isEmpty } from '../../../utils/utils';

//存表体模板
let templateData = []
//需要删除的远程数据
let deletes = {}
//记录选择字段的下标
let selectIndex = -1

let pk

class Detail extends Base {

  constructor(props) {
    super(props)
    this.state = {
      //高度
      height: document.documentElement.clientHeight,
      //组装的数据
      dataSource: [],
      //参照的数据
      selectData: [],
      showSelect: false,
      showAlert: false
    }
  }

  /**
   * 获取详情模版
   */
  initTemplate() {
    const { listItem, flag } = this.props
    let billtype = this.props.location.state.billtype
    let save = this.props.location.state.funcode_detail.save
    let audit = this.props.location.state.funcode_detail.audit
    let pkName = this.props.location.state.pk_name
    //flag（2： 审批）
    let funcode = flag === 2 ? audit : save

    getTemplate([{ funcode }], billtype).then(result => {
      let dataSource = []
      templateData = result.VALUES
      if (!isEmpty(templateData)) {
        //表排序
        templateData.sort((a, b) => { return a.yqpx - b.yqpx })
        dataSource = JSON.parse(JSON.stringify(templateData))
        dataSource.forEach((table, tableIndex) => {
          //字段排序
          templateData[tableIndex].yqdata.sort((a, b) => { return a.position - b.position })
          table.yqdata.sort((a, b) => { return a.position - b.position })
          if (table.yqpx === '1') {
            table.yqdata.forEach(word => {
              word.value = listItem[table.code][word.code]
              word.hasError = false
            })
            pk = listItem[table.code][pkName]
          } else {
            let bodys = listItem[table.code]
            let objs = []
            //遍历子表的每一条数据
            bodys.forEach(body => {
              //复制表体模板
              let templateBody = JSON.parse(JSON.stringify(table.yqdata))
              //遍历模版的每个字段
              templateBody.forEach(word => {
                word.value = body[word.code]
                word.hasError = false
              })
              objs.push(templateBody)
            })
            table.yqdata = objs
          }
        })
      }
      this.setState({ dataSource })
      store.dispatch(addTodo('SET_DETAIL_DataSource', dataSource))
    })
  }

  static getDerivedStateFromProps(props, state) {
    const { listItem, propDataSource } = props
    let temp = props.table
    if (!isEmpty(temp)) {
      //新增
      if (temp.index === undefined) {
        let obj = {}
        temp.table.forEach(item => {
          if (item.code !== undefined) {
            let value = getValue(item)
            obj[item.code] = value
          }
        })
        obj.dr = 0
        listItem[temp.code].push(obj)
        propDataSource.forEach(item => {
          if (item.code === temp.code) {
            item.yqdata.push(temp.table)
          }
        })
      }
      // 编辑
      else {
        temp.table.forEach(item => {
          listItem[temp.code][temp.index][item.code] = item.value
        })

        propDataSource.forEach(item => {
          if (temp.code === item.code) {
            item.yqdata[temp.index] = temp.table
          }
        })
      }

      //用完重置
      store.dispatch(addTodo('SET_DETAIL_Table', null))
      store.dispatch(addTodo('SET_DETAIL_BaseDataSource', listItem))
      store.dispatch(addTodo('SET_DETAIL_DataSource', propDataSource))
    }

    return { dataSource: propDataSource }
  }

  componentDidMount() {
    const { dataSource } = this.state
    let element = document.getElementById('action');
    if (element !== null) {
      let height = document.documentElement.clientHeight - element.clientHeight;
      this.setState({ height })
    }
    if (dataSource.length === 0) {
      this.initTemplate()
    }
  }

  render() {
    const { height, dataSource, showAlert, showSelect, selectData } = this.state
    let billtype = this.props.location.state.billtype
    return (
      <div style={{ position: 'relative' }}>
        <Alert
          showAlert={showAlert}
          pk={pk}
          billtype={billtype}
          onAlertClickSubmit={this.onAlertClickSubmit}
          onAlertClickCancel={() => this.setState({ showAlert: false })} />
        <SelectDepartment
          show={showSelect}
          dataSource={selectData}
          onSelectResultCallBack={item => this.onSelectResultCallBack(item)}
          onClickMaskCallBack={() => this.setState({ showSelect: false })} />
        <div style={{ background: 'white', paddingTop: 10, overflow: 'scroll', height }}>
          {
            dataSource.map((table, tableIndex) => {
              if (table.yqpx === '1') {
                return (
                  table.yqdata.map((item, index) => {
                    return (
                      <EditView
                        key={item.code}
                        index={index}
                        item={item}
                        onEditCallBack={this.onEditCallBack} />
                    )
                  })
                )
              } else {
                return (
                  <Table
                    key={tableIndex}
                    title={table.yqname}
                    code={table.code}
                    templateSource={templateData[tableIndex].yqdata}
                    tableSource={table.yqdata}
                    onTableDeleteLisenter={this.onTableDeleteLisenter} />
                )
              }
            })
          }
        </div>
        {this.initMenu()}
      </div>
    )
  }

  //----------------------------------------Menu----------------------------------------//
  /**
   * 初始底部按钮
   * @returns 
   */
  initMenu() {
    switch (this.props.flag) {
      case 0:
        return (
          <div id='action' style={{ position: 'fixed', bottom: 0, width: '100%' }}>
            <TabbarButton
              sectorMenuItems={['提交']}
              style={[{ flex: 1, padding: 10, borderRadius: 10, background: '#1296db' }]}
              onClickTabbarButton={title => this.onClickTabbarButton(title)} />
          </div>
        )
      case 1:
        return (
          <div id='action' style={{ position: 'fixed', bottom: 0, width: '100%', }}>
            <TabbarButton
              sectorMenuItems={['撤回']}
              style={[{ flex: 1, padding: 10, borderRadius: 10, background: 'red' }]}
              onClickTabbarButton={title => this.onClickTabbarButton(title)} />
          </div>
        )
      case 2:
        return (
          <div id='action' style={{ display: 'flex', position: 'fixed', bottom: 0, width: '100%', }}>
            <TabbarButton
              sectorMenuItems={['审批']}
              style={[{ flex: 1, padding: 10, borderRadius: 10, background: '#1296db' }]}
              onClickTabbarButton={title => this.onClickTabbarButton(title)} />

          </div>
        )
      case 3:
        return (<div id='action' />)
      default:
        break;
    }
  }

  /**
   * 底部按钮响应事件
   * @param {*} title 
   */
  onClickTabbarButton(title) {
    const { cuserid } = this.props
    let data = {}
    let billtype = this.props.location.state.billtype
    switch (title) {
      case '撤回':
        data = { action: 'unapprove', pk, cuserid }
        getZPXQData(data, billtype).then(result => {
          Toast.success(result.MESSAGE, 1, () => {
            this.props.history.goBack()
          })
        })
        break;
      case '提交':
        this.save().then(result => {
          data = { action: 'sendapprove', pk, cuserid }
          getZPXQData(data, billtype).then(result => {
            Toast.success(result.MESSAGE, 1, () => {
              this.props.history.goBack()
            })
          })
        })
        break;
      case '审批':
        this.setState({ showAlert: true })
        break;
      default:
        break;
    }
  }

  /**
   * 保存方法
   */
  async save() {
    const { cuserid, listItem } = this.props
    const { dataSource } = this.state

    let head, bodys = {}
    dataSource.forEach(table => {
      let tableName = table.code
      if (table.yqpx === '1') {
        head = JSON.parse(JSON.stringify(listItem[tableName]))
        for (let key in head) {
          //只传pk
          if (typeof head[key] === 'object') {
            if (head[key].pk === undefined) {
              head[key] = head[key].value
            } else {
              head[key] = head[key].pk
            }
          }
        }
      } else {
        let temp = JSON.parse(JSON.stringify(listItem[tableName]))
        temp.forEach(item => {
          for (let bodyKey in item) {
            if (typeof item[bodyKey] === 'object') {
              if (item[bodyKey].pk === undefined) {
                item[bodyKey] = item[bodyKey].value
              } else {
                item[bodyKey] = item[bodyKey].pk
              }
            }
          }
        })
        bodys[tableName] = temp
      }
      console.log('e');
    })
    for (let key in deletes) {
      deletes[key].forEach(item => {
        bodys[key].push(item)
      })
    }
    let billtype = this.props.location.state.billtype
    let data = { action: 'add', cuserid, head, bodys }
    return await getZPXQData(data, billtype)
  }

  //----------------------------------------Table----------------------------------------//
  /**
   * 删除
   * @param {*} index 
   * @param {表名} code 
   */
  onTableDeleteLisenter = (index, code) => {
    const { listItem } = this.props
    const { dataSource } = this.state
    let pkName = this.props.location.state.pk_name
    //有这个pk表示这列数据是远程数据
    if (!isEmpty(listItem[code][index][pkName])) {
      listItem[code][index].dr = 1
      let bodys = isEmpty(deletes.title) ? [] : deletes.title
      bodys.push(listItem[code][index])
      deletes[code] = bodys
    }
    //删除
    listItem[code].splice(index, 1)
    dataSource.forEach(item => {
      if(item.code === code) {
        item.yqdata.splice(index, 1)
      }
    })

    this.setState({ dataSource })
    store.dispatch(addTodo('SET_DETAIL_DataSource', dataSource))
    store.dispatch(addTodo('SET_DETAIL_BaseDataSource', listItem))
  }

  //----------------------------------------Edit----------------------------------------//
  /**
   * Edit回调
   * @param {*} index 
   * @param {*} value 
   */
  onEditCallBack = (index, value, code) => {
    const { listItem } = this.props
    //value如果是数组表示是选项
    if (Array.isArray(value)) {
      if (value.length === 0) {
        Toast.info('暂无数据！', 1)
      } else {
        selectIndex = index
        this.setState({ showSelect: true, selectData: value })
      }
    } else {
      const { dataSource } = this.state
      dataSource.forEach(item => {
        if (item.yqpx === '1') {
          item.yqdata[index].value = value
          listItem[item.code][code] = value
        }
      })
      
      this.setState({ dataSource })
      store.dispatch(addTodo('SET_DETAIL_DataSource', dataSource))
      store.dispatch(addTodo('SET_DETAIL_BaseDataSource', listItem))
    }
  }

  //----------------------------------------Select----------------------------------------
  onSelectResultCallBack(item) {
    const { listItem } = this.props
    const { dataSource } = this.state
    dataSource.forEach(table => {
      if (table.yqpx === '1') {
        let word = table.yqdata[selectIndex]
        word.value = item
        listItem[table.code][word.code] = item.activity_id
      }
    })
    this.setState({ dataSource, showSelect: false })
    store.dispatch(addTodo('SET_DETAIL_DataSource', dataSource))
    store.dispatch(addTodo('SET_DETAIL_BaseDataSource', listItem))
  }

  //----------------------------------------Alert----------------------------------------//
  /**
   * 审批
   * @param {审批意见} checkValue 
   * @param {审批内容} content 
   * @param {选中项目} pick 
   */
  onAlertClickSubmit = (checkValue, content, pick) => {
    this.setState({ showAlert: false })
    const { cuserid } = this.props
    let action = 'approve'
    //审批状态
    let approve = checkValue
    //审批意见
    let opinion = content
    //改派，加签人
    let rgman = ''
    //驳回流程
    let rejectActivity = ''
    switch (checkValue) {
      case 'R':
        //查流程
        rejectActivity = pick.activity_id === undefined ? '' : pick.activity_id
        break
      case 'T':
        rgman = pick.cuserid === undefined ? '' : pick.cuserid
        break
      case 'A':
        rgman = pick.cuserid === undefined ? '' : pick.cuserid
        break
      default:
        break
    }
    let data = { pk, cuserid, action, approve, opinion, rgman, rejectActivity }
    let billName = this.props.location.state.bill_name
    getZPXQData(data, billName).then(result => {
      Toast.success(result.MESSAGE, 1, () => {
        this.props.history.goBack()
      })
    })
  }
}

//映射函数(绑定属性在porps)
const mapStateToProps = state => {
  return {
    cuserid: state.userModule.cuserid,
    pk_group: state.userModule.cuserid,
    pk_org: state.userModule.cuserid,

    flag: state.listModule.flag,
    listItem: state.detailModule.baseDataSource,
    propDataSource: state.detailModule.dataSource,
    table: state.detailModule.table
  }
}

export default connect(mapStateToProps)(withRouter(Detail))