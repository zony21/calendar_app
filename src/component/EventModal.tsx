import React, { useContext, useEffect, useState } from 'react'
import GlobalContext from '../context/GlobalContext'
import { styled } from '@mui/material/styles'
import styles from './style/Calendar.module.scss'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore"
import { Backdrop, Box, Button, Fade, Grid, Modal, Paper, Typography } from '@mui/material'
import { db } from '@/firebase'
import { useSelector } from 'react-redux'
import { selectUser } from '@/redux/features/UserSlice'
import dayjs from 'dayjs'
const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "80%",
    maxHeight: "70%",
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    overflow: "scroll"
}

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(3),
    color: "#000000",
}))

const EventModal = () => {
    const user = useSelector(selectUser)
    const { setShowEventModal, eventData, showEventModal } = useContext(GlobalContext)
    const [evcheck, setEvCheck] = useState(false)
    const [cancel, setCancel] = useState(false)
    const today = dayjs()
    const eventDay = dayjs(eventData.eventDay)
    useEffect(() => {
        if (eventDay.isBefore(today)) {
            setEvCheck(true)
        }
    }, [])
    const onBooking = async () => {
        setShowEventModal(false)
        const washingtonRef = doc(db, "events", eventData.id)
        await updateDoc(washingtonRef, {
            member: arrayUnion(user.uid)
        })
    }
    const onCheckout = async () => {
        setShowEventModal(false)
        const washingtonRef = doc(db, "events", eventData.id)
        await updateDoc(washingtonRef, {
            member: arrayRemove(user.uid)
        })
    }
    useEffect(() => {
        const data = async () => {
            const docRef = doc(db, "events", eventData.id)
            const docSnap = await getDoc(docRef)
            if (docSnap.data()!.member.includes(user.uid)) {
                setCancel(true)
            }
        }
        data()
    }, [])
    console.log(cancel)
    return (
        <>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={showEventModal}
                onClose={() => setShowEventModal(false)}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={showEventModal}>
                    <Box sx={style}>
                        <Typography id="transition-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
                            {eventData.title}
                            <span className={styles.moadl_tl_date}><AccessTimeIcon />{eventData.eventTime}</span>
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={8}>
                                <Item>
                                    <section className='sec_in'>
                                        <h3 className="title">概要</h3>
                                        <div className="txt">
                                            {eventData.content.split('\n').map((t, index) => (
                                                <span key={index}>{t}<br /></span>
                                            ))}
                                        </div>
                                    </section>
                                </Item>
                            </Grid>
                            <Grid item xs={4}>
                                <Item>
                                    <div className={styles.capacity}>定員：<span className={`${styles.now_member} ${`${eventData.capacity == eventData.members ? styles.now_member_max_txt : ""}`}`}>{eventData.members}</span>/{eventData.capacity}</div>
                                    {!cancel ?
                                        <Button
                                            onClick={onBooking}
                                            variant="contained"
                                            fullWidth
                                            className={`${evcheck ? styles.timeup : `${eventData.capacity == eventData.members ? styles.now_member_max : ""}`}`}
                                            disabled={eventData.capacity == eventData.members || evcheck}
                                        >
                                            {evcheck ? "終了しました" : `${eventData.capacity == eventData.members ? "満員です" : "申し込む"}`}
                                        </Button>
                                        : <Button
                                            color="error"
                                            onClick={onCheckout}
                                            variant="contained"
                                            fullWidth
                                            className={`${evcheck ? styles.timeup : ""}`}
                                            disabled={evcheck}
                                        >
                                            {evcheck ? "終了しました" : "キャンセルする"}
                                        </Button>}
                                </Item>
                            </Grid>
                        </Grid>
                    </Box>
                </Fade>
            </Modal>
        </>
    )
}

export default EventModal