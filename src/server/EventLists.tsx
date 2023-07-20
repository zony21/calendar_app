import { db } from '@/lib/db'
import { Dayjs } from 'dayjs'
import React, { useContext } from 'react'
import styles from '../component/style/Calendar.module.scss'
import GlobalContext from '@/context/GlobalContext'
type daytype = {
    day: any,
}
type Event = {
    capacity: number,
    content: string,
    date: Dayjs,
    eventDay: string,
    eventTime: string,
    title: string,
    members: number
}

const EventLists = async () => {
    let posts: Event[] = []
    try {
        const querySnapshot = await db.collection('events').orderBy('eventTime', 'asc').where("open", "==", true).get();
        querySnapshot.forEach(function (doc) {
            const setmember = doc.data().member.length;
            posts.push({
                capacity: doc.data().capacity,
                content: doc.data().content,
                date: doc.data().date,
                eventDay: doc.data().eventDay,
                eventTime: doc.data().eventTime,
                title: doc.data().title,
                members: setmember,
            })
        })
    } catch (error) {
        alert(`Error getting documents: ${error}`)
    }
    const postsdata = await JSON.parse(JSON.stringify(posts))
    return (
        <ul>
            {postsdata.map((event: Event, index: number) => (
                <li
                    key={index}
                    className={`${styles.event_table} ${event.capacity == event.members ? styles.event_table_max : ""}`}
                    // onClick={() => {
                    //     setDaySelected(day)
                    //     setShowEventModal(true)
                    //     setEventData(event)
                    // }}
                >
                    {event.eventTime} {event.title}
                </li>
            ))}
        </ul>
    )
}

export default EventLists