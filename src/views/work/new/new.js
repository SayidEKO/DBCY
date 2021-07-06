//新增页面
import Base from '../../base';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Toast } from 'antd-mobile'

import EditView from '../../../components/editView'
import TabbarButton from '../../../components/tabbarButton'
import Table from '../../../components/table'

import { getTemplate, getZPXQData } from '../../../request/api'
import store, { addTodo } from '../../../store/store';
import { isEmpty, getValue } from '../../../utils/utils';

//存表体模板
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
    getTemplate([{ funcode: this.props.location.state.funcode_detail, areacode_str }]).then(result => {
      if (result.VALUES.length !== 0) {
        let dataSource = []
        result.VALUES.forEach(template => {
          for (let key in template) {
            if (key === 'card_head') {
              //数据
              dataSource.push(template)
            } else {
              //新增是没有表体数据，只加模版
              templatesource.push(template)
              dataSource.push({[key]: []})
            }
          }
        })
        this.setState({ dataSource })
        store.dispatch(addTodo('SET_DETAIL_DataSource', dataSource))
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
    getZPXQData({ action: 'add', head, bodys }).then(result => {
      console.log(result);
      Toast.success(result.MESSAGE, 1, () => {
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
      for(let key in item) {
        if(key === title) {
          item[key].splice(index, 1)
        }
      }
    })
    store.dispatch(addTodo('SET_DETAIL_DataSource', dataSource))
    this.setState({dataSource})
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
                          define={item.define1}
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