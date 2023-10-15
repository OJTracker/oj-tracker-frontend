import React, { useState } from 'react';
import { Card, CardContent, TextField } from '@mui/material';

import LoadingButton from "@mui/lab/LoadingButton";

import classes from "./login.module.css";

import { authApi } from "../../service/authApi";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [credentialsError, setCredentialsError] = useState(false);

    const handleSubmit = async () => {
        try {
            setIsLoading(true);

            const response = await authApi.post('/api/users/login', { username, password });

            if (response.status === 200) {
                localStorage.setItem("tk", response.data);
                window.location = "/private";
            } else {
                alert("Unknown error");
                setCredentialsError(true);
            }

            setIsLoading(false);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setCredentialsError(true);
            } else {
                alert("Unknown error");
            }

            setIsLoading(false);
        }
    };

    return (
        <div className={classes.login}>
            <div className={classes.centered}>
                <Card>
                    <CardContent>
                        <h2>Login</h2>
                        <form>
                            <TextField
                                label="Username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                fullWidth
                                className={classes.FormInput}
                                error={credentialsError}
                                helperText={credentialsError ? "Invalid credentials" : ""}
                            />
                            <TextField
                                label="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                fullWidth
                                className={classes.FormInput}
                                error={credentialsError}
                                helperText={credentialsError ? "Invalid credentials" : ""}
                            />
                            <LoadingButton
                                loading={isLoading}
                                variant="contained"
                                className={classes.FormButton}
                                onClick={handleSubmit}
                                fullWidth
                            >
                                SUBMIT
                            </LoadingButton>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Login;
