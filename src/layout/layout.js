import React, { Component } from 'react'
import { TabBar } from 'antd-mobile'
import { withRouter } from 'react-router-dom'

import work_unselect from '../assets/tab/work_unselect.png'
import work_select from '../assets/tab/work_select.png'
import add_unselect from '../assets/tab/add_unselect.png'
import add_select from '../assets/tab/add_select.png'
import my_unselect from '../assets/tab/my_unselect.png'
import my_select from '../assets/tab/my_select.png'

import { routerReplace2my, routerReplace2add, routerReplacr2work } from "../utils/routers";

const Item = TabBar.Item

export class Layout extends Component {
  render() {
    return (
      <TabBar
        barTintColor="white"
        tintColor="#33A3F4"
        unselectedTintColor="#949494"
        //预加载数
        prerenderingSiblingsNumber='0'>
        <Item
          title="待处理"
          key="Work"
          badge={1}
          icon={<img src={work_unselect} alt='' style={{ height: '20px', width: '20px' }} />}
          selectedIcon={<img src={work_select} alt='' style={{ height: '20px', width: '20px' }} />}
          selected={this.props.location.pathname === '/work'}
          onPress={() => { routerReplacr2work(this) }} >
          {this.props.children}
        </Item>
        <Item
          key="Add"
          icon={<img src={add_unselect} alt='' style={{ height: '30px', width: '30px' }} />}
          selectedIcon={<img src={add_select} alt='' style={{ height: '30px', width: '30px' }} />}
          selected={this.props.location.pathname === '/add'}
          onPress={() => { routerReplace2add(this) }}>
          {this.props.children}
        </Item>
        <Item
          title={this.props.loginState ? '我的' : '未登录'}
          key="My"
          dot
          icon={<img src={my_unselect} alt='' style={{ height: '20px', width: '20px' }} />}
          selectedIcon={<img src={my_select} alt='' style={{ height: '20px', width: '20px' }} />}
          selected={['/login', '/my'].includes(this.props.location.pathname)}
          onPress={() => { routerReplace2my(this) }}>
          {this.props.children}
        </Item>
      </TabBar>
    )
  }
}

export default withRouter(Layout)
