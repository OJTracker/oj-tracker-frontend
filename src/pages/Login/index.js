import React, { useState } from 'react';
import { useDispatch } from "react-redux";

import { Card, CardContent, TextField } from '@mui/material';
import LoadingButton from "@mui/lab/LoadingButton";

import { handleActions } from "../../store/handles";
import { userActions } from "../../store/user";

import classes from "./login.module.css";

import { authApi } from "../../service/authApi";
import { getUsername } from '../../utils/auth';

const Login = () => {
    const dispatch = useDispatch();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [credentialsError, setCredentialsError] = useState(false);

    const handleSubmit = async () => {
        try {
            setIsLoading(true);

            const response = await authApi.post('/api/users/login', { username, password });

            if (response.status === 200) {
                localStorage.setItem("tk", response.data.token);

                const username = getUsername();
                localStorage.setItem("userName", username);
                dispatch(userActions.setUserName(username));

                const profilePicURI = response.data.profilePicURI;
                localStorage.setItem("profilePicURI", profilePicURI);
                dispatch(userActions.setProfilePicURI(profilePicURI));

                const codeforcesHandle = response.data.codeforcesHandle;
                localStorage.setItem("codeforcesHandle", codeforcesHandle);
                dispatch(handleActions.setCodeforcesHandle(codeforcesHandle));

                const codeforcesRanking = response.data.codeforcesRanking;
                localStorage.setItem("codeforcesRanking", codeforcesRanking);
                dispatch(userActions.setCodeforcesRanking(codeforcesRanking));

                // TO-DO: Adicionar outras plataformas

                window.location = "/";
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
