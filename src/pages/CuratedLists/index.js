import { useEffect, useState } from "react";

import Spinner from "../../components/Spinner";
import Table from "../../components/Table";
import Modal from "../../components/Modal";

import { Button, Paper, TextField } from "@mui/material";

import LoadingButton from "@mui/lab/LoadingButton";

import AddIcon from '@mui/icons-material/Add';

import { authApi } from "../../service/authApi";

import classes from './curated-lists.module.css';
import { isSpecialUser } from "../../utils/auth";

const tableColumns = [
    "Name",
    "Description",
    "Amount",
    "Author"
];

const CuratedLists = () => {
    const [lists, setLists] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [addIsShown, setAddIsShown] = useState(false);
    const [addIsLoading, setAddIsLoading] = useState(false);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const [nameError, setNameError] = useState(false);

    const username = localStorage.getItem("userName");
    const token = localStorage.getItem("tk");

    const hideAddHandler = () => {
        setAddIsShown(false);
    }

    const submit = async () => {
        setAddIsLoading(true);

        if (name === "") {
            setNameError(true);
            setAddIsLoading(false);
            return;
        }

        try {
            const response = await authApi.post(`/api/curated-lists`, 
                {
                    name,
                    description,
                    amount: 0,
                    author: username
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                }
            );

            if (response.status === 200) {
                window.location = `/curated-list/${response.data}`;
            } else {
                alert("Unknown error");
            }

            setAddIsLoading(false);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                window.location = "/";
            } else {
                alert("Unknown error");
            }

            setAddIsLoading(false);
        }
    }

    useEffect(() => {
        setIsLoading(true);

        let path = `/api/curated-lists`;

        if (!isSpecialUser()) {
            path += `/${username}`
            tableColumns.push("Progress");
        }

        const getLists = async () => {
            try {
                const response = await authApi.get(path,
                    {
                        headers: {
                            Authorization: 'Bearer ' + token
                        }
                    }
                );
    
                if (response.status === 200) {
                    setLists(response.data);
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

        getLists();
    }, [token, username]);

    return (
        <>
            {addIsShown && (
                <Modal onClose={hideAddHandler}>
                    <Paper className={classes.Paper}>
                        <h2>New Curated List</h2>
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
                            loading={addIsLoading}
                            variant="outlined"
                            className={classes.FormButton}
                            onClick={() => submit()}
                        >
                            Save
                        </LoadingButton>
                    </Paper>
                </Modal>
            )}
            {
                isLoading ? <Spinner /> : 
                <>
                    <h1>Curated Lists</h1>
                    { isSpecialUser() &&
                        <div className={classes.add}>
                            <Button variant="contained" endIcon={<AddIcon />}
                                onClick={() => setAddIsShown(true)}>Add</Button>
                        </div>
                    }
                    <Table columns={tableColumns} rows={lists} />
                </>
            }
        </>
    );
}

export default CuratedLists;
