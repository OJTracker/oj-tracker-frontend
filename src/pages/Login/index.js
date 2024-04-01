import React, { useState } from 'react';
import { useDispatch } from "react-redux";

import { Card, CardContent, TextField } from '@mui/material';
import LoadingButton from "@mui/lab/LoadingButton";

import Spinner from "../../components/Spinner";

import { handleActions } from "../../store/handles";
import { userActions } from "../../store/user";

import classes from "./login.module.css";

import { authApi } from "../../service/authApi";
import { getUsername } from '../../utils/auth';

import { updateAcceptedSubmissions, initAcceptedSubmissions, waitAcceptedSubmissions } from '../../utils/acceptedSubmissions';

const Login = () => {
    const dispatch = useDispatch();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingAcceptedSubmissions, setIsLoadingAcceptedSubmissions] = useState(false);

    const [credentialsError, setCredentialsError] = useState(false);

    const handleSubmit = async () => {
        try {
            setIsLoading(true);

            const response = await authApi.post('/api/users/login', { username, password });

            if (response.status === 200) {
                localStorage.setItem("tk", response.data.token);

                initAcceptedSubmissions();

                const username = getUsername();
                dispatch(userActions.setUserName(username));

                const profilePicURI = response.data.profilePicURI ?? "";
                dispatch(userActions.setProfilePicURI(profilePicURI));

                const codeforcesHandle = response.data.codeforcesHandle ?? "";
                dispatch(handleActions.setCodeforcesHandle(codeforcesHandle));

                const codeforcesRanking = response.data.codeforcesRanking ?? "";
                dispatch(userActions.setCodeforcesRanking(codeforcesRanking));

                const atcoderHandle = response.data.atcoderHandle ?? "";
                dispatch(handleActions.setAtcoderHandle(atcoderHandle));

                const atcoderRanking = response.data.atcoderRanking ?? "";
                dispatch(userActions.setAtcoderRanking(atcoderRanking));

                const codechefHandle = response.data.codechefHandle ?? "";
                dispatch(handleActions.setCodechefHandle(codechefHandle));

                const codechefRanking = response.data.codechefRanking ?? "";
                dispatch(userActions.setCodechefRanking(codechefRanking));

                const spojHandle = response.data.spojHandle ?? "";
                dispatch(handleActions.setSpojHandle(spojHandle));

                const spojRanking = response.data.spojRanking ?? "";
                dispatch(userActions.setSpojRanking(spojRanking));

                const uvaHandle = response.data.uvaHandle ?? "";
                dispatch(handleActions.setUvaHandle(uvaHandle));

                const uvaRanking = response.data.uvaRanking ?? "";
                dispatch(userActions.setUvaAvgDacu(uvaRanking));

                setIsLoadingAcceptedSubmissions(true);
                updateAcceptedSubmissions(codeforcesHandle, atcoderHandle, uvaHandle, spojHandle, codechefHandle);
                await waitAcceptedSubmissions();

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
                {isLoadingAcceptedSubmissions ? <Spinner /> :
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
                </Card>}
            </div>
        </div>
    );
};

export default Login;
