export const menus = {
  人员管理: {
    url: '/work/people',
    icon: require('./assets/menus/people.png').default,
    child: [
      {
        //小标题
        title: '招聘需求申请',
        //表
        table: ['card_head', 'card_body'],
        //列表节点
        funcode_list: '99H10101_wx_list',
        //详情节点
        funcode_detail: { save: '99H10101_wx_bc', audit: '99H10101_wx_xq' },
        //单据类型
        bill_type: { name: '招聘需求申请', code: '0001ZZZZ29EAC07A857A' }
      },
      {
        title: '招聘信息',
        table: ['card_head', 'card_body'],
        funcode_list: '99H10101_wx_list',
        funcode_detail: '99H10101_wx_bc'
      },
      {
        title: '入职信息',
        table: ['card_head', 'card_body'],
        funcode_list: '99H10101_wx_list',
        funcode_detail: '99H10101_wx_bc'
      },
      {
        title: '人员合同管理',
        table: ['card_head', 'card_body'],
        funcode_list: '99H10101_wx_list',
        funcode_detail: '99H10101_wx_bc'
      },
      {
        title: '工勤序列入职转正考核',
        table: ['card_head', 'card_body'],
        funcode_list: '99H10101_wx_list',
        funcode_detail: '99H10101_wx_bc'
      },
      {
        title: '管理及专业序列入职转正考核',
        table: ['card_head', 'card_body'],
        funcode_list: '99H10101_wx_list',
        funcode_detail: '99H10101_wx_bc'
      },
      {
        title: '实习鉴定',
        table: ['card_head', 'card_body'],
        funcode_list: '99H10101_wx_list',
        funcode_detail: '99H10101_wx_bc'
      },
      {
        title: '晋升考核',
        table: ['card_head', 'card_body'],
        funcode_list: '99H10101_wx_list',
        funcode_detail: '99H10101_wx_bc'
      },
      {
        title: '异动申请',
        table: ['card_head', 'card_body'],
        funcode_list: '99H10101_wx_list',
        funcode_detail: '99H10101_wx_bc'
      },
      {
        title: '异动办理',
        table: ['card_head', 'card_body'],
        funcode_list: '99H10101_wx_list',
        funcode_detail: '99H10101_wx_bc'
      },
      {
        title: '管理及专业序列异动转正考核',
        table: ['card_head', 'card_body'],
        funcode_list: '99H10101_wx_list',
        funcode_detail: '99H10101_wx_bc'
      },
      {
        title: '离职申请',
        table: ['card_head', 'card_body'],
        funcode_list: '99H10101_wx_list',
        funcode_detail: '99H10101_wx_bc'
      },
      {
        title: '离职办理',
        table: ['card_head', 'card_body'],
        funcode_list: '99H10101_wx_list',
        funcode_detail: '99H10101_wx_bc'
      },
    ]
  },
  假勤管理: {
    url: '/work/holiday',
    icon: require('./assets/menus/holiday.png').default,
    child: [
      {
        title: '考勤记录',
        table: ['card_head', 'card_body'],
        funcode_list: '99H10101_wx_list',
        funcode_detail: '99H10101_wx_bc'
      },
      {
        title: '休假申请单',
        table: ['card_head', 'card_body'],
        funcode_list: '99H10101_wx_list',
        funcode_detail: '99H10101_wx_bc'
      },
      {
        title: '销假单',
        table: ['card_head', 'card_body'],
        funcode_list: '99H10101_wx_list',
        funcode_detail: '99H10101_wx_bc'
      },
      {
        title: '加班申请单',
        table: ['card_head', 'card_body'],
        funcode_list: '99H10101_wx_list',
        funcode_detail: '99H10101_wx_bc'
      },
      {
        title: '国内出差申请单',
        table: ['card_head', 'card_body'],
        funcode_list: '99H10101_wx_list',
        funcode_detail: '99H10101_wx_bc'
      },
      {
        title: '国外出差申请单',
        table: ['card_head', 'card_body'],
        funcode_list: '99H10101_wx_list',
        funcode_detail: '99H10101_wx_bc'
      },
      {
        title: '销差单',
        table: ['card_head', 'card_body'],
        funcode_list: '99H10101_wx_list',
        funcode_detail: '99H10101_wx_bc'
      },
    ]
  },
  绩效管理: {
    url: '/work/achievement',
    icon: require('./assets/menus/achievement.png').default,
    title: [
      '考核量表计划',
      '考核量表传递',
      '考核量表实绩评分',
      '面谈记录',
      '绩效申诉',
    ]
  },
  培训管理: {
    url: '/work/train',
    icon: require('./assets/menus/train.png').default,
    title: [
      '部门级培训计划需求申请',
      '培训计划',
      '培训申请维护',
      '公司级培训计划开班通知',
      '培训签到考核表',
      '培训效果评估',
      '培训答题',
      '培训信息汇总'
    ]
  },

  薪酬管理: {
    url: '/work/money',
    icon: require('./assets/menus/money.png').default,
    title: []
  },
  总务管理: {
    url: '/work/all',
    icon: require('./assets/menus/all.png').default,
    title: [
      '会议申请单',
      '公文管理',
      '车辆申请单',
      '用车申请单'
    ]
  },
  资产管理: {
    url: '/work/property',
    icon: require('./assets/menus/property.png').default,
    title: [
      '借用单维护',
      '领用单维护',
      '归还处理',
      '资产变动',
      '资产处置',
      '资产维修'
    ]
  },
  供应链管理: {
    url: '/work/supplychain',
    icon: require('./assets/menus/supplychain.png').default,
    title: [
      '请购单',
      '采购订单',
      '采购入库单',
      '材料出库单',
      '采购发票',
      '采购应付单',
      '付款申请单',
      '销售订单',
      '发货单',
      '销售出库单',
      '销售发票',
      '应收单',
      '收款单',
      '开票申请单'
    ]
  },
  费用报销: {
    url: '/work/cost',
    icon: require('./assets/menus/cost.png').default,
    title: [
      '差旅费报销单',
      '预提报销单',
      '费用报销单',
      '费用预提单',
      '付款申请单'
    ]
  },
  个人中心: {
    url: '/work/personal',
    icon: require('./assets/menus/personal.png').default,
    title: [
      '我的证件',
      '我的假勤',
      '入异离查询',
      '工资条查询',
      '证明申请单',
      '社保查询'
    ]
  },
  基本档案: {
    url: '/work/basefiles',
    icon: require('./assets/menus/basefiles.png').default,
    title: [
      '岗位申请单',
      '会议档案室',
      '车辆档案',
      '岗位变更申请'
    ]
  }
}

//颜色
export const color_backgroup = '#F5F5F9'

export const color_button_blue = '#418CE2'
export const color_button_gray = 'gray'

export const color_text_gray = '#888'
export const color_text_black = '#fffff'
export const color_text_blue = '#3B3568'
export const color_text_red = 'red'


export const color_line_gray = '#3B3568'

export const font_text_title = 10
export const font_table_title = 16

//环境切换
export const DEBUG = true