/**
 * 列表页面
 */
import Base from "../base";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Tabs, Badge, ListView, PullToRefresh, DatePicker, Checkbox, Toast } from "antd-mobile";

import store, { addTodo } from "../../store/store";

import RingMneus from "../../components/ringMenus";
import TabbarButton from "../../components/tabbarButton";

import { getTemplate, getZPXQData } from "../../request/api";

import { router2detail, router2new } from "../../utils/routers";
import { getValue } from "../../utils/utils";
import WorkTagListItem from "../../components/workTagListItem";

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
let template = {}
//原数据
let baseData = []

class WorkTagList extends Base {

  constructor(props) {
    super(props)
    const listData = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 });
    this.state = {
      height: document.documentElement.clientHeight,
      //数据源
      listData,
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

  //初始化多选状态下的按钮
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
              sectorMenuItemFunctions={[this.save, this.cancel]} />
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
              sectorMenuItemFunctions={[this.save, this.cancel]} />
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
              sectorMenuItemFunctions={[this.save, this.save, this.cancel]} />
          </div>
        )
      default:
        break;
    }
  }

  //保存相关
  save = (title) => {
    const { cuserid } = this.props
    const { listData } = this.state
    let selectPK = [], action = ''

    listData._dataBlob.s1.forEach(v => {
      if (v.checked) {
        selectPK.push(v.pk)
      }
    })

    if (selectPK.length === 0) {
      Toast.fail('请勾选后再操作！', 1)
      return
    } else {
      Toast.loading('请稍后...', 0)
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

      default:
        break;
    }

    getZPXQData({ action, pk: selectPK[0], cuserid }).then(result => {
      Toast.success(result.data.message, 1)
      //filter方法筛选数组符合条件的留下
      let newData = JSON.parse(JSON.stringify(listData._dataBlob.s1)).filter(item => !item.checked)
      this.setState({
        listData: listData.cloneWithRows(newData),
        empty: newData.length > 0 ? false : true,
        multiSelect: false
      })
    })
  }

  //多选取消
  cancel = () => {
    const { listData } = this.state
    let newData = JSON.parse(JSON.stringify(listData._dataBlob.s1))
    newData.forEach(element => {
      element.checked = false
    });
    this.setState({
      listData: listData.cloneWithRows(newData),
      multiSelect: false
    })
  }

  //菜单点击事件
  onRingMneusClick = (title) => {
    const { listData } = this.state
    switch (title) {
      case '新增':
        store.dispatch(addTodo('SET_DETAIL_DataSource', []))
        router2new(this, this.props.location.state)
        break;
      case '编辑':
        if (listData._dataBlob.s1.length > 0) {
          let newData = JSON.parse(JSON.stringify(listData._dataBlob.s1))
          this.setState({
            multiSelect: !this.state.multiSelect,
            listData: listData.cloneWithRows(newData)
          })
        }
        break;
      case '筛选':
        this.setState({ search: !this.state.search })
        break;

      default:
        break;
    }
  }

  //下拉刷新
  pullToRefresh() {
    return (
      <PullToRefresh refreshing={this.state.refreshing} onRefresh={() => {
        this.state.listData = this.state.listData.cloneWithRows([])
        this.getData(_page = 0)
      }} />
    )
  }

  //上拉加载
  onEndReached = () => {
    //没有数据，多选状态下, 空数据状态下禁止加载更多
    if (!hasMore || this.state.multiSelect || this.state.empty) {
      return;
    }
    this.getData(++_page)
  }

  //页脚
  foot = () => {
    return (
      <div style={{ padding: 10, textAlign: 'center' }}>{this.state.isLoading ? '正在加载...' : '已经到底了'}</div>
    )
  }

  //条目点击
  onItemClick(index) {
    const { multiSelect, listData } = this.state
    if (multiSelect) {
      //多选
      let newData = JSON.parse(JSON.stringify(listData._dataBlob.s1));
      newData[index].checked = !newData[index].checked;
      this.setState({ listData: listData.cloneWithRows(newData) })
    } else {
      //非多选跳转详情
      let tableInfo = this.props.location.state
      tableInfo.edit = this.props.flag === 0 ? true : false
      tableInfo.item = baseData[index]
      store.dispatch(addTodo('SET_DETAIL_DataSource', []))
      router2detail(this, tableInfo)
    }
  }

  //获取数据
  getData(page = 0) {
    const { cuserid, pk_group, pk_org, flag } = this.props
    const { listData } = this.state
    let data = [], number = 10
    if (listData._dataBlob !== null) {
      data = listData._dataBlob.s1
    }

    let paramsData = { action: 'index_query', cuserid, pk_group, pk_org, state: flag }
    getZPXQData(paramsData).then(result => {
      baseData = result.VALUES
      baseData.forEach(v => {
        let head = v.card_head
        let bodys = v.card_body
        //复制模版
        let temp = JSON.parse(JSON.stringify(template))

        if (head !== undefined) {
          //遍历表头设值
          for (let key in head) {
            temp.card_head.forEach(v => {
              if (v.code === key) {
                v.value = head[key]
              }
            })
          }
        }

        if (bodys !== undefined) {
          //遍历表体设值
          bodys.forEach(body => {
            for (let key in body) {
              temp.card_body.forEach(v => {
                if (v.code === key) {
                  v.value = body[key]
                }
              })
            }
          })
        }
        //重新组装的数据
        let item = {}
        //添加选中状态
        item.checked = false
        //设置pk
        item.pk = head.pk_nrna
        item.data = temp
        data.push(item)
      })
      //返回数据条数小于请求数据条数表示没有更多
      hasMore = result.VALUES.length < number ? false : true
      this.setState({
        listData: listData.cloneWithRows(data),
        refreshing: false,
        isLoading: false,
        empty: data.length > 0 ? false : true
      })
    })
  }

  componentDidMount() {
    this.state.height = this.state.height - ReactDOM.findDOMNode(this.tabs).offsetTop - 40
    let areacode_str = []
    //获取列表节点
    let funcode = this.props.location.state.funcode_list
    //获取表
    this.props.location.state.table.forEach(item => {
      areacode_str.push({ code: item })
    })
    getTemplate([{ funcode, areacode_str }]).then(result => {
      if (result.VALUES !== 0) {
        template.card_head = result.VALUES[0]['card_head']
        template.card_body = result.VALUES[1]['card_body']
      }
      this.getData(_page = 0)
    })
  }

  render() {
    const { search, height, multiSelect, listData, empty } = this.state
    const { flag, startTime, endTime } = this.props
    return (
      <div>
        <div style={{ display: multiSelect ? 'none' : 'flex', position: 'absolute', bottom: 20, right: 20, zIndex: 2 }}>
          <RingMneus
            sectorMenuItems={['新增', '编辑', '筛选']}
            closeMenus={multiSelect}
            sectorMenuItemFunctions={[this.onRingMneusClick, this.onRingMneusClick, this.onRingMneusClick]} />
        </div>
        <div style={{ display: search ? 'flex' : 'none', color: 'gray', padding: 10 }}>
          <div style={{ flex: 1, fontSize: 14 }}>
            <DatePicker
              mode="date"
              onChange={date => {
                store.dispatch(addTodo('SET_LIST_STARTTIME', date))
                this.setState({ listData: listData.cloneWithRows([]) })
                this.getData(_page = 0)
              }}>
              <div>开始时间:{startTime.toLocaleDateString()}</div>
            </DatePicker>
          </div>
          <div style={{ flex: 1, fontSize: 14, textAlign: 'right' }}>
            <DatePicker
              mode="date"
              onChange={date => {
                store.dispatch(addTodo('SET_LIST_ENDTIME', date))
                this.setState({ listData: listData.cloneWithRows([]) })
                this.getData(_page = 0)
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
            this.setState({ listData: listData.cloneWithRows([]) }, () => this.getData(_page = 0))
          }}>
          <div>
            <div
              onClick={() => this.getData(_page = 0)}
              style={{ height, alignItems: 'center', justifyContent: 'center', display: empty ? 'flex' : 'none' }}>
              暂无数据
            </div>
            <ListView
              pageSize={5}
              dataSource={listData}
              pullToRefresh={this.pullToRefresh()}
              onEndReached={this.onEndReached}
              renderFooter={(this.foot)}
              renderRow={(rowData, sectionID, rowID) =>
                <WorkTagListItem
                  itemData={rowData}
                  index={rowID}
                  multiSelect={multiSelect}
                  onItemClick={(index) => this.onItemClick(index)} />}
              style={{ height, fontSize: 14, display: empty ? 'none' : 'flex' }} />
          </div>
          <div>
            <div
              onClick={() => this.getData(_page = 0)}
              style={{ height, alignItems: 'center', justifyContent: 'center', display: empty ? 'flex' : 'none' }}>
              暂无数据
            </div>
            <ListView
              pageSize={5}
              dataSource={listData}
              pullToRefresh={this.pullToRefresh()}
              onEndReached={this.onEndReached}
              renderFooter={this.foot}
              renderRow={(rowData, sectionID, rowID) =>
                <WorkTagListItem
                  itemData={rowData}
                  index={rowID}
                  multiSelect={multiSelect}
                  onItemClick={(index) => this.onItemClick(index)} />}
              style={{ height, fontSize: 14, display: empty ? 'none' : 'flex' }} />
          </div>
          <div>
            <div
              onClick={() => this.getData(_page = 0)}
              style={{ height, alignItems: 'center', justifyContent: 'center', display: empty ? 'flex' : 'none' }}>
              暂无数据
            </div>
            <ListView
              pageSize={5}
              dataSource={listData}
              pullToRefresh={this.pullToRefresh()}
              onEndReached={this.onEndReached}
              renderFooter={this.foot}
              renderRow={(rowData, sectionID, rowID) =>
                <WorkTagListItem
                  itemData={rowData}
                  index={rowID}
                  multiSelect={multiSelect}
                  onItemClick={(index) => this.onItemClick(index)} />}
              style={{ height, fontSize: 14, display: empty ? 'none' : 'flex' }} />
          </div>
          <div>
            <div
              onClick={() => this.getData(_page = 0)}
              style={{ height, alignItems: 'center', justifyContent: 'center', display: empty ? 'flex' : 'none' }}>
              暂无数据
            </div>
            <ListView
              pageSize={5}
              dataSource={listData}
              pullToRefresh={this.pullToRefresh()}
              onEndReached={this.onEndReached}
              renderFooter={this.foot}
              renderRow={(rowData, sectionID, rowID) =>
                <WorkTagListItem
                  itemData={rowData}
                  index={rowID}
                  multiSelect={multiSelect}
                  onItemClick={(index) => this.onItemClick(index)} />}
              style={{ height, fontSize: 14, display: empty ? 'none' : 'flex' }} />
          </div>
        </Tabs>
        <div style={{ display: multiSelect ? 'flex' : 'none', position: 'fixed', bottom: 0, width: '100%' }}>
          {this.initMenus()}
        </div>
      </div >
    )
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