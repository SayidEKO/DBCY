/**
 *  标签组件
 */
import { Component } from 'react'
import { withRouter } from 'react-router-dom';
import { router2tableDetail } from '../utils/routers';
import store, { addTodo } from '../store/store';
import { getValue } from '../utils/utils';


//记录每个标签宽度
let widths = []
//单个字符宽度
let wordWidth = 20

class Table extends Component {

    //添加
    add() {
        const { onTableAddLisenter, templateSource, title } = this.props
        onTableAddLisenter(title)
        router2tableDetail(this, { title, table: templateSource })
    }

    //删除
    delete(index) {
        const { onTableDeleteLisenter, title } = this.props
        onTableDeleteLisenter(index, title)
    }

    //编辑
    edit(index) {
        const { onTableEditLisenter, tableSource, title } = this.props
        onTableEditLisenter(index, title)
        router2tableDetail(this, { title, table: tableSource[index] })
    }

    render() {
        const { title, tableSource, templateSource } = this.props
        //计算每个字段标题的最大宽度
        templateSource.forEach((item, index) => {
            let title = item['label']
            widths[index] = title.length * wordWidth
        })
        //计算每个字段值的最大宽度
        tableSource.forEach(items => {
            //每一条数据
            items.forEach((item, index) => {
                //每个字段
                let value = getValue(item)
                let tempWidth = value.length * wordWidth
                //如果值的宽度大于标题的宽度就重新赋值
                if (widths[index] < tempWidth) {
                    widths[index] = tempWidth
                }
            })
        })
        return (
            <div style={{ position: 'relative' }}>
                {/* 标签名 */}
                <div style={{ display: 'flex', padding: 10, background: 'lightGray', color: 'orange', paddingBottom: 10, borderBottom: '1px solid #BBBBBB' }}>
                    <div style={{ flex: 5, textAlign: 'left' }}>{title}</div>
                    <div style={{ flex: 1, textAlign: 'right' }} onClick={() => this.add()}>+</div>
                </div>

                {/* 表格 */}
                <div style={{ whiteSpace: 'nowrap', overflowX: 'auto' }}>
                    {/* 表头 */}
                    <div style={{ display: 'flex', padding: 5 }}>
                        {
                            templateSource.map((item, index) => {
                                return (
                                    <div
                                        key={'head' + index}
                                        style={{ flex: '0 0 auto', width: widths[index], borderRight: '1px solid', textAlign: 'center' }}>
                                        {item.label}
                                    </div>
                                )
                            })
                        }
                    </div>
                    {
                        // 表体
                        tableSource.map((items, parentIndex) => {
                            return (
                                <div key={'body' + parentIndex} style={{ display: 'flex' }}>
                                    {
                                        items.map((item, chiledIndex) => {
                                            let value = getValue(item)
                                            if (chiledIndex === items.length - 1) {
                                                return (
                                                    <div key={'body' + parentIndex + chiledIndex} style={{ display: 'flex', padding: 5 }}>
                                                        <div style={{ flex: '0 0 auto', width: widths[chiledIndex], textAlign: 'center' }}>{value}</div>
                                                        <div
                                                            onClick={() => this.delete(parentIndex)}
                                                            style={{ background: 'red', marginLeft: 10, width: 40, color: 'white', borderRadius: 10, textAlign: 'center' }}>
                                                            删除
                                                            </div>
                                                        <div
                                                            onClick={() => this.edit(parentIndex)}
                                                            style={{ background: 'blue', marginLeft: 10, width: 40, color: 'white', borderRadius: 10, textAlign: 'center' }}>
                                                            编辑
                                                            </div>
                                                    </div>
                                                )
                                            }
                                            return (
                                                <div
                                                    key={parentIndex + chiledIndex}
                                                    style={{ flex: '0 0 auto', width: widths[chiledIndex], padding: 5, textAlign: 'center' }}>
                                                    {value}
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }

}

export default withRouter(Table)