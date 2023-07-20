import React, { useContext } from 'react'
import { MdChevronLeft, MdChevronRight } from "react-icons/md"
import GlobalContext from "../context/GlobalContext"
import dayjs from "dayjs"
import { Button, Stack } from '@mui/material'

const CalendarHeader = () => {
  const { monthIndex, setMonthIndex } = useContext(GlobalContext)
  const handlePrevMonth = () => {
    setMonthIndex(monthIndex - 1);
  }
  const handelNextMonth = () => {
    setMonthIndex(monthIndex + 1);
  }
  const handleReset = () => {
    // 現在の月を取得
    setMonthIndex(dayjs().month());
  }
  return (
    <header className="px-4 py-2 flex items-center">
      <Stack direction="row" spacing={2}>
        <Button variant="outlined" onClick={handleReset} className="border rounded py-2 px-4 mr-5">
          Today
        </Button>
        <Button variant="outlined" onClick={handlePrevMonth}>
          <span className="cursor-pointer text-gray-600 mx-2">
            <MdChevronLeft />
          </span>
        </Button>
        <Button variant="outlined" onClick={handelNextMonth}>
          <span className="cursor-pointer text-gray-600 mx-2">
            <MdChevronRight />
          </span>
        </Button>
      </Stack>
      <h2 className="ml-4 text-xl text-gray-500 font-bold">
        {dayjs(new Date(dayjs().year(), monthIndex)).format("YYYY年 M月")}
      </h2>
    </header>
  )
}

export default CalendarHeader