import './calendarView.css';

const isSameDate = (d1, d2) => {
    return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
}

const isSameMonth = (d1, d2) => {
    return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth();
}

const CalendarView = ({
    value,
    onChange
})=> {
    const today = new Date();
    const selectedDate = (value instanceof Date) ? value : new Date();
    const selectedMonthFirstDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    const selectedMonthLastDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);

    console.log(selectedDate, selectedMonthFirstDate, selectedMonthLastDate);
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
                [0,6].includes(date.getDay()) && 'cell-grey', 
                isSelectedDate && 'selected-date',
                isSameMonth(date, selectedDate) && 'current-month',
                isToday && 'today-date'
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

    return (
        <div className="calendar-view">
            <div className="week-panel"><div className="cell cell-grey">日</div><div className="cell">一</div><div className="cell">二</div><div className="cell">三</div><div className="cell">四</div><div className="cell">五</div><div className="cell cell-grey">六</div></div>
            <div className="months">                
                {renderMonths()}
            </div>
        </div>
    )
}

export default CalendarView;