"use client"
import React, { useState } from "react";
import GlobalContext from "./GlobalContext";
import dayjs, { Dayjs } from "dayjs";

interface Props {
  children?: React.ReactNode;
}
type Event = {
  capacity: number,
  content: string,
  eventDay: string,
  eventTime: string,
  title: string,
  members: number,
  id: string
}

const ContextWrapper = (props: Props) => {
  const [monthIndex, setMonthIndex] = useState(dayjs().month());
  const [daySelected, setDaySelected] = useState<Dayjs>(dayjs());
  const [showEventModal, setShowEventModal] = useState<boolean>(false);
  const [eventData, setEventData] = useState<Event>({
    capacity: 0,
    content: "",
    eventDay: "",
    eventTime: "",
    title: "",
    members: 0,
    id: ""
  });
  return (
    <GlobalContext.Provider value={{
      monthIndex,
      setMonthIndex,
      daySelected,
      setDaySelected,
      showEventModal,
      setShowEventModal,
      eventData,
      setEventData
    }}>
      {props.children}
    </GlobalContext.Provider>
  );
};

export default ContextWrapper