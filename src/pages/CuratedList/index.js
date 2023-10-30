import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Button, Paper, TextField } from "@mui/material";

import LoadingButton from "@mui/lab/LoadingButton";

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import Spinner from "../../components/Spinner";
import Table from "../../components/Table";
import Modal from "../../components/Modal";

import { authApi } from "../../service/authApi";

import { isSpecialUser, canAct, getUserRole } from "../../utils/auth";

import classes from './curated-list.module.css';

const platforms = [
    "CODEFORCES",
    "UVA",
    "ATCODER",
    "SPOJ",
    "CODECHEF"
];

const tableColumns = [
    "Id",
    "Name",
    "Platform"
];

const CuratedList = () => {
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

    const { id } = useParams();

    const username = localStorage.getItem("userName");
    const token = localStorage.getItem("tk");

    const hideEditHandler = () => {
        setEditIsShown(false);
    }

    const hideAddHandler = () => {
        setAddIsShown(false);
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
                    description,
                    authorRole: getUserRole(),
                    author: username
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                }                
            );

            if (response.status === 200) {
                window.location = `/curated-list/${id}`;
            } else {
                alert("Unknown error");
            }

            setEditIsLoading(false);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                window.location = "/";
            } else {
                alert("Unknown error");
            }

            setEditIsLoading(false);
        }
    }

    const submitAdd = () => {
        console.log("ADD");
    }

    useEffect(() => {
        setIsLoading(true);

        let path = `/api/curated-lists/${id}`;

        if (!isSpecialUser()) {
            path += `/${username}`
            tableColumns.push("Status");
        }

        const getList = async () => {
            try {
                const response = await authApi.get(path,
                    {
                        headers: {
                            Authorization: 'Bearer ' + token
                        }
                    }
                );
    
                if (response.status === 200) {
                    setList(response.data);

                    setName(response.data.name);
                    setDescription(response.data.description);
                } else {
                    alert("Unknown error");
                }

                setIsLoading(false);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    window.location = "/";
                } else {
                    alert("Unknown error");
                }
                setIsLoading(false);
            }
        }

        getList();
    }, [token, username]);

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
                    <div style={{ textAlign: 'center' }}>
                        <h1>{list.name}</h1>
                        <h2>{list.description}</h2>
                    </div>
                    { canAct(list.author === username) &&
                        <div className={classes.actions}>
                            <div>
                                <Button variant="contained" endIcon={<EditIcon />} onClick={() => setEditIsShown(true)}
                                    style={{ backgroundColor: 'green', color: 'white', marginRight: '5px' }}
                                >
                                    Edit
                                </Button>
                                <Button variant="contained" endIcon={<DeleteIcon />} onClick={() => null /* TO-DO */}
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
                    <Table columns={tableColumns} rows={list.problems} />
                </>
            }
        </>
    );
}

export default CuratedList;
