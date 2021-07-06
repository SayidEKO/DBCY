import Base from '../base'
import { withRouter } from "react-router-dom";
import EditView from '../../components/editView'
import TabbarButton from '../../components/tabbarButton'

import { getValue } from '../../utils/utils'
import store, { addTodo } from '../../store/store';

class TableDetail extends Base {
    constructor(props) {
        super(props)
        this.state = {
            table: []
        }
        this.state.table = props.location.state.table
    }

    onSave = () => {
        const { table } = this.state
        //表示是本地添加的数据，用于删除
        if (this.props.location.state.isAdd) {
            table.push({isAdd: true})
        }
        this.props.history.goBack()
        store.dispatch(addTodo('SET_DETAIL_Table', table))
    }

    onEditCallBack = (index, value) => {
        const { table } = this.state
        table[index].value = value
        this.setState({})
    }

    render() {
        const { table } = this.state
        //用展示的去掉isAdd字段
        let temp = JSON.parse(JSON.stringify(table))
        
        temp.forEach((item, index) => {
            if (item.isAdd) {
                temp.splice(index, 1)
            }
        })
        return (
            <div>
                {
                    temp.map((item, index) => {
                        return (
                            <EditView
                                key={item.code}
                                index={index}
                                edit={true}
                                title={item.label}
                                value={getValue(item)}
                                type={item.itemtype}
                                define={item.define1}
                                hiddenLine={temp.length - 1 === index}
                                onEditCallBack={this.onEditCallBack} />
                        )
                    })
                }
                <div id='action' style={{ position: 'fixed', bottom: 0, width: '100%' }}>
                    <TabbarButton
                        sectorMenuItems={['保存']}
                        style={[{ flex: 1, padding: 10, borderRadius: 10, background: '#1296db' }]}
                        sectorMenuItemFunctions={[this.onSave]} />
                </div>
            </div>
        )
    }
}



export default withRouter(TableDetail)