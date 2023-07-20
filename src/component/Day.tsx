import React, { useContext, useEffect, useState } from 'react'
import styles from './style/Calendar.module.scss'
import dayjs, { Dayjs } from "dayjs"
import ja from "dayjs/locale/ja"
import GlobalContext from '../context/GlobalContext'
dayjs.locale(ja);

type daytype = {
    day: any, rowIdx: number,
    eventdata: {
        filter: any
        capacity: number,
        content: string,
        date: null | Dayjs,
        eventDay: string,
        eventTime: string,
        title: string,
    }
}
type eventtype = {
    capacity: number,
    content: string,
    date: null | Dayjs,
    eventDay: string,
    eventTime: string,
    title: string,
    members: number,
    id: string,
}
const Day = (props: daytype) => {
    const { setDaySelected, setShowEventModal, setEventData, monthIndex } = useContext(GlobalContext)
    const [lastmonth, setLastmonth] = useState(false)
    const { day, rowIdx } = props
    const getCurrentDayClass = () => {
        return day.format("DD-MM-YY") === dayjs().format("DD-MM-YY")
            ? "bg-blue-600"
            : "";
    }
    const today = dayjs()
    useEffect(() => {
        if (rowIdx === 0) {
            if (Number(day.format("DD")) >= 15) {
                setLastmonth(true)
            } else {
                setLastmonth(false)
            }
        }
    })
    return (
        <>
            <div className={`${styles.day_box} ${lastmonth ? styles.day_box_lastmonth : ""}`}>
                <header className="flex flex-col items-center">
                    {/* 1行目に曜日を表示 */}
                    {rowIdx === 0 && <p className="text-sm mt-1">{day.format("dd")}</p>}
                    <p className={`text-sm p-1 my-1 text-center" ${getCurrentDayClass()} ${styles.day_in}`}>
                        {day.format("DD")}
                    </p>
                    <div>
                        {props.eventdata.filter((check: eventtype) => check.eventDay == day.format("YYYY/MM/DD")).map((event: eventtype, index: number) => {
                            const eventDay = dayjs(event.eventDay)
                            return (
                                <div
                                    key={index}
                                    className={`${styles.event_table} ${eventDay.isBefore(today) ? styles.timeup_li : `${event.capacity == event.members ? styles.event_table_max : ""}`}`}
                                    onClick={() => {
                                        setDaySelected(day)
                                        setShowEventModal(true)
                                        setEventData(event)
                                    }}
                                >
                                    {event.eventTime} {event.title}
                                </div>
                            )
                        }
                        )}
                    </div>
                </header>
            </div>
        </>
    )
}

export default Day