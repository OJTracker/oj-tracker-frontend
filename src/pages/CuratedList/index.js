import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";

import { useParams } from "react-router-dom";

import { Button, Paper, TextField, FormControl, Select, MenuItem, InputLabel, Alert, IconButton } from "@mui/material";

import LoadingButton from "@mui/lab/LoadingButton";

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import NoCheckCircleIcon from '@mui/icons-material/RemoveCircle';

import Spinner from "../../components/Spinner";
import Table from "../../components/Table";
import Modal from "../../components/Modal";

import { authApi } from "../../service/authApi";
import { codeforcesApi } from "../../service/codeforcesApi";
import { uvaApi } from "../../service/uvaApi";
import { atcoderApi } from "../../service/atcoderApi";
import { spojApi } from "../../service/spojApi";
import { codechefApi } from "../../service/codechefApi";

import { isSpecialUser, canAct } from "../../utils/auth";

import { Platforms } from "../../utils/enums";
import { handleError } from "../../utils/error";

import { checkAccepted, updateAcceptedSubmissions, waitAcceptedSubmissions } from "../../utils/acceptedSubmissions";

import classes from './curated-list.module.css';

const platforms = [
    ["Codeforces", Platforms.CODEFORCES],
    ["UVA", Platforms.UVA],
    ["AtCoder", Platforms.ATCODER],
    ["SPOJ", Platforms.SPOJ],
    ["Codechef", Platforms.CODECHEF]
];

const tableColumns = [
    "Id",
    "Platform",
    "Name",
];

const CuratedList = () => {
    const codeforcesHandle = useSelector((state) => state.handles.codeforcesHandle);
    const atcoderHandle = useSelector((state) => state.handles.atcoderHandle);
    const uvaHandle = useSelector((state) => state.handles.uvaHandle);
    const spojHandle = useSelector((state) => state.handles.spojHandle);
    const codechefHandle = useSelector((state) => state.handles.codechefHandle);

    const [list, setList] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const [editIsShown, setEditIsShown] = useState(false);
    const [editIsLoading, setEditIsLoading] = useState(false);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const [nameError, setNameError] = useState(false);

    const [addIsShown, setAddIsShown] = useState(false);
    const [addIsLoading, setAddIsLoading] = useState(false);

    const [platform, setPlatform] = useState("");
    const [externalId, setExternalId] = useState("");

    const [platformError, setPlatformError] = useState(false);
    const [externalIdError, setExternalIdError] = useState(false);

    const [externalIdHelperText, setExternalIdHelperText] = useState("");

    const [showSuccess, setShowSuccess] = useState(false);

    const [newTab, setNewTab] = useState(true);

    const [refresh, setRefresh] = useState(false);

    const updateStarted = useRef(false);

    const { id } = useParams();

    const token = localStorage.getItem("tk");

    const hideEditHandler = () => {
        setEditIsShown(false);
    }

    const hideAddHandler = () => {
        setRefresh(!refresh);
        setAddIsShown(false);
    }

    const deleteList = async () => {
        setIsLoading(true);

        try {
            const response = await authApi.delete(`/api/curated-lists/${id}`,
                {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                } 
            )

            if (response.status === 200) {
                window.location = "/curated-lists";
            } else {
                alert("Unknown error");
                setIsLoading(false);
            }
        } catch (error) {
            handleError(error, "\nCurated List not deleted!");
            setIsLoading(false);
        }
    }

    const deleteProblem = async (problemId) => {
        setIsLoading(true);

        try {
            const response = await authApi.delete(`/api/curated-lists/${id}/problem/${problemId}`,
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
        } catch (error) {
            handleError(error, "\nProblem not deleted!");
        }

        setIsLoading(false);
    }

    const submitEdit = async () => {
        setEditIsLoading(true);

        if (name === "") {
            setNameError(true);
            setEditIsLoading(false);
            return;
        }

        try {
            const response = await authApi.put(`/api/curated-lists/${id}`,
                {
                    name,
                    description
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                }                
            );

            if (response.status === 200) {
                setRefresh(!refresh);
                setEditIsShown(false);
            } else {
                alert("Unknown error");
            }
        } catch (error) {
            handleError(error, "\nProblem not edited!");
        }

        setEditIsLoading(false);
    }

    const submitAdd = async () => {
        setShowSuccess(false);
        setAddIsLoading(true);

        if (platform === "") {
            setPlatformError(true);
            setAddIsLoading(false);
            return;
        }

        setPlatformError(false);

        if (externalId === "") {
            setExternalIdError(true);
            setAddIsLoading(false);
            return;
        }

        if (platform === Platforms.UVA && !Number.isInteger(externalId)) {
            setExternalIdError(true);
            setExternalIdHelperText("Invalid Id.");
            setAddIsLoading(false);
            return;
        }

        setExternalIdError(false);

        let problemName = "";
        let link = "";

        switch (platform) {
            case Platforms.CODEFORCES:
                try {
                    let firstNonDigit = externalId.search(/[^0-9]/);
                    let contestId = externalId.slice(0, firstNonDigit);
                    let index = externalId.slice(firstNonDigit);

                    const response = await codeforcesApi.get(`/problems?contestId=${contestId}&index=${index}`);

                    if (response.status === 200) {
                        if (response.data.result.length < 1) {
                            setExternalIdError(true);
                            setExternalIdHelperText("Invalid Id.");
                            setAddIsLoading(false);
                            return;
                        }

                        link = `https://codeforces.com/problemset/problem/${contestId}/${index}`;
                        problemName = response.data.result[0].name;
                    } else {
                        alert("Unknown error");
                        setAddIsLoading(false);
                        return;
                    }
                } catch (error) {
                    handleError(error, "\nProblem not added!");
                    setAddIsLoading(false);
                    return;
                }
                break;

            case Platforms.UVA:
                try {
                    const response = await uvaApi.get(`/problems/${externalId}`);

                    if (response.status === 200) {
                        if (response.data.result.length < 1) {
                            setExternalIdError(true);
                            setExternalIdHelperText("Invalid Id.");
                            setAddIsLoading(false);
                            return;
                        }

                        let problem = response.data.result[0];
                        
                        link = `https://onlinejudge.org/external/${
                            Math.floor(externalId / 100)
                        }/${externalId}.pdf`;

                        problemName = problem.title;
                    } else {
                        alert("Unknown error");
                        setAddIsLoading(false);
                        return;
                    }
                } catch (error) {
                    handleError(error, "\nProblem not added!");
                    setAddIsLoading(false);
                    return;
                }
                break;

            case Platforms.ATCODER:
                try {
                    const response = await atcoderApi.get(`/problems?problemId=${externalId}`);

                    if (response.status === 200) {
                        if (response.data.result.length < 1) {
                            setExternalIdError(true);
                            setExternalIdHelperText("Invalid Id.");
                            setAddIsLoading(false);
                            return;
                        }

                        let problem = response.data.result[0];
                        link = `https://atcoder.jp/contests/${problem.contestId}/tasks/${problem.problemId}`;
                        problemName = problem.name;
                    } else {
                        alert("Unknown error");
                        setAddIsLoading(false);
                        return;
                    }
                } catch (error) {
                    handleError(error, "\nProblem not added!");
                    setAddIsLoading(false);
                    return;
                }
                break;

            case Platforms.SPOJ:
                break;

            case Platforms.CODECHEF:
                try {
                    const response = await codechefApi.get(`/problems?problemId=${externalId}`);

                    if (response.status === 200) {
                        if (response.data.result.length < 1) {
                            setExternalIdError(true);
                            setExternalIdHelperText("Invalid Id.");
                            setAddIsLoading(false);
                            return;
                        }

                        let problem = response.data.result[0];
                        link = `https://www.codechef.com/problems/${problem.problemId}`;
                        problemName = problem.problemName;
                    } else {
                        alert("Unknown error");
                        setAddIsLoading(false);
                        return;
                    }
                } catch (error) {
                    handleError(error, "\nProblem not added!");
                    setAddIsLoading(false);
                    return;
                }
                break;

            default:
                setAddIsLoading(false);
                return;
        }

        setExternalIdError(false);
        setExternalIdHelperText("");

        try {
            const response = await authApi.post(`/api/curated-lists/${id}/problem`,
                {
                    name: problemName,
                    platform,
                    externalId,
                    link
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                }                
            );

            if (response.status === 200) {
                setShowSuccess(true);
            } else {
                alert("Unknown error");
            }
        } catch (error) {
            handleError(error, "\nProblem not persisted!");
        }

        setAddIsLoading(false);
    }

    useEffect(() => {
        setIsLoading(true);

        if (!isSpecialUser())
            tableColumns.push("Done");

        const getList = async () => {
            try {
                const response = await authApi.get(`/api/curated-lists/${id}`,
                    {
                        headers: {
                            Authorization: 'Bearer ' + token
                        }
                    }
                );

                if (response.status === 200) {
                    if (!isSpecialUser()) {
                        response.data.problems = response.data.problems.map(item => {
                            let done = checkAccepted(item.platform, item.externalId) ?
                                (<CheckCircleIcon style={{ color: 'green' }} />) : (<NoCheckCircleIcon style={{ color: 'darkgrey' }} />)

                            return {
                                ...item,
                                done
                            };
                        });

                        setList(response.data);
                    } else if (canAct(response.data.author)) {
                        setNewTab(false);

                        tableColumns.push("");

                        response.data.problems = response.data.problems.map(item => {
                            return {
                                ...item,
                                externalId: (<a
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {item.externalId}
                                  </a>),
                                delete: (<IconButton style={{ color: 'red' }} onClick={() => deleteProblem(item.problemId)}><DeleteIcon /></IconButton>)
                            };
                        });

                        setList(response.data);
                    }

                    setName(response.data.name);
                    setDescription(response.data.description);
                } else {
                    alert("Unknown error");
                }
            } catch (error) {
                handleError(error, "\nCurated List query unsuccessful!");
            }

            setIsLoading(false);
        }

        getList();
    }, [token, refresh, codeforcesHandle, atcoderHandle, uvaHandle, spojHandle, codechefHandle]);

    useEffect(() => {
        const updateListAsync = async () => {
            const update = async () => {
                updateAcceptedSubmissions(codeforcesHandle, atcoderHandle, uvaHandle, spojHandle, codechefHandle);
                await waitAcceptedSubmissions();
    
                setIsLoading(true);

                await new Promise(resolve => setTimeout(resolve, 500));

                var newList = list;
                newList.problems = newList.problems.map(item => {
                    let done = checkAccepted(item.platform, item.externalId) ?
                        (<CheckCircleIcon style={{ color: 'green' }} />) : (<NoCheckCircleIcon style={{ color: 'darkgrey' }} />)

                    return {
                        ...item,
                        done
                    };
                })

                setList(newList);
                setIsLoading(false);
            }

            updateStarted.current = true;

            await update();
            const updateInterval = setInterval(async () => {
                await update();
            },  5 * 60 * 1000);

            return () => clearInterval(updateInterval);
        }

        if (list.problems && !isSpecialUser() && !updateStarted.current) updateListAsync();
    }, [list, codeforcesHandle, atcoderHandle, uvaHandle, spojHandle, codechefHandle]);

    return (
        <>
            {isLoading ? <Spinner /> :
                <>
                    {editIsShown && (
                        <Modal onClose={hideEditHandler}>
                            <Paper className={classes.Paper}>
                                <h2>Edit Curated List</h2>
                                <TextField
                                    className={classes.FormInput}
                                    onChange={(e) => setName(e.target.value)}
                                    value={name}
                                    label={"Name*"}
                                    error={nameError}
                                    multiline
                                />
                                <TextField
                                    className={classes.FormInput}
                                    onChange={(e) => setDescription(e.target.value)}
                                    value={description}
                                    label={"Description"}
                                    multiline
                                    rows={2}
                                />
                                <LoadingButton
                                    loading={editIsLoading}
                                    variant="outlined"
                                    className={classes.FormButton}
                                    onClick={() => submitEdit()}
                                >
                                    Save
                                </LoadingButton>
                            </Paper>
                        </Modal>
                    )}
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
                                    onClick={() => submitAdd()}
                                >
                                    Save
                                </LoadingButton>
                                {showSuccess && <Alert onClose={() => {setShowSuccess(false)}}>Problem added successfully!</Alert>}
                            </Paper>
                        </Modal>
                    )}
                    <div style={{ textAlign: 'center' }}>
                        <h1>{list.name}</h1>
                        <h2>{list.description}</h2>
                    </div>
                    { canAct(list.author) &&
                        <div className={classes.actions}>
                            <div>
                                <Button variant="contained" endIcon={<EditIcon />} onClick={() => setEditIsShown(true)}
                                    style={{ backgroundColor: 'green', color: 'white', marginRight: '5px' }}
                                >
                                    Edit
                                </Button>
                                <Button variant="contained" endIcon={<DeleteIcon />} onClick={() => deleteList()}
                                    style={{ backgroundColor: 'red', color: 'white' }}
                                >
                                    Delete
                                </Button>
                            </div>
                            <div>
                                <Button variant="contained" endIcon={<AddIcon />} onClick={() => setAddIsShown(true)}>
                                    Add Problem
                                </Button>
                            </div>
                        </div>
                    }
                    <Table columns={tableColumns} rows={list.problems} dontShow={["problemId", "link"]} newTab={newTab}/>
                </>
            }
        </>
    );
}

export default CuratedList;
