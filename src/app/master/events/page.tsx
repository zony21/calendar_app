"use client"
import React, { useEffect, useState } from 'react'
import MasterAuth from '../../../component/MasterAuth'
import { useDispatch, useSelector } from 'react-redux'
import { selectMaster, login, logout } from '../../../redux/features/MasterSlice'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from "../../../firebase"
import styles from "./events.module.scss"
import { addDoc, collection, doc, getDoc, serverTimestamp } from 'firebase/firestore'
import dayjs, { Dayjs } from 'dayjs'
import Calendar from '@/component/Calendar'

const Events: React.FC = () => {
    const master = useSelector(selectMaster)
    const dispatch = useDispatch()
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
                <div className={styles.master_main}>
                    <button onClick={() => auth.signOut()}>Logout</button>
                    {/* イベントを表示 */}
                    <Calendar />
                </div>
            ) : (<MasterAuth />)}
        </>
    )
}

export default Events