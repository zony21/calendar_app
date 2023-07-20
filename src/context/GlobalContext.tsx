import dayjs, { Dayjs } from "dayjs";
import React from "react";

type Event = {
  capacity: number,
  content: string,
  date: null | Dayjs,
  eventDay: string,
  eventTime: string,
  title: string,
  members: number,
  id: string,
}

const GlobalContext = React.createContext({
  monthIndex: 0,
  setMonthIndex: (index: number) => { },
  daySelected: dayjs(),
  setDaySelected: (day: Dayjs) => { },
  showEventModal: false,
  setShowEventModal: (show: boolean) => { },
  eventData: {
    capacity: 0,
    content: "",
    eventDay: "",
    eventTime: "",
    title: "",
    members: 0,
    id: ""
  },
  setEventData: (event: Event) => { },
});

export default GlobalContext