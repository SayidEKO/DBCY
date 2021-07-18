import { useMemo } from 'react';
import PropTypes from 'prop-types';
import Ripples from 'react-ripples';
import { Button, Picker } from "antd-mobile";

import './calendarView.scss';

const isSameDate = (d1, d2) => {
    return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
}

const isSameMonth = (d1, d2) => {
    return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth();
}

const Arrow = props => (<svg className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" {...props}><path d="M512 330.666667c14.933333 0 29.866667 4.266667 40.533333 14.933333l277.33333399 234.666667c27.733333 23.466667 29.866667 64 8.53333301 89.6-23.466667 27.733333-64 29.866667-89.6 8.53333299L512 477.866667l-236.8 200.53333299c-27.733333 23.466667-68.266667 19.19999999-89.6-8.53333299-23.466667-27.733333-19.19999999-68.266667 8.53333301-89.6l277.33333399-234.666667c10.666667-10.666667 25.6-14.933333 40.533333-14.933333z" fill="currentColor"></path></svg>);

/**
 * 提供一个直接显示的（非弹出）日历选择器
 * @author Jock Li by Fowo
 */
const CalendarView = ({
    value,
    onChange
})=> {
    const today = new Date();
    // const selectedDate = (value instanceof Date) ? value : new Date();
    const selectedDate = useMemo(()=>((value instanceof Date) ? value : new Date()), [value]);
    const selectedMonthFirstDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    // const selectedMonthLastDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);

    // console.log(selectedDate, selectedMonthFirstDate, selectedMonthLastDate);
    const displayFirstDate = new Date(selectedMonthFirstDate.getFullYear(), selectedMonthFirstDate.getMonth(), selectedMonthFirstDate.getDate() - selectedMonthFirstDate.getDay());

    const onSelectedDate = date => {
        if (typeof(onChange) === 'function') {
            onChange(date);
        }
    }

    const renderWeek = (startDate) => {
        const children = [];
        for(let week = 0; week < 7; week++) {
            const date = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + week);
            const isSelectedDate = isSameDate(date, selectedDate);
            const isToday = isSameDate(date, today);
            children.push(<div key={date.getTime()} 
            onClick={()=>onSelectedDate(date)}
            className={[
                'cell', 
                [0,6].includes(date.getDay()) && 'cell-grey',  // 周末
                isSelectedDate && 'selected-date', // 所选
                isSameMonth(date, selectedDate) && 'current-month', // 当月
                isToday && 'today-date' // 当天
                ].filter(d=>d).join(' ')}>
                <div className="date-wrapper">
                    {date.getDate()}
                </div>
            </div>);
        }
        return (
            <div className="months-week" key={startDate.getTime()}>
                {children}
            </div>
        )
    }

    const renderMonths = () => {
        let children = [];
        for(let line = 0; line < 6; line++) {
            const date = new Date(displayFirstDate.getFullYear(), displayFirstDate.getMonth(), displayFirstDate.getDate() + line * 7);
            children.push(renderWeek(date))
        }
        return children;
    }

    const onYearMonthChange = ([year, month]) => {
        // console.log('onYearMonthChange', year, month);
        let currentDateOfMonth = selectedDate.getDate();
        let newDate = new Date(year, month, currentDateOfMonth);
        if(newDate.getDate() !== currentDateOfMonth) {
            // 选择日期大于选择月有效日期，自动选为月尾日期
            newDate = new Date(year, month + 1, 0);
        }
        onSelectedDate(newDate);
    }

    const yearOptions = useMemo(()=>{
        const years = [];
        const currentYear = selectedDate.getFullYear();
        for(var year = currentYear - 50; year < currentYear + 50; year++) {
            years.push({
                label: `${year} 年`,
                value: year
            })
        }
        return years;
    }, [selectedDate]);

    const monthOptions = useMemo(()=>{
        const months = [];
        for(var i=0;i<12;i++) {
            months.push({
                label: `${i + 1} 月`,
                value: i
            })
        }
        return months;
    }, []);

    return (
        <div className="calendar-view">
            <div className="calendar-view-header">
                <Ripples className="d-flex flex-1 align-items-center justify-content-center padding-x-1">
                    <Picker 
                        title="年月"
                        cascade={false}
                        value={[selectedDate.getFullYear(), selectedDate.getMonth()]}
                        data={[yearOptions, monthOptions]}
                        onOk={onYearMonthChange}
                    >
                        <div className="d-flex">
                            <span>{selectedDate.getFullYear()} 年 {selectedDate.getMonth() + 1} 月</span>
                            <Arrow style={{transform: 'rotate(180deg)', width: 24, height: 24}} />
                        </div>
                    </Picker>
                </Ripples>
                {(today.getFullYear() !== selectedDate.getFullYear() || today.getMonth() !== selectedDate.getMonth()) && (
                    <Ripples>
                        <Button onClick={()=>onSelectedDate(today)} size="small" type="ghost" inline>今天</Button>
                    </Ripples>
                )}
            </div>
            <div className="week-panel"><div className="cell cell-grey">日</div><div className="cell">一</div><div className="cell">二</div><div className="cell">三</div><div className="cell">四</div><div className="cell">五</div><div className="cell cell-grey">六</div></div>
            <div className="months">                
                {renderMonths()}
            </div>
        </div>
    )
}

CalendarView.propTypes = {
    /** 表示当前选中的日期值 */
    value: PropTypes.instanceOf(Date),
    /** 当选中日期值改变时发生 onChange(selectDate: Date):void */
    onChange: PropTypes.func
};

export default CalendarView;