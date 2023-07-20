"use client"
import React, { useEffect, useState } from 'react'
import MasterAuth from '../../component/MasterAuth'
import { useDispatch, useSelector } from 'react-redux'
import { selectMaster, login, logout } from '../../redux/features/MasterSlice'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from "../../firebase"
import styles from "./master.module.scss"
import { addDoc, collection, doc, getDoc, serverTimestamp } from 'firebase/firestore'
import dayjs, { Dayjs } from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { TimeClock } from '@mui/x-date-pickers/TimeClock';
import {
    Box,
    Button,
    DialogContent,
    FormControlLabel,
    Grid,
    Modal,
    Radio,
    RadioGroup,
    TextField,
    Typography
} from '@mui/material'

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
}
const Master: React.FC = () => {
    const master = useSelector(selectMaster)
    const dispatch = useDispatch()
    const [eventDay, setEventDay] = useState<Dayjs | null>(dayjs())
    const [eventTime, setEventTime] = useState<Dayjs | null>(dayjs())
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [capacity, setCapacity] = useState(10)
    const [open, setOpen] = useState(true)
    const [valueopen, setValueOpen] = React.useState('open');
    const [modalopen, setModalOpen] = React.useState(false)
    const modalhandleOpen = () => setModalOpen(true)
    const modalhandleClose = () => setModalOpen(false)
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValueOpen((event.target as HTMLInputElement).value)
    }
    useEffect(() => {
        if (valueopen == "close") {
            setOpen(false)
        } else {
            setOpen(true)
        }
    }, [valueopen])
    const onEventSet = async (e: React.FormEvent<HTMLFormElement>) => {
        await addDoc(collection(db, "events"), {
            date: serverTimestamp(),
            eventDay: eventDay!.format("YYYY/MM/DD"),
            eventTime: eventTime!.format("HH:mm"),
            title: title,
            content: content,
            capacity: capacity,
            open: open,
            member: [],
        })
        setEventDay(dayjs())
        setEventTime(dayjs())
        setTitle("")
        setContent("")
        setCapacity(0)
        setValueOpen("open")
        setModalOpen(false)
    }
    useEffect(() => {
        const unSub = onAuthStateChanged(auth, (mastUser) => {
            if (mastUser) {
                const data = async () => {
                    const ref = doc(db, "masters", mastUser.uid)
                    const docSnap = await getDoc(ref)
                    if (docSnap.exists()) {
                        dispatch(login({
                            level: docSnap.data().level,
                            uid: mastUser.uid,
                            displayName: docSnap.data().displayName,
                        }))
                    } else {
                        alert("曲者！")
                    }
                }
                data()
            } else {
                dispatch(logout())
            }
        })
        return () => {
            unSub()
        }
    }, [dispatch])
    return (
        <>
            {master.uid ? (
                <div className={`${styles.master_main} main`}>
                    <Button onClick={() => auth.signOut()} sx={{ mb: 2 }} variant="contained">ログアウト</Button>
                    <section className={styles.master_eventup}>
                        {/* イベントを投稿する */}
                        <Box>
                            <DialogContent>
                                <TextField
                                    sx={{ mb: 2 }}
                                    label="タイトル"
                                    variant="filled"
                                    value={title}
                                    id="title"
                                    name="title"
                                    autoComplete="title"
                                    placeholder="タイトル"
                                    fullWidth
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setTitle(e.target.value) }}
                                />
                                <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                    dateFormats={{ monthAndYear: "YYYY年 MM月", monthShort: "MM月" }}>
                                    <Grid
                                        container
                                        columns={{ xs: 1, lg: 2 }}
                                        spacing={4}
                                        alignItems="center"
                                        justifyContent="center"
                                    >
                                        <Grid item>
                                            <DateCalendar
                                                minDate={dayjs()}
                                                value={eventDay}
                                                onChange={(newValue) => setEventDay(newValue)}
                                            />
                                        </Grid>
                                        <Grid item sx={{ textAlign: 'center' }}>
                                            <TimeClock
                                                showViewSwitcher
                                                views={['hours', 'minutes']}
                                                value={eventTime}
                                                onChange={(newValue) => setEventTime(newValue)}
                                                ampm={false}
                                            />
                                            <h3 className={styles.time_h_box}>
                                                <span className={styles.time_txt}>{dayjs(eventTime).format("H:mm")}</span>
                                            </h3>
                                        </Grid>
                                    </Grid>
                                </LocalizationProvider>
                                <TextField
                                    sx={{ mt: 2 }}
                                    label="概要"
                                    variant="filled"
                                    value={content}
                                    id="content"
                                    name="content"
                                    autoComplete="content"
                                    multiline
                                    rows={10}
                                    fullWidth
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setContent(e.target.value) }}
                                />
                                <TextField
                                    sx={{ mt: 2 }}
                                    label="定員数"
                                    variant="filled"
                                    value={capacity}
                                    type="number"
                                    id="capacity"
                                    name="capacity"
                                    InputProps={{ inputProps: { min: 0 } }}
                                    autoComplete="capacity"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setCapacity(Number(e.target.value)) }}
                                />
                                <RadioGroup
                                    sx={{ mt: 2 }}
                                    aria-labelledby="demo-controlled-radio-buttons-group"
                                    name="controlled-radio-buttons-group"
                                    value={valueopen}
                                    onChange={handleChange}
                                >
                                    <FormControlLabel value="open" control={<Radio />} label="公開" />
                                    <FormControlLabel value="close" control={<Radio />} label="下書き" />
                                </RadioGroup>
                                <Button sx={{ mt: 2 }} onClick={modalhandleOpen} variant="contained" disabled={!title}>保存</Button>
                                <Modal
                                    open={modalopen}
                                    onClose={modalhandleClose}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description"
                                >
                                    <Box sx={style} component="form" onSubmit={onEventSet}>
                                        <Typography id="modal-modal-title" variant="h6" component="h2">
                                            イベントを保存しますか？
                                        </Typography>
                                        <Typography id="modal-modal-description" sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: '10px' }}>
                                            <Button onClick={modalhandleClose} variant="outlined" color="error">キャンセル</Button>
                                            <Button type='submit' variant="outlined">保存</Button>
                                        </Typography>
                                    </Box>
                                </Modal>
                            </DialogContent>
                        </Box>
                    </section>
                </div>
            ) : (<MasterAuth />)}
        </>
    )
}

export default Master