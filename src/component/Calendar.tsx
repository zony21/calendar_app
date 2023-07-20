"use client"

import React, { useContext, useEffect } from 'react'
import { getMonth } from "./util"
import { useState } from 'react'
import Day from './Day'
import styles from './style/Calendar.module.scss'
import CalendarHeader from './CalendarHeader'
import GlobalContext from '../context/GlobalContext'
import EventModal from './EventModal'
import { Dayjs } from 'dayjs'

type Event = {
    eventdata: {
        filter: any,
        capacity: number,
        content: string,
        date: null | Dayjs,
        eventDay: string,
        eventTime: string,
        title: string,
    }
}

const Calendar = (props: Event) => {
    const [currentMonth, setCurrentMonth] = useState(getMonth())
    const { monthIndex, showEventModal } = useContext(GlobalContext)
    useEffect(() => {
        setCurrentMonth(getMonth(monthIndex));
    }, [monthIndex])
    return (
        <>
            {showEventModal && <EventModal />}
            <CalendarHeader />
            <div className={styles.c_wrap}>
                {currentMonth.map((row, i) => (
                    <React.Fragment key={i}>
                        {row.map((day, idx) => (
                            <Day day={day} key={idx} rowIdx={i} eventdata={props.eventdata} />
                        ))}
                    </React.Fragment>
                ))}
            </div>
        </>
    )
}

export default Calendar