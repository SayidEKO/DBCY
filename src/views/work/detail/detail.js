//详情页面
import Base from '../../base';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Toast } from 'antd-mobile'

import Table from '../../../components/table'
import Alert from '../../../components/alert'
import SelectView from "../../../components/selectView";
import EditView from '../../../components/editView'
import TabbarButton from '../../../components/tabbarButton'

import store, { addTodo } from '../../../store/store';

import { getTemplate, getZPXQData } from '../../../request/api'

import { getValue, isEmpty } from '../../../utils/utils';

//存表体模板
let templatesource = []
//用于记录表名
let tableName = ''
//记录表的下标
let tableIndex = -1
//需要删除的远程数据
let deletes = {}
//记录选择字段的下标
let selectIndex = -1
//记录选择字段的code
let selectCode = ''

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
    const { listItem } = this.props
    let areacode_str = []
    let funcode = this.props.location.state.funcode_detail.save
    //获取表
    this.props.location.state.table.forEach(item => {
      areacode_str.push({ code: item })
    })
    let data = [{ funcode, areacode_str }]
    getTemplate(data).then(result => {
      let dataSource = []
      if (result.VALUES.length !== 0) {
        result.VALUES.forEach(template => {
          // 遍历模板
          for (let templateKey in template) {
            template[templateKey].sort((a, b) => { return a.position - b.position })
            //判断是否为表头
            if (templateKey === 'card_head') {
              let tempItem = listItem
              //遍历表头字段
              template[templateKey].forEach(templateItem => {
                //遍历数据的key
                for (let key in tempItem[templateKey]) {
                  //找到就跳出继续下一个
                  if (templateItem.code === key) {
                    templateItem.value = tempItem[templateKey][key]
                    continue
                  }
                }
              })
              dataSource.push(template)
            }
            //处理模板表体
            else {
              if (!isEmpty(listItem[templateKey])) {
                //遍历数据
                let body = []
                listItem[templateKey].forEach(item => {
                  //多条数据所以复制出多个模板
                  let newTemplate = JSON.parse(JSON.stringify(template[templateKey]))
                  //遍历模板表体
                  newTemplate.forEach(templateItem => {
                    for (let key in item) {
                      //找到就跳出继续下一个
                      if (templateItem.code === key) {
                        templateItem.value = item[key]
                        continue
                      }
                    }
                  })

                  body.push(newTemplate)
                })
                templatesource.push(template)
                dataSource.push({ [templateKey]: body })
              }
            }
          }
        })
      }
      this.setState({ dataSource })
      store.dispatch(addTodo('SET_DETAIL_DataSource', dataSource))
    })
  }

  static getDerivedStateFromProps(props, state) {
    const { listItem, propDataSource } = props
    let table = props.table
    if (!isEmpty(table)) {
      //新增
      if (tableIndex === -1) {
        let obj = {}
        table.forEach(item => {
          if (item.code !== undefined) {
            let value = getValue(item)
            obj[item.code] = value
          }
        })
        obj.dr = 0
        listItem[tableName].push(obj)

        propDataSource.forEach(item => {
          if (item[tableName] !== undefined) {
            item[tableName].push(table)
          }
        })
      }
      // 编辑
      else {
        table.forEach(item => {
          let value = getValue(item)
          listItem[tableName][tableIndex][item.code] = value
        })

        propDataSource.forEach(item => {
          if (item[tableName] !== undefined) {
            item[tableName][tableIndex] = table
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
    const { listItem } = this.props
    const { height, dataSource, showAlert, showSelect, selectData } = this.state
    let pk = isEmpty(listItem) ? '' : listItem.card_head.pk_nrna
    return (
      <div style={{ position: 'relative' }}>
        <Alert
          showAlert={showAlert}
          pk={pk}
          onAlertClickSubmit={this.onAlertClickSubmit}
          onAlertClickCancel={() => this.setState({ showAlert: false })} />
        <SelectView
          show={showSelect}
          dataSource={selectData}
          onSelectResultCallBack={item => this.onSelectResultCallBack(item)}
          onClickMaskCallBack={() => this.setState({ showSelect: false })} />
        <div style={{ background: 'white', paddingTop: 10, overflow: 'scroll', height }}>
          {
            dataSource.map((items, bodyIndex) => {
              for (let key in items) {
                if (key === 'card_head') {
                  return (
                    items[key].map((item, index) => {
                      return (
                        <EditView
                          key={item.code}
                          index={index}
                          item={item}
                          onEditCallBack={this.onEditCallBack} />
                      )
                    })
                  )
                }
                else {
                  return (
                    <Table
                      key={key}
                      title={key}
                      templateSource={templatesource[bodyIndex - 1][key]}
                      tableSource={items[key]}
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
    const { cuserid, listItem } = this.props
    let data = {}
    let pk = isEmpty(listItem) ? '' : listItem.card_head.pk_nrna

    switch (title) {
      case '撤回':
        data = { action: 'unapprove', pk, cuserid }
        getZPXQData(data).then(result => {
          Toast.success(result.MESSAGE, 1, () => {
            this.props.history.goBack()
          })
        })
        break;
      case '提交':
        data = { action: 'sendapprove', pk, cuserid }
        this.save().then(result => {
          // getZPXQData(data).then(result => {
          //   Toast.success(result.MESSAGE, 1, () => {
          //     this.props.history.goBack()
          //   })
          // })
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

    let temp = JSON.parse(JSON.stringify(listItem))
    let card_head = JSON.parse(JSON.stringify(temp.card_head))
    delete (listItem.card_head)
    for (let key in card_head) {
      if (typeof card_head[key] === 'object') {
        if (card_head[key].pk === undefined) {
          card_head[key] = card_head[key].value
        } else {
          card_head[key] = card_head[key].pk
        }
      }
    }
    for (let key in listItem) {
      listItem[key].forEach(item => {
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
    }

    for(let key in deletes) {
      deletes[key].forEach(item => {
        listItem[key].push(item)
      })
    }
    console.log('e');
    return await getZPXQData({ action: 'add', cuserid, head: card_head, bodys: listItem })
  }

  //----------------------------------------Table----------------------------------------//
  /**
   * 新增
   * @param {*} value 
   */
  onTableAddLisenter = (value) => {
    tableIndex = -1
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
   * @param {表名} title 
   */
  onTableDeleteLisenter = (index, title) => {
    const { listItem } = this.props
    const { dataSource } = this.state


    //有这个pk_nrna表示这列数据是远程数据
    if (!isEmpty(listItem[title][index].pk_nrna)) {
      listItem[title][index].dr = 1
      let bodys = isEmpty(deletes.title) ? [] : deletes.title
      bodys.push(listItem[title][index])
      deletes[title] = bodys
    }
    //删除
    listItem[title].splice(index, 1)
    dataSource.forEach(item => {
      if (!isEmpty(item[title])) {
        item[title].splice(index, 1)
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
        selectIndex = -1
        Toast.info('暂无数据！', 1)
      } else {
        selectIndex = index
        selectCode = code
        this.setState({ showSelect: true, selectData: value })
      }
    } else {
      const { dataSource } = this.state
      dataSource.forEach(item => {
        if (item.card_head !== undefined) {
          item.card_head[index].value = value
        }
      })
      listItem.card_head[code] = value
      this.setState({ dataSource })
      store.dispatch(addTodo('SET_DETAIL_DataSource', dataSource))
      store.dispatch(addTodo('SET_DETAIL_BaseDataSource', listItem))
    }
  }

  //----------------------------------------Select----------------------------------------
  onSelectResultCallBack(item) {
    const { listItem } = this.props
    const { dataSource } = this.state
    dataSource.forEach(v => {
      let temp = v.card_head
      if (temp !== undefined) {
        temp[selectIndex].value = item
      }
    })
    listItem.card_head[selectCode] = item.code
    this.setState({ dataSource, showSelect: false })
    store.dispatch(addTodo('SET_DETAIL_DataSource', dataSource))
    store.dispatch(addTodo('SET_DETAIL_BaseDataSource', listItem))
  }

  //----------------------------------------Alert----------------------------------------//
  /**
   * 
   * @param {审批意见} checkValue 
   * @param {审批内容} content 
   * @param {选中项目} pick 
   */
  onAlertClickSubmit = (checkValue, content, pick) => {
    const { listItem } = this.props
    this.setState({ showAlert: false })
    const { cuserid } = this.props
    let pk = listItem.card_head.pk_nrna
    let action = 'approve'
    //审批状态
    let approve = ''
    //审批意见
    let opinion = content
    //改派，加签人
    let rgman = ''
    //驳回流程
    let rejectActivity = ''
    switch (checkValue) {
      case '批准':
        approve = 'Y'
        break
      case '不批准':
        approve = 'N'
        break
      case '驳回':
        approve = 'R'
        //查流程
        rejectActivity = pick.value === undefined ? '' : pick.value
        break
      case '改派':
        approve = 'T'
        rgman = pick.value === undefined ? '' : pick.value
        break
      case '加签':
        approve = 'A'
        rgman = pick.value === undefined ? '' : pick.value
        break
      default:
        break
    }
    let data = { pk, cuserid, action, approve, opinion, rgman, rejectActivity }
    getZPXQData(data).then(result => {
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