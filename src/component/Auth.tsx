"use client"
import React, { useEffect, useState } from 'react'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { login, logout } from '../redux/features/UserSlice'
import {
    Avatar,
    Button,
    CssBaseline,
    TextField,
    Grid,
    Box,
    Typography,
    Container,
    createTheme,
    ThemeProvider
} from '@mui/material'
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { auth, provider } from '../firebase'
import { useDispatch, useSelector } from 'react-redux'
import { selectUser } from '@/redux/features/UserSlice'
import Calendar from './Calendar'
import { Dayjs } from 'dayjs'
import styles from "./style/Auth.module.scss"

const theme = createTheme()

type Event = {
    eventdata: {
        filter: any,
        capacity: number,
        content: string,
        date: null | Dayjs,
        eventDay: string,
        eventTime: string,
        title: string,
        id: string
    }
}

const Auth = (props: Event) => {
    const user = useSelector(selectUser)
    const dispatch = useDispatch()
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
    }
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLogin, setIsLogin] = useState(true)

    const signInEmail = async () => {
        await signInWithEmailAndPassword(auth, email, password)
    }
    const signUpEmail = async () => {
        await createUserWithEmailAndPassword(auth, email, password)
    }
    const signInGoogle = async () => {
        await signInWithPopup(auth, provider).catch((err) => alert(err.massage))
    }
    useEffect(() => {
        const unSub = onAuthStateChanged(auth, (mastUser) => {
            if (mastUser) {
                const data = async () => {
                    dispatch(login({
                        uid: mastUser.uid,
                        displayName: mastUser.displayName,
                    }))
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
            {user.uid == "" ? <ThemeProvider theme={theme}>
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            {isLogin ? "Sign In" : "登録"}
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Eメールアドレス"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                value={email}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setEmail(e.target.value) }}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="パスワード"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setPassword(e.target.value) }}
                            />
                            <Button
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                onClick={
                                    isLogin ?
                                        async () => {
                                            try {
                                                await signInEmail()
                                            } catch (err: any) {
                                                alert(err.massage)
                                            }
                                        }
                                        :
                                        async () => {
                                            try {
                                                await signUpEmail()
                                            } catch (err: any) {
                                                alert(err.massage)
                                            }
                                        }
                                }
                            >
                                {isLogin ? "Sign In" : "登録"}
                            </Button>
                            <Grid container>
                                <Grid item xs>
                                    <span className={`${styles.ispointer}`}>
                                        パスワードをお忘れですか？
                                    </span>
                                </Grid>
                                <Grid item xs>
                                    <span
                                        className={`${styles.ispointer}`}
                                        onClick={() => setIsLogin(!isLogin)}>
                                        {isLogin ? "アカウントを作成" : "ログイン画面へ"}
                                    </span>
                                </Grid>
                            </Grid>
                            <Button
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                onClick={signInGoogle}
                            >
                                Googleアカウントでログイン
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </ThemeProvider> :
                <>
                    <Button onClick={() => auth.signOut()} sx={{ mb: 2 }} variant="contained">ログアウト</Button><Calendar eventdata={props.eventdata} />
                </>
            }
        </>
    )
}

export default Auth