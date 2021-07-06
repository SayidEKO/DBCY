//详情页面
import Base from '../../base';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Toast } from 'antd-mobile'

import store, { addTodo } from '../../../store/store';

import EditView from '../../../components/editView'
import TabbarButton from '../../../components/tabbarButton'
import Table from '../../../components/table'
import Alert from '../../../components/alert'

import { getTemplate, getZPXQData } from '../../../request/api'
import { getValue, isEmpty } from '../../../utils/utils';


let listItem
//存表体模板
let templatesource = []
//用于记录表名
let tableName = ''
//记录表的下标
let tableIndex = -1
//需要删除的远程数据
let deletes = []

class Detail extends Base {

  constructor(props) {
    super(props)
    this.state = {
      //高度
      height: document.documentElement.clientHeight,
      dataSource: [],
      showAlert: false,
    }
    //列表选中数据的详情
    listItem = props.location.state.item

  }

  //获取详情模版
  getTemplate() {
    let areacode_str = []
    //获取表
    this.props.location.state.table.forEach(item => {
      areacode_str.push({ code: item })
    })
    let data = [{ funcode: this.props.location.state.funcode_detail, areacode_str }]
    getTemplate(data).then(result => {
      let dataSource = []
      if (result.VALUES.length !== 0) {
        result.VALUES.forEach(template => {
          // 遍历模板
          for (let templateKey in template) {
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

  //初始底部按钮
  initMenu() {
    switch (this.props.flag) {
      case 0:
        return (
          <div id='action' style={{ position: 'fixed', bottom: 0, width: '100%' }}>
            <TabbarButton
              sectorMenuItems={['提交']}
              style={[{ flex: 1, padding: 10, borderRadius: 10, background: '#1296db' }]}
              sectorMenuItemFunctions={[(this.onClick)]} />
          </div>
        )
      case 1:
        return (
          <div id='action' style={{ position: 'fixed', bottom: 0, width: '100%', }}>
            <TabbarButton
              sectorMenuItems={['撤回']}
              style={[{ flex: 1, padding: 10, borderRadius: 10, background: 'red' }]}
              sectorMenuItemFunctions={[this.onClick]} />
          </div>
        )
      case 2:
        return (
          <div id='action' style={{ display: 'flex', position: 'fixed', bottom: 0, width: '100%', }}>
            <TabbarButton
              sectorMenuItems={['审批']}
              style={[{ flex: 1, padding: 10, borderRadius: 10, background: '#1296db' }]}
              sectorMenuItemFunctions={[this.onClick]} />

          </div>
        )
      case 3:
        return (<div id='action' />)
      default:
        break;
    }
  }

  //底部按钮响应事件
  onClick = (title) => {
    const { cuserid } = this.props
    let data = {}

    switch (title) {
      case '撤回':
        data = { action: 'unapprove', pk: listItem.card_head['pk_nrna'], cuserid }
        getZPXQData(data).then(result => {
          Toast.success(result.MESSAGE, 1, () => {
            this.props.history.goBack()
          })
        })
        break;
      case '提交':
        data = { action: 'sendapprove', pk: listItem.card_head['pk_nrna'], cuserid }
        this.save().then(result => {
          getZPXQData(data).then(result => {
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

  onEditCallBack = (index, value) => {
    const { dataSource } = this.state
    dataSource.forEach(item => {
      for (let key in item) {
        if (key === 'card_head') {
          item[key][index].value = value
        }
      }
    })
    store.dispatch(addTodo('SET_DETAIL_DataSource', dataSource))
    this.setState({ dataSource })
  }

  //新增
  onTableAddLisenter = (value) => {
    tableName = value
  }

  //编辑
  onTableEditLisenter = (index, value) => {
    tableIndex = index
    tableName = value
  }

  //删除
  onTableDeleteLisenter = (index, title) => {
    const { dataSource } = this.state
    dataSource.forEach(item => {
      for (let key in item) {
        //找到对应的表
        if (key === title) {
          //默认不是本地新增数据
          let isAdd = false
          //遍历表里的字段
          item[key][index].forEach(v => {
            //查看是否有isAdd，有则表示此条数据是本地新增可以直接删除，否则需要单独存下来
            if (v.isAdd) {
              isAdd = true
            }
          })
          if (!isAdd) {
            //远程数据的删除记录下来
            item[title][index].push({ dr: 1 })
            let bodys = deletes[title] === undefined ? [] : deletes[title]
            bodys.push(item[title][index])
            deletes.push({ [title]: bodys })
          }
          item[title].splice(index, 1)
        }
      }
    })
    store.dispatch(addTodo('SET_DETAIL_DataSource', dataSource))
    this.setState({ dataSource })
  }

  /**
   * 
   * @param {审批意见} checkValue 
   * @param {审批内容} content 
   * @param {改派、加签人} checkUser 
   */
  onAlertClickSubmit = (checkValue, content, checkUser) => {
    this.setState({ showAlert: false })
    const { cuserid } = this.props
    let pk = listItem.card_head['pk_nrna']
    let action = 'approve'
    //审批状态
    let approve = ''
    //审批意见
    let opinion = content
    //改派，加签人
    let rgman = checkUser.value === undefined ? '' : checkUser.value
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
        rejectActivity=''
        break
      case '改派':
        approve = 'T'
        break
      case '加签':
        approve = 'A'
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

  onAlertClickCancel = () => {
    this.setState({ showAlert: false })
  }

  //保存方法
  async save() {
    // const { dataSource } = this.state
    // let head = {}, bodys = []

    // card_head.forEach(v => {
    //   let value = getValue(v)
    //   //没有值则不传该字段,billno
    //   if (value !== '' && v.code !== 'billno') {
    //     head[v.code] = value
    //   }
    // })
    // head['pk_nrna'] = item.card_head['pk_nrna']
    // card_body.forEach(body => {
    //   let item = {}
    //   body.forEach(v => {
    //     let value = getValue(v)
    //     //没有值则不传该字段
    //     if (value !== '') {
    //       item[v.code] = value
    //     }
    //   })
    //   bodys.push(item)
    // })
    // console.log(head);

    // getZPXQData({ action: 'add', head, bodys }).then(result => {
    //   console.log(result);
    // })
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

    if (dataSource.length === 0) {
      this.getTemplate()
    }
  }

  render() {
    const { height, dataSource, showAlert } = this.state
    return (
      <div style={{ position: 'relative' }}>
        <Alert
          showAlert={showAlert}
          onAlertClickSubmit={this.onAlertClickSubmit}
          onAlertClickCancel={this.onAlertClickCancel} />
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
                          // edit={location.state.edit}
                          edit={true}
                          title={item.label}
                          value={getValue(item)}
                          //参照编码
                          define={item.define1}
                          type={item.itemtype}
                          hiddenLine={items[key].length - 1 === index}
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
}

//映射函数(绑定属性在porps)
const mapStateToProps = state => {
  return {
    cuserid: state.userModule.cuserid,
    flag: state.listModule.flag,
    propDataSource: state.detailModule.dataSource,
    table: state.detailModule.table
  }
}

export default connect(mapStateToProps)(withRouter(Detail))