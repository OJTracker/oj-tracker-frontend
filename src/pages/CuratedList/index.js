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

import { isSpecialUser, canAct } from "../../utils/auth";

import { platforms } from "../../utils/enums";
import { handleError } from "../../utils/error";
import { submitAdd } from "../../utils/problem";

import { checkAccepted, updateAcceptedSubmissions, waitAcceptedSubmissions } from "../../utils/acceptedSubmissions";

import classes from './curated-list.module.css';

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
                    } else {
                        setNewTab(false);

                        var act = canAct(response.data.author)
                        if (act && !tableColumns.includes("")) tableColumns.push("");

                        response.data.problems = response.data.problems.map(item => {
                            if (act) item.delete = (
                                <IconButton style={{ color: 'red' }} onClick={() => deleteProblem(item.problemId)}>
                                    <DeleteIcon />
                                </IconButton>
                            );

                            return {
                                ...item,
                                externalId: (<a
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    data-umami-event={`${item.platform}-problem-link`}
                                  >
                                    {item.externalId}
                                  </a>)
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
                updateAcceptedSubmissions(codeforcesHandle, atcoderHandle, uvaHandle, spojHandle, codechefHandle, token);
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
                                    onClick={() => submitAdd(
                                        setShowSuccess, setAddIsLoading, setPlatformError, setExternalIdError,
                                        setExternalIdHelperText, platform, externalId, id
                                    )}
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
