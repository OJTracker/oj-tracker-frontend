import React, { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";

import { Card, CardContent, TextField, Link, Alert, AlertTitle } from '@mui/material';
import LoadingButton from "@mui/lab/LoadingButton";

import WifiTetheringIcon from '@mui/icons-material/WifiTethering';

import Spinner from "../../components/Spinner";

import { handleActions } from "../../store/handles";
import { userActions } from "../../store/user";

import classes from "./login.module.css";

import { authApi } from "../../service/authApi";
import { getUsername } from '../../utils/auth';

import { updateAcceptedSubmissions, initAcceptedSubmissions, waitAcceptedSubmissions } from '../../utils/acceptedSubmissions';

import unb from '../../assets/imgs/unb.png';
import { handleError } from '../../utils/error';

const Login = (props) => {
    const dispatch = useDispatch();

    const [signup, setSignup] = useState(false);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingAcceptedSubmissions, setIsLoadingAcceptedSubmissions] = useState(false);

    const [credentialsError, setCredentialsError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmit = async () => {
        if (!username || !password) { setCredentialsError(true); return; }
        else setCredentialsError(false);

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
            handleError(error);
            setIsLoading(false);
        }
    };

    const handleSignUp = async () => {
        if (!username || !password) { setCredentialsError(true); return; }
        else setCredentialsError(false);

        try {
            setIsLoading(true);

            const response = await authApi.post('/api/users', { username, password });

            if (response.status === 200) {
                setShowSuccess(true);
            } else {
                alert("Unknown error");
                setCredentialsError(true);
            }
 
            setIsLoading(false);
        } catch (error) {
            handleError(error);
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (props.signup) setSignup(true);
    }, [])

    return (
        <div className={classes.login}>
            <div className={classes.background} />
            <div className={classes.centered}>
                {isLoadingAcceptedSubmissions ? <Spinner /> :
                <Card>
                    <CardContent className={classes.card}>
                        <h3 className={classes.logo}>OJTracker <WifiTetheringIcon /></h3>
                        <h2 className={classes.title}>{signup ? "Sign Up" : "Login"}</h2>
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
                            {
                                showSuccess ? 
                                <Alert severity="success">
                                    <AlertTitle>Success - Registration in Analysis!</AlertTitle>
                                    An administrator will review your registration and you will be able to log in once approved.
                                </Alert> :
                                <>
                                    <LoadingButton
                                        loading={isLoading}
                                        variant="contained"
                                        className={classes.FormButton}
                                        onClick={signup ? handleSignUp : handleSubmit}
                                        fullWidth
                                    >
                                        SUBMIT
                                    </LoadingButton>
                                    <p>
                                        {signup ? "Already have an account? " : "Don't have an account? "}
                                        <Link color="primary" onClick={() => setSignup(!signup)} className={classes.link}>
                                            {signup ? "Log in" : "Sign Up"}
                                        </Link>
                                    </p>
                                    <div className={classes.unbFooter}>
                                        <img src={unb} className={classes.unbImg} />
                                    </div>
                                </>
                            }
                        </form>
                    </CardContent>
                </Card>}
            </div>
        </div>
    );
};

export default Login;
