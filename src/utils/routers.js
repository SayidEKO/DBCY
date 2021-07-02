
//工作台
export function router2work(that, content) {
  that.props.history.push('/work', content)
} 

export function router2add(that, content) {
  that.props.history.push('/add', content)
}
//个人主页
export function router2my(that, content) {
  that.props.history.push('/my', content)
}

//工作台
export function routerReplacr2work(that, content) {
  that.props.history.replace('/work', content)
} 

export function routerReplace2add(that, content) {
  that.props.history.replace('/add', content)
}
//个人主页
export function routerReplace2my(that, content) {
  that.props.history.replace('/my', content)
}




//工作台子页面
export function router2workTag(that, content) {
  that.props.history.push('/work/workTag', content)
} 

//列表
export function router2workTagList(that, content) {
  that.props.history.push('/work/workTag/workTagList', content)
} 

//新增
export function router2new(that, content) {
  that.props.history.push('/work/customList/new', content)
} 

//详情
export function router2detail(that, content) {
  that.props.history.push('/work/customList/detail', content)
} 

//表格界面
export function router2tableDetail(that, content) {
  that.props.history.push('/work/customList/tableDetail', content)
} 

//选项页面
export function router2selectView(that, content) {
  that.props.history.push('/selectView', content)
} 

//员工手册
export function router2workerbook(that, content) {
  that.props.history.push('/workerbook', content)
} 