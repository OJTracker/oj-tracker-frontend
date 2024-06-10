import { useEffect, useState } from "react";

import {
    TextField, Card, CardHeader, Avatar, IconButton, Tooltip, Grid, Pagination, CircularProgress 
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

import Table from "../../components/Table";

import Spinner from "../../components/Spinner";

import { authApi } from "../../service/authApi";
import { handleError } from "../../utils/error";

import { get } from "../../utils/user";

import classes from "./coaching.module.css";

const tableColumns = [
    "Name",
    "",
];

const Coaching = () => {
    const [isLoadingSearchUsers, setIsLoadingSearchUsers] = useState(false);
    const [searchUsers, setSearchUsers] = useState([]);
    const [searchUsersPage, setSearchUsersPage] = useState(1);
    const [searchUsersCount, setSearchUsersCount] = useState(4);
    const [searchUsersTotal, setSearchUsersTotal] = useState(0);

    const [isLoadingUpdate, setIsLoadingUpdate] = useState(true);

    const [refresh, setRefresh] = useState(false);

    const [search, setSearch] = useState("");

    const [userCoaches, setUserCoaches] = useState([]);

    const token = localStorage.getItem("tk");

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

    useEffect(() => {
        setIsLoadingUpdate(true);

        setSearchUsers([]);
        setIsLoadingSearchUsers(false);
        setSearchUsersCount(4);
        setSearchUsersPage(1);
        setSearchUsersTotal(0);
        setSearch("");

        const getCoaches = async () => {
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
                handleError(error, "");
                setIsLoadingUpdate(false);
            }
        }

        getCoaches();
    }, [refresh]);

    useEffect(() => {
        if (search === "") {
            setSearchUsers([]);
            setSearchUsersTotal(0);
        }
    }, [search]);

    const renderCard = (userList) => {
        return (
            <Grid container spacing={3} className={classes.grid}>
                {userList.map(user => {
                    return (
                        <Grid item xs={12} sm={6} lg={3}>
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
                                                aria-label="Add Coach" onClick={() => addCoach(user["userId"])}>
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

                { isLoadingUpdate ? <Spinner /> :
                    <>
                        <div style={{display: "flex", justifyContent: "center", alignContent: "center"}}>
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
                        <Table columns={tableColumns} rows={userCoaches} dontShow={["id", "coachId"]} newTab={false} />
                    </>
                }
            </div>
        </>
    )
}

export default Coaching;
