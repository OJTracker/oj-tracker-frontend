import { useEffect, useState } from "react";

import {
    TextField, Card, CardHeader, Avatar, IconButton, Tooltip, Grid, Pagination, CircularProgress, Button,
    Paper, FormControl, InputLabel, Select, MenuItem, Alert
} from '@mui/material';

import LoadingButton from "@mui/lab/LoadingButton";

import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ReportIcon from '@mui/icons-material/Report';

import Table from "../../components/Table";
import Modal from "../../components/Modal";
import Spinner from "../../components/Spinner";

import { authApi } from "../../service/authApi";
import { handleError } from "../../utils/error";

import { get } from "../../utils/user";
import { isSpecialUser } from "../../utils/auth";
import { Platforms, platforms } from "../../utils/enums";
import { submitAdd } from "../../utils/problem";

import classes from "./coaching.module.css";

const userTableColumns = [
    "Name",
    "",
];

const problemTableColumns = [
    "Id",
    "Platform",
    "Name",
    "",
]

const Coaching = () => {
    const [isLoadingSearchUsers, setIsLoadingSearchUsers] = useState(false);
    const [searchUsers, setSearchUsers] = useState([]);
    const [searchUsersPage, setSearchUsersPage] = useState(1);
    const [searchUsersCount, setSearchUsersCount] = useState(2);
    const [searchUsersTotal, setSearchUsersTotal] = useState(0);

    const [isLoadingUpdate, setIsLoadingUpdate] = useState(true);

    const [refresh, setRefresh] = useState(false);

    const [search, setSearch] = useState("");

    const [userCoaches, setUserCoaches] = useState([]);
    const [userCoachesToDelete, setUserCoachesToDelete] = useState("");

    const [problems, setProblems] = useState([]);
    const [problemToDelete, setProblemToDelete] = useState("");

    const [addIsShown, setAddIsShown] = useState(false);
    const [addIsLoading, setAddIsLoading] = useState(false);

    const [platform, setPlatform] = useState("");
    const [externalId, setExternalId] = useState("");

    const [platformError, setPlatformError] = useState(false);
    const [externalIdError, setExternalIdError] = useState(false);

    const [externalIdHelperText, setExternalIdHelperText] = useState("");

    const [showSuccess, setShowSuccess] = useState(false);

    const hideAddHandler = () => {
        setRefresh(!refresh);
        setAddIsShown(false);
    }

    const token = localStorage.getItem("tk");

    const isSpecial = isSpecialUser();

    const addCoach = async (coachId) => {
        try {
            setIsLoadingUpdate(true);

            const response = await authApi.post(`/api/coaching/${coachId}`, {},
                {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                }
            );

            if (response.status === 200) {
                setRefresh(!refresh);
            } else {
                alert("Unknown error");
            }

            setIsLoadingUpdate(false);
        } catch (error) {
            handleError(error, "\nThe coach has not been added!");
            setIsLoadingUpdate(false);
        }
    }

    const addUser = async (user) => {
        let done = {};

        try {
            const response = await authApi.get(`/api/problems/user-all-accepted-submissions/${user.userId}`, {
                headers: {
                    Authorization: 'Bearer ' + token
                },
            });

            if (response.data !== undefined) {
                done = response.data;
            } else {
                alert("Unknown error");
                return;
            }
        } catch (error) {
            handleError(error, "\nAccepted User Submissions query unsuccessful!");
            return;
        }

        var newUsers = userCoaches;
        newUsers.push({
            "id": user.userId,
            "Name": user.username,
            "": (
                <div style={{ display: 'flex', justifyContent: 'end' }}>
                    <IconButton style={{ color: 'red' }} onClick={() => removeUser(user.userId)}>
                        <DeleteIcon />
                    </IconButton>
                </div>
            ),
            "done": done
        });
        setUserCoaches(newUsers);

        setRefresh(!refresh);
    }

    const addProblem = async () => {
        const problem = await submitAdd(
            setShowSuccess, setAddIsLoading, setPlatformError, setExternalIdError,
            setExternalIdHelperText, platform, externalId
        )

        const newProblems = problems;
        newProblems.push({
            "Id": problem.externalId,
            "Platform": problem.platform,
            "Name": problem.problemName,
            "": (
                <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
                    <IconButton style={{ color: 'red' }} onClick={() => removeProblem(problem.externalId)}>
                        <DeleteIcon />
                    </IconButton>
                    { problemDone(problem.platform, problem.externalId) && <Tooltip title="Done" arrow>
                        <ReportIcon style={{ color: 'gold' }}/>
                    </Tooltip> }
                </div>
            )
        });
        setProblems(newProblems);

        setRefresh(!refresh);
    }

    const problemDone = (platform, problemId) => {
        let problemIdStr = `${problemId}`;

        switch (platform) {
            case Platforms.CODEFORCES: return userCoaches.find(uc => uc.done && uc.done.codeforces && uc.done.codeforces.includes(problemIdStr));
            case Platforms.ATCODER: return userCoaches.find(uc => uc.done && uc.done.atcoder && uc.done.atcoder.includes(problemIdStr));
            case Platforms.CODECHEF: return userCoaches.find(uc => uc.done && uc.done.codechef && uc.done.codechef.includes(problemIdStr));
            case Platforms.SPOJ: return userCoaches.find(uc => uc.done && uc.done.spoj && uc.done.spoj.includes(problemIdStr));
            case Platforms.UVA: return userCoaches.find(uc => uc.done && uc.done.uva && uc.done.uva.includes(problemIdStr));
        }
    }

    const removeCoach = async (coachId) => {
        try {
            setIsLoadingUpdate(true);

            const response = await authApi.delete(`/api/coaching/${coachId}`,
                {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                }
            );

            if (response.status === 200) {
                setRefresh(!refresh);
            } else {
                alert("Unknown error");
            }

            setIsLoadingUpdate(false);
        } catch (error) {
            handleError(error, "\nThe coach has not been deleted!");
            setIsLoadingUpdate(false);
        }
    }

    const removeUser = (userId) => {
        setUserCoachesToDelete(userId);
    }

    const removeProblem = (problemId) => {
        setProblemToDelete(problemId);
    }

    useEffect(() => {
        if (!isSpecial) {
            setSearchUsers([]);
            setIsLoadingSearchUsers(false);
            setSearchUsersCount(2);
            setSearchUsersPage(1);
            setSearchUsersTotal(0);
            setSearch("");
        }

        const getCoaches = async () => {
            setIsLoadingUpdate(true);

            try {
                const response = await authApi.get('/api/coaching/user',
                    {
                        headers: {
                            Authorization: 'Bearer ' + token
                        },
                    }
                );
        
                if (response.status === 200) {
                    response.data = response.data.map(item => {
                        item.delete = (
                            <div style={{ display: 'flex', justifyContent: 'end' }}>
                                <IconButton style={{ color: 'red' }} onClick={() => removeCoach(item.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </div>
                        );

                        return { ...item }
                    });

                    setUserCoaches(response.data);
                } else {
                    alert("Unknown error");
                }
        
                setIsLoadingUpdate(false);
            } catch (error) {
                handleError(error, "\nCoach List query unsuccessful!");
                setIsLoadingUpdate(false);
            }
        }

        if (!isSpecial) getCoaches();
        else setIsLoadingUpdate(false); 
    }, [refresh]);

    useEffect(() => {
        if (search === "") {
            setSearchUsers([]);
            setSearchUsersTotal(0);
        }
    }, [search]);

    useEffect(() => {
        if (userCoachesToDelete) {
            var newUsers = userCoaches.filter(uc => uc.id !== userCoachesToDelete);
            setUserCoaches(newUsers);
            setUserCoachesToDelete("");
        }

        if (problemToDelete) {
            var newProblems = problems.filter(p => p.Id !== problemToDelete);
            setProblems(newProblems)
            setProblemToDelete("");
        }
    }, [userCoachesToDelete, problemToDelete]);

    useEffect(() => {
        var newProblems = problems.map(problem => {
            problem[""] = (
                <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
                    <IconButton style={{ color: 'red' }} onClick={() => removeProblem(problem.Id)}>
                        <DeleteIcon />
                    </IconButton>
                    { problemDone(problem.Platform, problem.Id) && <Tooltip title="Done" arrow>
                        <ReportIcon style={{ color: 'gold' }}/>
                    </Tooltip> }
                </div>
            )

            return { ...problem }
        });

        setProblems(newProblems);
    }, [userCoaches, refresh]);

    const renderCard = (userList) => {
        return (
            <Grid container spacing={3} className={classes.grid}>
                {userList.map(user => {
                    return (
                        <Grid item xs={12} sm={isSpecial ? 12 : 6} lg={isSpecial ? 6 : 3}>
                            <Card>
                                <CardHeader
                                    avatar={
                                        <Avatar
                                            alt="avatarURI"
                                            src={user["profilePicURI"]}
                                        />
                                    }
                                    title={user["username"]}
                                    action={
                                        <Tooltip title="Add Coach" arrow>
                                            <IconButton
                                                aria-label="Add Coach" onClick={() => isSpecial ? addUser(user) : addCoach(user["userId"])}
                                                disabled={userCoaches.find(uc => uc.id === user.userId) !== undefined}
                                            >
                                                <AddIcon style={{color: 'primary'}} />
                                            </IconButton>
                                        </Tooltip>
                                    }
                                />
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>
        );
    }

    return (
        <>
            <div className={classes.container}>
                <h1>Coaching</h1>
                { isSpecial && <h2>New training</h2> }

                { isLoadingUpdate ? <Spinner /> :
                    <Grid container spacing={1}>
                        <Grid item xs={isSpecial ? 6 : 12}>
                            { isSpecial && <h2 style={{textAlign: "left"}}>Users</h2> }

                            <div style={{display: "flex", justifyContent: isSpecial ? "left" : "center", alignContent: "center"}}>
                                <TextField onChange={(e) => setSearch(e.target.value)} value={search} label="Search" variant="filled" />
                                <IconButton disabled={!search} onClick={() => {
                                    setSearchUsersPage(1);
                                    get(setIsLoadingSearchUsers, 1, searchUsersCount, null, setSearchUsers, setSearchUsersTotal, search, true);
                                }} aria-label="Search">
                                    <SearchIcon color={!search ? "" : "primary"} />
                                </IconButton>
                            </div>

                            {searchUsers && 
                                <>
                                    <h2 className={classes.subtitle}></h2>
                                    {isLoadingSearchUsers ? <CircularProgress className={classes.spinner} /> :
                                        <>
                                            {renderCard(searchUsers)}
                                            {searchUsersTotal > 1 &&
                                                <Pagination
                                                    className={classes.pagination}  
                                                    count={searchUsersTotal} page={searchUsersPage}
                                                    onChange={(event, value) => {
                                                        setSearchUsersPage(value);
                                                        get(
                                                            setIsLoadingSearchUsers, value, searchUsersCount, null,
                                                            setSearchUsers, setSearchUsersTotal, search, true
                                                        );
                                                    }}
                                                />
                                            }
                                        </>
                                    }
                                </>
                            }
                            <Table columns={userTableColumns} rows={userCoaches} dontShow={["id", "done", "coachId"]} newTab={false} small={true} />
                        </Grid>

                        { isSpecial && <>
                            {addIsShown && (
                                <Modal onClose={hideAddHandler}>
                                    <Paper className={classes.Paper}>
                                        <h2>Add Problem</h2>
                                        <FormControl fullWidth className={classes.FormInput}>
                                            <InputLabel id="platform-select-label">Platform*</InputLabel>
                                            <Select
                                                labelId="platform-select-label"
                                                id="platform-select"
                                                value={platform}
                                                label="Platform*"
                                                error={platformError}
                                                onChange={(e) => setPlatform(e.target.value)}
                                            >
                                                {platforms.map((platform, index) => (
                                                    <MenuItem key={index} value={platform[1]}>
                                                        {platform[0]}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <TextField
                                            className={classes.FormInput}
                                            onChange={(e) => setExternalId(e.target.value)}
                                            value={externalId}
                                            label={"Id*"}
                                            error={externalIdError}
                                            helperText={externalIdError ? externalIdHelperText : ""}
                                        />
                                        <LoadingButton
                                            loading={addIsLoading}
                                            variant="outlined"
                                            className={classes.FormButton}
                                            onClick={() => addProblem()}
                                        >
                                            Save
                                        </LoadingButton>
                                        {showSuccess && <Alert onClose={() => {setShowSuccess(false)}}>Problem added successfully!</Alert>}
                                    </Paper>
                                </Modal>
                            )}
                            <Grid item xs={isSpecial ? 6 : 12}>
                                <h2 style={{textAlign: "left"}}>Problems</h2>
                                <div style={{display: "flex"}}>
                                    <Button variant="contained" endIcon={<AddIcon />} onClick={() => setAddIsShown(true)}>
                                        Add Problem
                                    </Button>
                                </div>

                                <Table columns={problemTableColumns} rows={problems} dontShow={["problemId", "link"]} newTab={false} small={true} />
                            </Grid>
                        </>}
                    </Grid>
                }
            </div>
        </>
    )
}

export default Coaching;
