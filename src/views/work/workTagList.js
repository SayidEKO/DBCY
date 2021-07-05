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
 
 import { ncBaseDataSynServlet } from "../../request/api";
 
 import { router2detail, router2new } from "../../utils/routers";
 
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
       multi_select: false,
       //是否筛选
       search: false,
       //是否空数据提示
       empty: true,
     };
   }
 
   //初始化多选状态下按钮
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
     let selectPK = [], action = ''
 
     this.state.dataSource._dataBlob.s1.forEach(v => {
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
 
     ncBaseDataSynServlet(3, { action, pk: selectPK[0], cuserid }, 'ZPXQ').then(result => {
       Toast.success(result.data.message, 1)
       //filter方法筛选数组符合条件的留下
       let newData = JSON.parse(JSON.stringify(this.state.dataSource._dataBlob.s1)).filter(item => !item.checked)
       this.setState({
         dataSource: this.state.dataSource.cloneWithRows(newData),
         empty: newData.length > 0 ? false : true,
         multi_select: false
       })
     })
   }
 
   //多选取消
   cancel = () => {
     let newData = JSON.parse(JSON.stringify(this.state.dataSource._dataBlob.s1))
     newData.forEach(element => {
       element.checked = false
     });
     this.setState({
       dataSource: this.state.dataSource.cloneWithRows(newData),
       multi_select: false
     })
   }
 
   //菜单点击事件
   onRingMneusClick = (title) => {
     switch (title) {
       case '新增':
        store.dispatch(addTodo('SET_DETAIL_DataSource', []))
         router2new(this, this.props.location.state)
         break;
       case '编辑':
         if (this.state.dataSource._dataBlob.s1.length > 0) {
           let newData = JSON.parse(JSON.stringify(this.state.dataSource._dataBlob.s1))
           this.setState({
             multi_select: !this.state.multi_select,
             dataSource: this.state.dataSource.cloneWithRows(newData)
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
         this.state.dataSource = this.state.dataSource.cloneWithRows([])
         this.getData(_page = 0)
       }} />
     )
   }
 
   //上拉加载
   onEndReached = () => {
     //没有数据，多选状态下, 空数据状态下禁止加载更多
     if (!hasMore || this.state.multi_select || this.state.empty) {
       return;
     }
     this.getData(++_page)
   }
 
   //页脚
   foot = () => {
     return (
       <div style={{ padding: 10, textAlign: 'center' }}>
         {this.state.isLoading ? '正在加载...' : '已经到底了'}
       </div>
     )
   }
 
   //主体
   item = (rowData, sectionID, rowID) => {
     const { multi_select, dataSource } = this.state
     return (
       <div
         onClick={() => {
           //多选状态下禁止跳转
           if (!multi_select) {
             let tableInfo = this.props.location.state
             tableInfo.edit = this.props.flag === 0 ? true : false
             tableInfo.item = baseData[rowID]
             store.dispatch(addTodo('SET_DETAIL_DataSource', []))
             router2detail(this, tableInfo)
           }
           let newData = JSON.parse(JSON.stringify(dataSource._dataBlob.s1));
           newData[rowID].checked = !newData[rowID].checked;
           this.setState({ dataSource: dataSource.cloneWithRows(newData) })
         }}
         style={{ display: 'flex', alignItems: 'center', background: '#F5F5F9' }}>
 
         <div
           style={{
             display: 'flex',
             alignItems: 'center',
             margin: 5,
             padding: 5,
             width: '100%',
             background: 'white',
             borderRadius: 10
           }}>
           <Checkbox
             checked={rowData.checked}
             style={{ display: multi_select ? 'flex' : 'none', padding: 5 }} />
           <div>
             {
               rowData.data.card_head.map((item, index) => {
                 let value
                 if (typeof item.value == "object") {
                   value = item.value.name
                 } else {
                   value = item.value
                 }
                 return (
                   <div key={rowID + index} style={{ display: 'flex', fontSize: 12 }}>
                     <div style={{ padding: 5 }}>{item.label}:</div>
                     <div style={{ padding: 5, color: 'gray' }}>{value}</div>
                   </div>
                 )
               })
             }
             {
               rowData.data.card_body.map((item, index) => {
                 let value
                 if (typeof item.value == "object") {
                   value = item.value.name
                 } else {
                   value = item.value
                 }
                 return (
                   <div key={rowID + index} style={{ display: 'flex', fontSize: 12 }}>
                     <div style={{ padding: 5 }}>{item.label}:</div>
                     <div style={{ padding: 5, color: 'gray' }}>{value}</div>
                   </div>
                 )
               })
             }
           </div>
         </div>
       </div>
     );
   };
 
   getData(page = 0) {
     const { cuserid, pk_group, pk_org, flag } = this.props
     let data = [], number = 10
     if (this.state.dataSource._dataBlob !== null) {
       data = this.state.dataSource._dataBlob.s1
     }
 
     let paramsData = { action: 'index_query', cuserid, pk_group, pk_org, state: flag }
     ncBaseDataSynServlet(3, paramsData, 'ZPXQ').then(result => {
       baseData = result.VALUES
       result.VALUES.forEach(v => {
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
       // //返回数据条数小于请求数据条数表示没有更多
       hasMore = result.VALUES.length < number ? false : true
       this.setState({
         dataSource: this.state.dataSource.cloneWithRows(data),
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
     ncBaseDataSynServlet(1, [{ funcode, areacode_str }]).then(result => {
       if (result.VALUES !== 0) {
         template.card_head = result.VALUES[0]['card_head']
         template.card_body = result.VALUES[1]['card_body']
       }
       this.getData(_page = 0)
     })
   }
 
   render() {
     const { search, height, multi_select, dataSource, empty } = this.state
     const { flag, startTime, endTime } = this.props
     return (
       <div>
         <div style={{ display: multi_select ? 'none' : 'flex', position: 'absolute', bottom: 20, right: 20, zIndex: 2 }}>
           <RingMneus
             sectorMenuItems={['新增', '编辑', '筛选']}
             closeMenus={multi_select}
             sectorMenuItemFunctions={[this.onRingMneusClick, this.onRingMneusClick, this.onRingMneusClick]} />
         </div>
         <div style={{ display: search ? 'flex' : 'none', color: 'gray', padding: 10 }}>
           <div style={{ flex: 1, fontSize: 14 }}>
             <DatePicker mode="date" onChange={date => {
               store.dispatch(addTodo('SET_LIST_STARTTIME', date))
               this.setState({ dataSource: dataSource.cloneWithRows([]) })
               this.getData(_page = 0)
             }}>
               <div>开始时间:{startTime.toLocaleDateString()}</div>
             </DatePicker>
           </div>
           <div style={{ flex: 1, fontSize: 14, textAlign: 'right' }}>
             <DatePicker mode="date" onChange={date => {
               store.dispatch(addTodo('SET_LIST_ENDTIME', date))
               this.setState({ dataSource: dataSource.cloneWithRows([]) })
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
             this.setState({ dataSource: this.state.dataSource.cloneWithRows([]) }, ()=> {
               this.getData(_page = 0)
             })
           }}>
           <div>
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
               renderFooter={this.foot}
               renderRow={this.item}
               style={{ height, fontSize: 14, display: empty ? 'none' : 'flex' }}
               onScroll={() => { console.log('scroll'); }} />
           </div>
           <div>
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
               renderFooter={this.foot}
               renderRow={this.item}
               style={{ height, fontSize: 14, display: empty ? 'none' : 'flex' }}
               onScroll={() => { console.log('scroll'); }} />
           </div><div>
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
               renderFooter={this.foot}
               renderRow={this.item}
               style={{ height, fontSize: 14, display: empty ? 'none' : 'flex' }}
               onScroll={() => { console.log('scroll'); }} />
           </div><div>
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
               renderFooter={this.foot}
               renderRow={this.item}
               style={{ height, fontSize: 14, display: empty ? 'none' : 'flex' }}
               onScroll={() => { console.log('scroll'); }} />
           </div>
         </Tabs>
         <div style={{ display: multi_select ? 'flex' : 'none', position: 'fixed', bottom: 0, width: '100%' }}>
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