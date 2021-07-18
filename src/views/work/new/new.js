//新增页面
import Base from '../../base';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Toast } from 'antd-mobile'

import Table from '../../../components/table'
import EditView from '../../../components/editView'
import TabbarButton from '../../../components/tabbarButton'
import SelectPerson from "../../../components/selectPerson";
import SelectDepartment from "../../../components/selectDepartment";

import store, { addTodo } from '../../../store/store';
import { getTemplate, getZPXQData } from '../../../request/api'
import { isEmpty, checkData, getFormatDate } from '../../../utils/utils';

//存表体模板
let templateData = {}
//记录选择字段的下标
let selectIndex = -1

class New extends Base {
  constructor(props) {
    super(props)
    this.state = {
      //高度
      height: document.documentElement.clientHeight,
      dataSource: [],
      //人员相关
      personData: [],
      departmentData: [],
      //部门相关
      showPerson: false,
      showDepartment: false,
    }
  }

  //获取详情模版
  getTemplate() {
    const { userName, cuserid } = this.props
    let bill = this.props.location.state.bill
    let billtype = this.props.location.state.billtype
    let funcode = this.props.location.state.funcode_detail.save

    getTemplate([{ funcode }], billtype).then(result => {
      if (!isEmpty(result.VALUES)) {
        let dataSource = result.VALUES
        //表排序
        dataSource.sort((a, b) => { return a.yqpx - b.yqpx })
        dataSource.forEach(template => {
          //字段排序
          template.yqdata.sort((a, b) => { return a.position - b.position })
          //yqpx=1表示表头
          if (template.yqpx === '1') {
            //初始化一些数据
            template.yqdata.forEach(word => {
              if (word.code === 'billmaker') {
                //制单人
                word.value = { value: cuserid, label: userName }
              } else if (word.code === 'billtype') {
                //单据类型
                word.value = { value: bill.code, label: bill.name }
              }
              //用于检查数据
              word.hasError = false
            })
          } else {
            template.yqdata.forEach(word => {
              //用于检查数据
              word.hasError = false
            })
            templateData[template.code] = JSON.parse(JSON.stringify(template))
            //新增是没有表体数据，只加模版
            template.yqdata = []
          }
        })
        this.setState({ dataSource })
        store.dispatch(addTodo('SET_DETAIL_DataSource', dataSource))
      }
    })
  }

  static getDerivedStateFromProps(props, state) {
    let temp = props.table
    if (!isEmpty(temp)) {
      props.propDataSource.forEach(item => {
        if (item.code === temp.code) {
          if (temp.index === undefined) {
            item.yqdata.push(temp.table)
          } else {
            item.yqdata[temp.index] = temp.table
          }
        }
      })
      //用完重置
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
    const { height, dataSource, showDepartment, departmentData, showPerson, personData } = this.state
    return (
      <div style={{ background: 'white' }}>
        <SelectDepartment
          show={showDepartment}
          dataSource={departmentData}
          onSelectResultCallBack={item => this.onSelectResultCallBack(item)}
          onClickMaskCallBack={() => this.setState({ showDepartment: false })} />
        <SelectPerson
          show={showPerson}
          dataSource={personData}
          onSelectResultCallBack={item => this.onSelectResultCallBack(item)}
          onClickMaskCallBack={() => this.setState({ showPerson: false })} />
        <div style={{ overflow: 'scroll', height }}>
          {
            dataSource.map((table, tableIndex) => {
              //yqpx=1是表头
              if (table.yqpx === '1') {
                return (
                  //遍历字段
                  table.yqdata.map((word, index) => {
                    return (
                      <EditView
                        key={index}
                        index={index}
                        item={word}
                        onEditCallBack={this.onEditCallBack} />
                    )
                  })
                )
              } else {
                return (
                  <Table
                    key={table.code}
                    title={table.yqname}
                    code={table.code}
                    tableSource={table.yqdata}
                    templateSource={templateData[table.code].yqdata}
                    onTableDeleteLisenter={this.onTableDeleteLisenter} />
                )
              }
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
      if (isEmpty(bodys)) {
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
        let billtype = this.props.location.state.billtype
        let data = { action: 'add', cuserid, head, bodys }

        getZPXQData(data, billtype).then(result => {
          console.log(result);
          Toast.success(result.MESSAGE, 1, () => {
            this.props.history.goBack()
          })
        })
      }
    } else {
      this.setState({ dataSource }, () => {
        Toast.fail('请检查后在提交！', 1, null, false)
      })
    }
  }

  //----------------------------------------Table----------------------------------------
  /**
   * 删除
   * @param {*} index 
   * @param {*} code 
   */
  onTableDeleteLisenter = (index, code) => {
    const { dataSource } = this.state
    dataSource.forEach(item => {
      if (item.code === code) {
        item.yqdata.splice(index, 1)
      }
    })
    store.dispatch(addTodo('SET_DETAIL_DataSource', dataSource))
    this.setState({ dataSource })
  }

  //----------------------------------------Edit----------------------------------------
  onEditCallBack = (index, value, code) => {
    if (Array.isArray(value)) {
      if (isEmpty(value)) {
        selectIndex = -1
        Toast.info('暂无数据！', 1)
      } else {
        selectIndex = index
        //选择人员单独处理
        if (code === 'person' || code === 'modifier' || code === 'creator') {
          this.setState({ showPerson: true, personData: value })
        } else {
          this.setState({ showDepartment: true, departmentData: value })
        }
      }
    } else {
      const { dataSource } = this.state
      dataSource.forEach(table => {
        if (table.yqpx === '1') {
          table.yqdata[index].value = value
        }
      })
      this.setState({ dataSource })
    }
  }

  //----------------------------------------Select----------------------------------------
  onSelectResultCallBack(item) {
    const { dataSource } = this.state
    dataSource.forEach(table => {
      if (table.yqpx === '1') {
        table.yqdata[selectIndex].value = item
      }
    })
    this.setState({ dataSource, showDepartment: false, showPerson: false })
  }
}

//映射函数(绑定属性在porps)
const mapStateToProps = state => {
  return {
    pk_org: state.userModule.pk_org,
    cuserid: state.userModule.cuserid,
    userName: state.userModule.user_name,

    flag: state.listModule.flag,
    table: state.detailModule.table,
    pk_group: state.userModule.pk_group,
    propDataSource: state.detailModule.dataSource,
  }
}

export default connect(mapStateToProps)(withRouter(New))