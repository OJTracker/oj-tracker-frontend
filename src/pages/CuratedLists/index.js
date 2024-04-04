import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import Spinner from "../../components/Spinner";
import Table from "../../components/Table";
import Modal from "../../components/Modal";

import { Button, Paper, TextField } from "@mui/material";

import LoadingButton from "@mui/lab/LoadingButton";

import AddIcon from '@mui/icons-material/Add';

import { authApi } from "../../service/authApi";

import classes from './curated-lists.module.css';

import { isSpecialUser } from "../../utils/auth";
import { handleError } from "../../utils/error";

import { updateAcceptedSubmissions, waitAcceptedSubmissions } from "../../utils/acceptedSubmissions";

const tableColumns = [
    "Name",
    "Description",
    "Amount",
    "Author"
];

const CuratedLists = () => {
    const codeforcesHandle = useSelector((state) => state.handles.codeforcesHandle);
    const atcoderHandle = useSelector((state) => state.handles.atcoderHandle);
    const uvaHandle = useSelector((state) => state.handles.uvaHandle);
    const spojHandle = useSelector((state) => state.handles.spojHandle);
    const codechefHandle = useSelector((state) => state.handles.codechefHandle);

    const [lists, setLists] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [addIsShown, setAddIsShown] = useState(false);
    const [addIsLoading, setAddIsLoading] = useState(false);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const [nameError, setNameError] = useState(false);

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
                    amount: 0
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
            handleError(error, "\nCurated List not added!");
            setAddIsLoading(false);
        }
    }

    useEffect(() => {
        setIsLoading(true);

        let path = `/api/curated-lists`;

        if (!isSpecialUser()) {
            path += `/user`
            tableColumns.push("Progress");
        }

        const updateListsAsync = () => {
            const update = () => {
                updateAcceptedSubmissions(codeforcesHandle, atcoderHandle, uvaHandle, spojHandle, codechefHandle);
                waitAcceptedSubmissions();

                setIsLoading(true);

                setIsLoading(false);
            }

            update();
            const updateInterval = setInterval(() => {
                update();
            },  5 * 60 * 1000);

            return () => clearInterval(updateInterval);
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
                    const data = response.data.map(item => {
                        item.name = (<u>{item.name}</u>);
                        return item;
                    });

                    setLists(data);
                    updateListsAsync();
                } else {
                    alert("Unknown error");
                }

                setIsLoading(false);
            } catch (error) {
                handleError(error, "\nCurated Lists query unsuccessful!");
                setIsLoading(false);
            }
        }

        getLists();
    }, [token, codeforcesHandle, atcoderHandle, uvaHandle, spojHandle, codechefHandle]);

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
                    <Table columns={tableColumns} rows={lists} redirect={true}
                        dontShow={[
                            "id", "codeforcesProblems", "uvaProblems",
                            "atcoderProblems", "spojProblems", "codechefProblems"
                        ]}
                    />
                </>
            }
        </>
    );
}

export default CuratedLists;
