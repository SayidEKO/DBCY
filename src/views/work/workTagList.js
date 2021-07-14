/**
 * 列表页面
 */
import Base from "../base";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Tabs, Badge, ListView, PullToRefresh, DatePicker, Toast } from "antd-mobile";

import RingMneus from "../../components/ringMenus";
import TabbarButton from "../../components/tabbarButton";
import WorkTagListItem from "../../components/workTagListItem";

import store, { addTodo } from "../../store/store";

import { getTemplate, getZPXQData } from "../../request/api";

import { router2detail, router2new } from "../../utils/routers";
import { isEmpty } from "../../utils/utils";


const tabs = [
  { title: <Badge>待提交</Badge> },
  { title: <Badge>已提交</Badge> },
  { title: <Badge dot>待处理</Badge> },
  { title: <Badge>已处理</Badge> },
];

//页数
let _page = 0;
//是否还有数据
let hasMore = true;
//模版
let templateData = []
//原数据
let baseData = []

class WorkTagList extends Base {

  constructor(props) {
    super(props)
    const dataSource = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 });
    this.state = {
      height: document.documentElement.clientHeight,
      //数据源
      dataSource,
      //加载状态
      isLoading: true,
      //刷新状态
      refreshing: true,
      //多选状态
      multiSelect: false,
      //是否筛选
      search: false,
      //是否空数据提示
      empty: true,
    };
  }

  /**
   * 初始化模板
   * @returns 
   */
  initTemplate() {
    //获取列表节点
    let funcode = this.props.location.state.funcode_list
    let billtype = this.props.location.state.billtype
    getTemplate([{ funcode }], billtype).then(result => {
      if (!isEmpty(result.VALUES)) {
        templateData = result.VALUES
        //表排序
        templateData.sort((a, b) => { return a.yqpx - b.yqpx })
        this.getData(_page = 0)
      }
    })
  }

  /**
   * 获取数据
   * @param {页数} page 
   */
  getData(page) {
    const { cuserid, pk_group, pk_org, flag } = this.props
    const { dataSource } = this.state
    let data = [], number = 10
    //如果模板没有数据则获取模板
    if (isEmpty(templateData)) {
      this.initTemplate()
      return
    }

    if (dataSource._dataBlob !== null) {
      data = dataSource._dataBlob.s1
    }

    let params = { action: 'index_query', cuserid, pk_group, pk_org, state: flag }
    let billtype = this.props.location.state.billtype
    getZPXQData(params, billtype).then(result => {
      baseData = result.VALUES
      if (!isEmpty(baseData)) {
        //遍历每一条数据
        baseData.forEach(item => {
          let pk = ''
          //复制模版
          let template = JSON.parse(JSON.stringify(templateData))
          template.forEach(table => {
            //字段排序
            table.yqdata.sort((a, b) => { return a.position - b.position })
            if (table.yqpx === '1') {
              //遍历模版表头字段
              table.yqdata.forEach(word => {
                word.value = item[table.code][word.code]
              })
              pk = item[table.code].pk_nrna
            } else {
              //这里只取表体中的第一条数据用于展示
              let data = item[table.code][0]
              if (!isEmpty(data)) {
                table.yqdata.forEach(word => {
                  word.value = data[word.code]
                })
              }
            }
          })
          //重新组装的数据
          data.push({ pk, checked: false, data: template })
        })
        //返回数据条数小于请求数据条数表示没有更多
        hasMore = result.VALUES.length < number ? false : true
        this.setState({
          dataSource: dataSource.cloneWithRows(data),
          refreshing: false,
          isLoading: false,
          empty: data.length > 0 ? false : true
        })
      }
    })
  }

  componentDidMount() {
    this.state.height = this.state.height - ReactDOM.findDOMNode(this.tabs).offsetTop - 40
    this.initTemplate()
  }

  render() {
    const { search, height, multiSelect, dataSource, empty } = this.state
    const { flag, startTime, endTime } = this.props
    return (
      <div>
        <div style={{ display: multiSelect ? 'none' : 'flex', position: 'absolute', bottom: 20, right: 20, zIndex: 2 }}>
          <RingMneus
            sectorMenuItems={['新增', '编辑', '筛选']}
            closeMenus={multiSelect}
            onClickRightMenus={title => this.onClickRightMenus(title)} />
        </div>
        <div style={{ display: search ? 'flex' : 'none', color: 'gray', padding: 10 }}>
          <div style={{ flex: 1, fontSize: 14 }}>
            <DatePicker
              mode="date"
              onChange={date => {
                store.dispatch(addTodo('SET_LIST_STARTTIME', date))
                this.setState({ dataSource: dataSource.cloneWithRows([]) }, () => {
                  this.getData(_page = 0)
                })
              }}>
              <div>开始时间:{startTime.toLocaleDateString()}</div>
            </DatePicker>
          </div>
          <div style={{ flex: 1, fontSize: 14, textAlign: 'right' }}>
            <DatePicker
              mode="date"
              onChange={date => {
                store.dispatch(addTodo('SET_LIST_ENDTIME', date))
                this.setState({ dataSource: dataSource.cloneWithRows([]) }, () => {
                  this.getData(_page = 0)
                })
              }}>
              <div>结束时间:{endTime.toLocaleDateString()}</div>
            </DatePicker>
          </div>
        </div>
        <Tabs
          tabs={tabs}
          initialPage={flag}
          ref={el => this.tabs = el}
          onChange={(tab, index) => {
            store.dispatch(addTodo('SET_LIST_FLAG', index))
            this.setState({ dataSource: dataSource.cloneWithRows([]) }, () => this.getData(_page = 0))
          }}>
          {
            tabs.map((item, index) => {
              return (
                <div key={index} >
                  <div
                    onClick={() => this.getData(_page = 0)}
                    style={{ height, alignItems: 'center', justifyContent: 'center', display: empty ? 'flex' : 'none' }}>
                    暂无数据
                  </div>
                  <ListView
                    pageSize={5}
                    dataSource={dataSource}
                    pullToRefresh={this.pullToRefresh()}
                    onEndReached={this.onEndReached}
                    renderFooter={(this.foot)}
                    renderRow={this.rowItem}
                    style={{ height, display: empty ? 'none' : 'flex' }} />
                </div>
              )
            })
          }
        </Tabs>
        <div style={{ display: multiSelect ? 'flex' : 'none', position: 'fixed', bottom: 0, width: '100%' }}>
          {this.initMenus()}
        </div>
      </div >
    )
  }

  /**
   * 初始化多选状态下的按钮
   * @returns 
   */
  initMenus() {
    switch (this.props.flag) {
      case 0:
        return (
          <div style={{ width: '100%' }}>
            <TabbarButton
              sectorMenuItems={['删除', '取消']}
              style={[
                { flex: 1, padding: 10, borderTopLeftRadius: 10, borderBottomLeftRadius: 10, background: '#1296db' },
                { flex: 1, padding: 10, borderTopRightRadius: 10, borderBottomRightRadius: 10, background: 'red' }
              ]}
              onClickTabbarButton={title => this.onClickTabbarButton(title)} />
          </div>
        )
      case 1:
        return (
          <div style={{ width: '100%' }}>
            <TabbarButton
              sectorMenuItems={['撤回', '取消']}
              style={[
                { flex: 1, padding: 10, borderTopLeftRadius: 10, borderBottomLeftRadius: 10, background: '#1296db' },
                { flex: 1, padding: 10, borderTopRightRadius: 10, borderBottomRightRadius: 10, background: 'red' }
              ]}
              onClickTabbarButton={title => this.onClickTabbarButton(title)} />
          </div>
        )
      case 2:
        return (
          <div style={{ width: '100%' }}>
            <TabbarButton
              sectorMenuItems={['审批', '驳回', '取消']}
              style={[
                { flex: 1, padding: 10, borderTopLeftRadius: 10, borderBottomLeftRadius: 10, background: '#1296db' },
                { flex: 1, padding: 10, background: 'blue' },
                { flex: 1, padding: 10, borderTopRightRadius: 10, borderBottomRightRadius: 10, background: 'red' }
              ]}
              onClickTabbarButton={title => this.onClickTabbarButton(title)} />
          </div>
        )
      default:
        break;
    }
  }

  /**
   * 底部按钮点击事件
   * @param {*} title 
   * @returns 
   */
  onClickTabbarButton(title) {
    const { cuserid } = this.props
    const { dataSource } = this.state
    let selectPK = [], action = ''
    let billtype = this.props.location.state.billtype

    dataSource._dataBlob.s1.forEach(v => {
      if (v.checked) {
        selectPK.push(v.pk)
      }
    })

    if (selectPK.length === 0 && title !== '取消') {
      Toast.fail('请勾选后再操作！', 1)
      return
    }

    switch (title) {
      case '删除':
        action = 'delete'
        break;
      case '撤回':
        action = 'unapprove'
        break;
      case '审批':
        action = 'approve'
        break;
      case '驳回':
        action = 'unapprove'
        break;
      case '取消':
        let newData = JSON.parse(JSON.stringify(dataSource._dataBlob.s1))
        newData.forEach(element => element.checked = false);
        this.setState({ dataSource: dataSource.cloneWithRows(newData), multiSelect: false })
        return
      default:
        break;
    }

    getZPXQData({ action, pk: selectPK[0], cuserid }, billtype).then(result => {
      Toast.success(result.data.message, 1)
      //filter方法筛选数组符合条件的留下
      let newData = JSON.parse(JSON.stringify(dataSource._dataBlob.s1)).filter(item => !item.checked)
      this.setState({
        dataSource: dataSource.cloneWithRows(newData),
        empty: newData.length > 0 ? false : true,
        multiSelect: false
      })
    })
  }

  /**
   * 菜单点击事件
   * @param {*} title 
   */
  onClickRightMenus(title) {
    const { dataSource } = this.state
    switch (title) {
      case '新增':
        store.dispatch(addTodo('SET_DETAIL_DataSource', []))
        router2new(this, this.props.location.state)
        break;
      case '编辑':
        if (dataSource._dataBlob.s1.length > 0) {
          this.setState({ multiSelect: !this.state.multiSelect })
        }
        break;
      case '筛选':
        this.setState({ search: !this.state.search })
        break;

      default:
        break;
    }
  }

  //----------------------------------------ListView----------------------------------------
  /**
   * 下拉刷新
   * @returns 
   */
  pullToRefresh() {
    return (
      <PullToRefresh refreshing={this.state.refreshing} onRefresh={() => {
        this.state.dataSource = this.state.dataSource.cloneWithRows([])
        this.getData(_page = 0)
      }} />
    )
  }

  /**
   * 上拉加载
   * @returns 
   */
  onEndReached = () => {
    //没有数据，多选状态下, 空数据状态下禁止加载更多
    if (!hasMore || this.state.multiSelect || this.state.empty) {
      return;
    }
    this.getData(++_page)
  }

  /**
   * 主体
   * @param {*} rowData 
   * @param {*} sectionID 
   * @param {*} rowID 
   * @returns 
   */
  rowItem = (rowData, sectionID, rowID) => {
    const { multiSelect } = this.state
    let billtype = this.props.location.state.billtype
    return (
      <WorkTagListItem
        itemData={rowData}
        index={rowID}
        billtype={billtype}
        multiSelect={multiSelect}
        onItemClick={(index) => this.onItemClick(index)} />)
  }

  /**
   * 页脚
   * @returns 
   */
  foot = () => {
    return (
      <div style={{ padding: 10, textAlign: 'center' }}>{this.state.isLoading ? '正在加载...' : '已经到底了'}</div>
    )
  }

  /**
   * 条目点击
   * @param {*} index 下标
   */
  onItemClick(index) {
    const { multiSelect, dataSource } = this.state
    if (multiSelect) {
      //多选
      let newData = JSON.parse(JSON.stringify(dataSource._dataBlob.s1));
      newData[index].checked = !newData[index].checked;
      this.setState({ dataSource: dataSource.cloneWithRows(newData) })
    } else {
      //非多选跳转详情
      let tableInfo = this.props.location.state
      store.dispatch(addTodo('SET_DETAIL_DataSource', []))
      store.dispatch(addTodo('SET_DETAIL_BaseDataSource', baseData[index]))
      router2detail(this, tableInfo)
    }
  }
}

//映射函数(绑定属性在porps)
const mapStateToProps = state => {
  return {
    flag: state.listModule.flag,
    startTime: state.listModule.startTime,
    endTime: state.listModule.endTime,

    cuserid: state.userModule.cuserid,
    pk_group: state.userModule.pk_group,
    pk_org: state.userModule.pk_org
  }
}

export default connect(mapStateToProps)(withRouter(WorkTagList))