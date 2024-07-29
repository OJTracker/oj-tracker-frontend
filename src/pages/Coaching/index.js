import { useEffect, useState, useRef } from "react";

import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import {
    TextField, Card, CardHeader, Avatar, IconButton, Tooltip, Grid, Pagination, CircularProgress, Button,
    Paper, FormControl, InputLabel, Select, MenuItem, Alert, Snackbar
} from '@mui/material';

import LoadingButton from "@mui/lab/LoadingButton";

import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ReportIcon from '@mui/icons-material/Report';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import NoCheckCircleIcon from '@mui/icons-material/RemoveCircle';
import EditIcon from '@mui/icons-material/Edit';

import Table from "../../components/Table";
import Modal from "../../components/Modal";
import Spinner from "../../components/Spinner";

import { authApi } from "../../service/authApi";
import { handleError } from "../../utils/error";

import { get } from "../../utils/user";
import { canAct, getSubject, isSpecialUser } from "../../utils/auth";
import { Platforms, platforms } from "../../utils/enums";
import { submitAdd } from "../../utils/problem";
import { checkAccepted, updateAcceptedSubmissions, waitAcceptedSubmissions } from "../../utils/acceptedSubmissions";

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
];

const trainingTableColumns = [
    "Index",
    "Disclosure Link",
    "Problems Number",
];

const Coaching = () => {
    const codeforcesHandle = useSelector((state) => state.handles.codeforcesHandle);
    const atcoderHandle = useSelector((state) => state.handles.atcoderHandle);
    const uvaHandle = useSelector((state) => state.handles.uvaHandle);
    const spojHandle = useSelector((state) => state.handles.spojHandle);
    const codechefHandle = useSelector((state) => state.handles.codechefHandle);

    const updateStarted = useRef(false);

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
    const [done, setDone] = useState(false);

    const [trainings, setTrainings] = useState([]);

    const [addIsShown, setAddIsShown] = useState(false);
    const [addIsLoading, setAddIsLoading] = useState(false);

    const [platform, setPlatform] = useState("");
    const [externalId, setExternalId] = useState("");

    const [platformError, setPlatformError] = useState(false);
    const [externalIdError, setExternalIdError] = useState(false);

    const [externalIdHelperText, setExternalIdHelperText] = useState("");

    const [showSuccess, setShowSuccess] = useState(false);

    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");

    const [coachName, setCoachName] = useState("");
    const [trainingName, setTrainingName] = useState("");

    const [edit, setEdit] = useState(false);
    const [trainingLink, setTrainingLink] = useState("");

    const [name, setName] = useState("");
    const [nameError, setNameError] = useState(false);

    const { id, index, successCode } = useParams();

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

        let newUsers = userCoaches;
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

        if (!problem) return;

        const newProblems = problems;
        newProblems.push({
            "Id": problem.externalId,
            "Platform": problem.platform,
            "Name": problem.problemName,
            "Link": problem.link,
            "": (
                <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
                    <IconButton style={{ color: 'red' }} onClick={() => removeProblem(problem.externalId)}>
                        <DeleteIcon />
                    </IconButton>
                    { problemDone(problem.platform, problem.externalId) && <Tooltip title="Done" arrow>
                        <ReportIcon id="done" style={{ color: 'gold' }}/>
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

    const deleteTraining = async (index) => {
        try {
            setIsLoadingUpdate(true);

            const response = await authApi.delete(`/api/coaching/${index}`,
                {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                }
            );
            if (response.status === 200) {
                window.location = "/ojtracker/coaching/0";
            } else {
                alert("Unknown error");
                setIsLoadingUpdate(false);
            }
        } catch (error) {
            handleError(error, "\nThe training has not been deleted!");
            setIsLoadingUpdate(false);
        }
    }

    const submitTraining = async () => {
        const userIds = userCoaches.map(uc => uc.id);
        const problemObjs = problems.map(p => ({ name: p.Name, platform: p.Platform, externalId: p.Id, link: p.Link }));

        try {
            setIsLoadingUpdate(true);

            if (name === "") {
                setNameError(true);
                setIsLoadingUpdate(false);
                return;
            }

            const response = await authApi.post(`/api/coaching`,
                {
                    users: userIds,
                    problems: problemObjs,
                    index: index,
                    name: name,
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                }
            );

            if (response.status === 200) {
                if (edit) window.location = `/ojtracker/coaching/${getSubject()}/training/${index}/2`;
                else window.location = `/ojtracker/coaching/${getSubject()}/training/${response.data}/1`;
            } else {
                alert("Unknown error");
                setIsLoadingUpdate(false);
            }
        } catch (error) {
            handleError(error, "\nThe training has not been added!");
            setIsLoadingUpdate(false);
        }
    }

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            setMessage("Link copied to clipboard!");
            setOpen(true);
        });
    };

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
                        let link = `coaching/${item.coachId}`;

                        item.coachName = (
                            <a href={link}>{item.coachName}</a>
                        )
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

        const getTrainings = async () => {
            setIsLoadingUpdate(true);

            try {
                const response = await authApi.get(`/api/coaching?coachId=${id}`,
                    {
                        headers: {
                            Authorization: 'Bearer ' + token
                        },
                    }
                );

                if (response.status === 200) {
                    response.data.trainings = response.data.trainings.map(item => {
                        const link = `http://${window.location.host}/ojtracker/coaching/${id != 0 ? id : getSubject()}/training/${item.index}`;

                        let row = {
                            "Index": `#${item.index}`,
                            "Disclosure Link": (
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <a style={{ color: '#00a6eb', marginRight: '1%' }} href={link}>{item.name}</a>
                                    <IconButton onClick={() => copyToClipboard(link)}>
                                        <ContentCopyIcon />
                                    </IconButton>
                                </div>
                            ),
                            "Problems Number": item.problemsNumber
                        };

                        if (isSpecial && !trainingTableColumns.includes("")) trainingTableColumns.push("");

                        return !isSpecial && !canAct(response.data.coach) ? row : {
                            ...row,
                            "": (
                                <div style={{ display: 'flex', justifyContent: 'end' }}>
                                    <IconButton style={{ color: 'red' }} onClick={() => deleteTraining(item.index)}> 
                                        <DeleteIcon />
                                    </IconButton>
                                </div>
                            )
                        };
                    });

                    setCoachName(response.data.coach);
                    setTrainings(response.data.trainings);
                } else {
                    alert("Unknown error");
                }

                setIsLoadingUpdate(false);
            } catch (error) {
                handleError(error, "\nTraining List query unsuccessful!");
                setIsLoadingUpdate(false);
            }
        }

        const getTraining = async () => {
            setIsLoadingUpdate(true);

            try {
                const response = await authApi.get(`/api/coaching/${index}`,
                    {
                        headers: {
                            Authorization: 'Bearer ' + token
                        },
                    }
                );

                if (response.status === 200) {
                    if (isSpecial && canAct(response.data.coach)) {
                        setEdit(true);
                        setTrainingLink(`${window.location.host}/ojtracker/coaching/${getSubject()}/training/${index}`);

                        for (let user of response.data.users) {
                            await addUser(user);
                            setRefresh(!refresh);
                        }

                        response.data.problems = response.data.problems.map(problem => {
                            return {
                                "Id": problem.externalId,
                                "Platform": problem.platform,
                                "Name": problem.name,
                                "Link": problem.link,
                                "": (
                                    <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
                                        <IconButton style={{ color: 'red' }} onClick={() => removeProblem(problem.externalId)}>
                                            <DeleteIcon />
                                        </IconButton>
                                        { problemDone(problem.platform, problem.externalId) && <Tooltip title="Done" arrow>
                                            <ReportIcon id="done" style={{ color: 'gold' }}/>
                                        </Tooltip> }
                                    </div>
                                )
                            }
                        });
                        setProblems(response.data.problems);

                        setName(response.data.name);
                    } else {
                        response.data.problems = response.data.problems.map(item => {
                            let done = checkAccepted(item.platform, item.externalId) ?
                                (<CheckCircleIcon style={{ color: 'green' }} />) : (<NoCheckCircleIcon style={{ color: 'darkgrey' }} />)
    
                            return {
                                ...item,
                                done
                            };
                        });
    
                        setCoachName(response.data.coach);
                        setTrainingName(response.data.name);
                        setProblems(response.data.problems);
                    }
                } else {
                    alert("Unknown error");
                }

                setIsLoadingUpdate(false);
            } catch (error) {
                handleError(error, "\nTraining query unsuccessful!");
                setIsLoadingUpdate(false);
            }   
        }

        if (edit) return;
        if (id && index) getTraining();
        else if (id) getTrainings();
        else if (!isSpecial) getCoaches();
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
                        <ReportIcon id="done" style={{ color: 'gold' }}/>
                    </Tooltip> }
                </div>
            )

            return { ...problem }
        });

        setProblems(newProblems);
    }, [userCoaches, refresh]);

    useEffect(() => {
        setDone(document.querySelector('#done') != null);
    }, [problems]);

    useEffect(() => {
        const updateListAsync = async () => {
            const update = async () => {
                updateAcceptedSubmissions(codeforcesHandle, atcoderHandle, uvaHandle, spojHandle, codechefHandle, token);
                await waitAcceptedSubmissions();
    
                setIsLoadingUpdate(true);

                await new Promise(resolve => setTimeout(resolve, 500));

                var newList = problems;
                newList = newList.map(item => {
                    let done = checkAccepted(item.platform, item.externalId) ?
                        (<CheckCircleIcon style={{ color: 'green' }} />) : (<NoCheckCircleIcon style={{ color: 'darkgrey' }} />)

                    return {
                        ...item,
                        done
                    };
                })

                setProblems(newList);
                setIsLoadingUpdate(false);
            }

            updateStarted.current = true;

            await update();
            const updateInterval = setInterval(async () => {
                await update();
            },  5 * 60 * 1000);

            return () => clearInterval(updateInterval);
        }

        if (problems.length && !isSpecial && !updateStarted.current) updateListAsync();
    }, [problems]);

    useEffect(() => {
        if (successCode) {
            if (successCode === "1") {
                setMessage("Training successfully added!");
            } else {
                setMessage("Training successfully edited!");
            }

            setOpen(true);
        }
    }, []);

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
        <div className={classes.container}>
            <Snackbar open={open} autoHideDuration={3000} onClose={() => setOpen(false)}>
                <Alert
                    onClose={() => setOpen(false)}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {message}
                </Alert>
            </Snackbar>
            <h1>Coaching</h1>

            { id && !edit ?
            <>
                { !index ?
                <>
                    { !isSpecial && !canAct(coachName) ? <h2>{ coachName }</h2> :
                        <Button variant="contained" endIcon={<AddIcon />} onClick={() => window.location = "/ojtracker/coaching" }>
                            New Training
                        </Button>
                    }
                    { isLoadingUpdate ?
                        <Spinner /> :
                        <Table columns={trainingTableColumns} rows={trainings} dontShow={["id", "done", "coachId"]} />
                    }
                </>
                :
                <>
                { isLoadingUpdate ?
                    <Spinner /> :
                    <>
                        <h2>#{index} - {trainingName} - {coachName}</h2>
                        <Table columns={problemTableColumns} rows={problems} dontShow={["problemId", "link"]} newTab={true}/>
                    </>
                }
                </> }
            </>
            :
            <>
                { isSpecial &&
                    <>
                        {edit && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <h2 style={{ marginRight: edit ?'1%' : '0' }}>{edit ? `Edit training #${index}` : "New training"}</h2>
                            <IconButton onClick={() => copyToClipboard(trainingLink)}>
                                <ContentCopyIcon />
                            </IconButton>
                        </div>}
                        { (done && !isLoadingUpdate) && <h3 style={{color: 'gold'}}>There are problems already done by one or more users</h3> }
                        { (userCoaches.length > 0 && problems.length > 0 && !isLoadingUpdate) &&
                            <div>
                                <Button variant="contained" endIcon={edit ? <EditIcon /> : <AddIcon/>} onClick={() => submitTraining()}
                                        style={{ backgroundColor: edit ? 'green' : '', color: 'white', marginRight: edit ? '5px' : '0px' }}
                                >
                                    {edit ? "Submit" : "Add New Training"}
                                </Button>
                                { edit && <Button variant="contained" endIcon={<DeleteIcon />} onClick={() => deleteTraining(index)}
                                        style={{ backgroundColor: 'red', color: 'white' }}
                                >
                                    Delete
                                </Button>}
                            </div>
                        }
                    </>
                }

                { isLoadingUpdate ? <Spinner /> :
                    <>
                    { isSpecial && <TextField
                        style={{marginTop: "1%", width: "500px"}}
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        label={"Name*"}
                        error={nameError}
                        multiline
                    />}
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
                            <Table columns={userTableColumns} rows={userCoaches} dontShow={["id", "done", "coachId"]} small={true} />
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

                                <Table columns={problemTableColumns} rows={problems} dontShow={["problemId", "Link"]} newTab={false} small={true} />
                            </Grid>
                        </>}
                    </Grid>
                    </>
                }
            </>}
        </div>
    )
}

export default Coaching;
