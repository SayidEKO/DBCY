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
        this.props.history.goBack()
        store.dispatch(addTodo('SET_DETAIL_Table', table))
    }

    onEditCallBack = (index, value) => {
        const { table } = this.state
        table[index].value = value
        this.setState({})
    }

    componentDidMount() {
        
    }

    render() {
        const { table } = this.state
        return (
            <div>
                {
                    table.map((item, index) => {
                        return (
                            <EditView
                                key={item.code}
                                index={index}
                                edit={true}
                                title={item.label}
                                value={getValue(item)}
                                type={item.itemtype}
                                hiddenLine={table.length - 1 === index}
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