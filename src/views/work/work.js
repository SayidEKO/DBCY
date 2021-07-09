import Base from '../base';
import { withRouter } from "react-router-dom";

import { Grid, Toast } from 'antd-mobile';

import { router2workTag } from '../../utils/routers';

import { menus } from "../../config";

class Work extends Base {
  constructor(props) {
    super(props)
    this.state = {
      //分类数组
      categories: [],
      //是否展开
      open: false,
      height: 0
    }
    this.initMenus()
  }

  //加载分类
  initMenus() {
    this.state.categories = []
    for (var key in menus) {
      if (!this.state.open && this.state.categories.length === 8) {
        break
      }
      this.state.categories.push({
        icon: menus[key].icon,
        text: key,
        url: menus[key].url,
      })
    }
  }

  loadData = () => {
    Toast.loading('加载中...', 1, () => {
      Toast.success('加载完成!', 1);
    });
  }

  componentDidMount() {
    this.setState({
      height: document.getElementById('table').clientHeight + 25
    })
  }

  componentDidUpdate() {
    // 计算更新后head高度用于设置content的y坐标
    let height = document.getElementById('table').clientHeight + 25
    if (this.state.height !== height) {
      this.setState({ height })
    }
  }

  render() {
    return (
      <div /**最外层 整体可滑动 */ style={{ height: '100%', background: 'white' }}>
        <div /**head部分 */
          style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            background: 'white'
          }}>
          <div /**背景颜色 */
            style={{
              position: 'absolute',
              height: 130,
              width: '100%',
              background: '#1296db',
              borderBottomRightRadius: 20,
              borderBottomLeftRadius: 20
            }} />
          <div /**表格 */
            id='table'
            style={{
              position: 'absolute',
              width: '95%',
              marginTop: 20,
              padding: 2,
              textAlign: 'center',
              background: 'white',
              borderRadius: 5,
              boxShadow: '0px 0px 5px #000'
            }}>
            <Grid
              hasLine={false}
              data={this.state.categories}
              onClick={item => router2workTag(this, item.text)} />

            <img alt=''
              src={this.state.open ? require('../../assets/menus/up.png').default : require('../../assets/menus/down.png').default}
              style={{ height: 20, width: 25 }}
              onClick={() => {
                this.state.open = !this.state.open
                this.initMenus()
                this.setState({})
              }} />
          </div>
        </div>
        <div
          style={{
            width: '100%',
            height: '80%',
            display: 'flex',
            position: 'relative',
            top: this.state.height,
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            background: 'white'
          }}>
          <div>
            <img alt=''
              src={require('../../assets/menus/empty.png').default}
              style={{ height: 100, width: 100 }}
              onClick={this.loadData} />
            <div style={{ color: 'gray', fontSize: 16 }}>暂无数据</div>
          </div>
        </div>
      </div>
    )
  }
}


export default withRouter(Work)