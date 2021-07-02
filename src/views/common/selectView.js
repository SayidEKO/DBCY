import Base from "../base";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { List, Radio } from "antd-mobile";

import store, { addTodo } from "../../store/store";

const RadioItem = Radio.RadioItem

const options = [
  { id: 'chocolate1', name: 'Chocolate' },
  { id: 'strawberry1', name: 'Strawberry' },
  { id: 'vanilla1', name: '信息管理科' },
];

class SelectView extends Base {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    let item = this.props.location.state.item
    return (
      <div>
        <List>
          {options.map(option => (
            <RadioItem
              key={option.id}
              checked={item !== undefined && item.id === option.id ? true : false}
              onChange={() => this.callback(option)}>
              {option.name}
            </RadioItem>
          ))}
        </List>
      </div>
    )
  }

  callback(item) {
    const { dataSource } = this.props
    let parentIndex = this.props.location.state.parentIndex
    let childIndex = this.props.location.state.childIndex
    let child = dataSource[parentIndex]
    for (let key in child) {
      child[key][childIndex].value = item
    }
    store.dispatch(addTodo('SET_DETAIL_DATASOURCE', dataSource))
    this.props.history.goBack();
  }
}

//映射函数(绑定属性在porps)
const mapStateToProps = state => {
  return {
    dataSource: state.detailModule.dataSource
  }
}

export default connect(mapStateToProps)(withRouter(SelectView))