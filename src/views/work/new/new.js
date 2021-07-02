//新增页面
import Base from '../../base';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Toast } from 'antd-mobile'

import EditView from '../../../components/editView'
import TabbarButton from '../../../components/tabbarButton'
import Table from '../../../components/table'

import { ncBaseDataSynServlet } from '../../../request/api'
import store, { addTodo } from '../../../store/store';
import { isEmpty, getValue } from '../../../utils/utils';

let templatesource = []
//用于记录表名
let tableName = ''
//记录表的下标
let tableIndex = -1

class New extends Base {
  constructor(props) {
    super(props)
    this.state = {
      //高度
      height: document.documentElement.clientHeight,
      dataSource: []
    }
  }

  //获取详情模版
  getTemplate() {
    let areacode_str = []
    let tables = this.props.location.state.table
    //获取表
    tables.forEach(item => {
      areacode_str.push({ code: item })
    })
    ncBaseDataSynServlet(1, [{ funcode: this.props.location.state.funcode_detail, areacode_str }]).then(result => {
      if (result.VALUES.length !== 0) {
        let temp = []
        result.VALUES.forEach(data => {
          for (let key in data) {
            if (key === 'card_head') {
              temp.push(data)
            } else {
              let body = []
              // body.push(data[key])
              templatesource.push(data[key])
              temp.push({ [key]: body })
            }
          }
        })
        this.setState({ dataSource: temp })
        store.dispatch(addTodo('SET_DETAIL_DataSource', temp))
      }
    })
  }


  onSave = () => {
    const { dataSource } = this.state
    let head = {}, bodys = []

    dataSource.forEach(data => {
      for (let key in data) {
        if (key === 'card_head') {
          data[key].forEach(item => {
            let value = getValue(item)
            //没有值则不传该字段,billno
            if (value !== '' && item.code !== 'billno') {
              head[item.code] = value
            }
          })
        } else {
          data[key].forEach(items => {
            let temp = {}
            items.forEach(item => {
              let value = getValue(item)
              //没有值则不传该字段,billno
              if (value !== '' && item.code !== 'billno') {
                temp[item.code] = value
              }
            })
            if (JSON.stringify(temp) !== "{}") {
              bodys.push(temp)
            }

          })
        }
      }
    })
    head.pk_group = this.props.pk_group
    head.pk_org = this.props.pk_org
    ncBaseDataSynServlet(3, { action: 'add', head, bodys }, 'ZPXQ').then(result => {
      console.log(result);
      Toast.success(result.code, 1, () => {
        this.props.history.goBack()
      })
    })
  }

  //editview回调事件
  onEditCallBack = (index, value) => {
    const { dataSource } = this.state
    dataSource[0].card_head[index].value = value
    this.setState({ dataSource })
    console.log(dataSource);
  }

  onTableAddLisenter = (value) => {
    tableName = value
  }

  //删除
  onTableDeleteLisenter = (index, title) => {

  }

  //编辑
  onTableEditLisenter = (index, value) => {
    tableIndex = index
    tableName = value
  }

  static getDerivedStateFromProps(props, state) {
    let table = props.table
    if (!isEmpty(table)) {
      props.propDataSource.forEach(item => {
        for(let key in item) {
          if (key === tableName) {
            if (tableIndex === -1) {
              item[tableName].push(table)
            }else {
              item[tableName][tableIndex] = table
            }
          }
        }
      })
      store.dispatch(addTodo('SET_DETAIL_DataSource', props.propDataSource))
      //用完重置
      tableName = ''
      tableIndex = -1
      store.dispatch(addTodo('SET_DETAIL_Table', null))
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
    const { height, dataSource } = this.state
    return (
      <div>
        <div style={{ background: 'white', overflow: 'scroll', height }}>
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
                          edit={true}
                          title={item.label}
                          value={getValue(item)}
                          type={item.itemtype}
                          hiddenLine={tags[key].length - 1 === index}
                          onEditCallBack={this.onEditCallBack} />
                      )
                    })
                  )
                } else {
                  return (
                    <Table
                      key={key}
                      title={key}
                      templateSource={templatesource[tagIndex - 1]}
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
            sectorMenuItemFunctions={[this.onSave]} />
        </div>
      </div>
    )
  }
}

//映射函数(绑定属性在porps)
const mapStateToProps = state => {
  return {
    pk_group: state.userModule.pk_group,
    pk_org: state.userModule.pk_org,
    flag: state.listModule.flag,
    propDataSource: state.detailModule.dataSource,
    table: state.detailModule.table,
  }
}

export default connect(mapStateToProps)(withRouter(New))