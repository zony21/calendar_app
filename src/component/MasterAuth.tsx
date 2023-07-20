import React, { useState } from 'react'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
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
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth, provider } from '../firebase'
import styles from './style/Auth.module.scss'
import Link from 'next/link'

const theme = createTheme()

const Auth: React.FC = () => {
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
    }
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const signInEmail = async () => {
        await signInWithEmailAndPassword(auth, email, password)
    }
    return (
        <ThemeProvider theme={theme}>
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
                        Sign In
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
                                async () => {
                                    try {
                                        await signInEmail()
                                    } catch (err: any) {
                                        alert(err.massage)
                                    }
                                }
                            }
                        >
                            Sign In
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    )
}

export default Auth