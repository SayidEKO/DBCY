import Base from '../base'
import { withRouter } from "react-router-dom";

import EditView from '../../components/editView'
import TabbarButton from '../../components/tabbarButton'
import SelectView from "../../components/selectView";

import store, { addTodo } from '../../store/store';

import { Toast } from 'antd-mobile';

//记录选择字段的下标
let selectIndex = -1

class TableDetail extends Base {
    constructor(props) {
        super(props)
        this.state = {
            table: props.location.state.table,
            showSelect: false,
            selectData: []
        }
    }

    render() {
        const { table, showSelect, selectData } = this.state
        return (
            <div style={{ background: 'white' }}>
                <SelectView
                    show={showSelect}
                    dataSource={selectData}
                    onSelectResultCallBack={item => this.onSelectResultCallBack(item)}
                    onClickMaskCallBack={() => this.setState({ showSelect: false })} />
                <div>
                    {
                        table.map((item, index) => {
                            return (
                                <EditView
                                    key={item.code}
                                    index={index}
                                    item={item}
                                    onEditCallBack={this.onEditCallBack} />
                            )
                        })
                    }
                    <div id='action' style={{ position: 'fixed', bottom: 0, width: '100%' }}>
                        <TabbarButton
                            sectorMenuItems={['保存']}
                            style={[{ flex: 1, padding: 10, borderRadius: 10, background: '#1296db' }]}
                            onClickTabbarButton={title => this.onClickTabbarButton()} />
                    </div>
                </div>
            </div>
        )
    }

    onClickTabbarButton() {
        const { table } = this.state
        this.props.history.goBack()
        store.dispatch(addTodo('SET_DETAIL_Table', table))
    }

    //----------------------------------------Edit----------------------------------------//
    onEditCallBack = (index, value) => {
        if (Array.isArray(value)) {
            if (value.length === 0) {
                selectIndex = -1
                Toast.info('暂无数据！', 1)
            } else {
                selectIndex = index
                this.setState({ showSelect: true, selectData: value })
            }
        } else {
            const { table } = this.state
            table[index].value = value
            this.setState({})
        }
    }

    //----------------------------------------Select----------------------------------------
    onSelectResultCallBack(item) {
        const { table } = this.state
        table[selectIndex].value = item
        this.setState({ table, showSelect: false })
    }
}



export default withRouter(TableDetail)