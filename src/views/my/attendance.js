import Base from "../base";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import CalendarView from "../../components/calendarView";
import { Button, Picker } from "antd-mobile";

import '../../style/table.css';

const toLabelValue = texts => texts.map(text => ({label: text, value: text}));

class MyAttendance extends Base {
    constructor() {
        super();
        this.state = {
            selectedDate: new Date()
        }
    }

    render() {
        const { selectedDate } = this.state;

        return (
            <div style={{display: 'flex', flexDirection: 'column'}}>
                <CalendarView value={selectedDate} onChange={selectedDate => this.setState({selectedDate})} />
                <table className="table table-border">
                    <thead>
                        <tr>
                            <th>打卡地点</th>
                            <th>打卡时间</th>
                            <th>签卡</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>入口1_门1</td>
                            <td>2021-01-06 08:15:00</td>
                            <td>                                                
                                <Picker 
                                    data={[toLabelValue([
                                        '08:00',
                                        '09:00',
                                        '10:00',
                                        '11:00',
                                        '12:00',
                                        '13:00',
                                        '14:00',
                                        '15:00',
                                        '16:00',
                                        '17:00',
                                        '18:00',
                                        '19:00',
                                    ]),toLabelValue([
                                        '原因1',
                                        '原因2',
                                    ])]}
                                    title="签卡"
                                    cascade={false}
                                    >
                                    <Button size="small" style={{backgroundColor: 'rgba(59, 53, 104, 0.93)', color: '#fff', margin: '4px'}}>签卡</Button>
                                </Picker>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}

//映射函数(绑定属性在porps)
const mapStateToProps = state => {
  return {
    user_code: state.userModule.user_code,
    user_name: state.userModule.user_name
  }
}

export default connect(mapStateToProps)(withRouter(MyAttendance))