import { useEffect, useState } from "react";

import {
    Paper, TextField, Card, CardHeader, CardActions, Avatar, IconButton, Tooltip, Grid, Pagination, CircularProgress 
} from '@mui/material';

import LoadingButton from "@mui/lab/LoadingButton";

import StarIcon from '@mui/icons-material/Star';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PersonIcon from '@mui/icons-material/Person';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';

import Spinner from "../../components/Spinner";
import Modal from "../../components/Modal";

import { isAdmin } from "../../utils/auth";
import { handleError } from "../../utils/error";

import { authApi } from "../../service/authApi";

import classes from "./user-management.module.css";

const ROLES = {
    "ADMIN": "Administrators",
    "COACH": "Coaches",
    "USER": "Users",
    null: "New Requests"
}

const UserManagement = () => {
    const [isLoadingAdmins, setIsLoadingAdmins] = useState(true);
    const [admins, setAdmins] = useState([]);
    const [adminsPage, setAdminsPage] = useState(1);
    const [adminsCount, setAdminsCount] = useState(4);
    const [adminsTotal, setAdminsTotal] = useState(0);

    const [isLoadingCoaches, setIsLoadingCoaches] = useState(false);
    const [coaches, setCoaches] = useState([]);
    const [coachesPage, setCoachesPage] = useState(1);
    const [coachesCount, setCoachesCount] = useState(4);
    const [coachesTotal, setCoachesTotal] = useState(0);

    const [isLoadingNormalUsers, setIsLoadingNormalUsers] = useState(false);
    const [normalUsers, setNormalUsers] = useState([]);
    const [normalUsersPage, setNormalUsersPage] = useState(1);
    const [normalUsersCount, setNormalUsersCount] = useState(10);
    const [normalUsersTotal, setNormalUsersTotal] = useState(0);

    const [isLoadingNewUsers, setIsLoadingNewUsers] = useState(false);
    const [newUsers, setNewUsers] = useState([]);
    const [newUsersPage, setNewUsersPage] = useState(1);
    const [newUsersCount, setNewUsersCount] = useState(4);
    const [newUsersTotal, setNewUsersTotal] = useState(0);

    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);

    const [editIsShown, setEditIsShown] = useState("");
    const [newUsername, setNewUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const [refresh, setRefresh] = useState(false);

    const token = localStorage.getItem("tk");

    const get = async (setIsLoading, page, count, role, setList, setTotal) => {
        try {
            setIsLoading(true);

            const response = await authApi.get('/api/users',
                {
                    headers: {
                        Authorization: 'Bearer ' + token
                    },
                    params: {
                        page,
                        count,
                        role
                    },
                }
            );

            if (response.status === 200) {
                setList(response.data.result);
                setTotal(response.data.totalPages);
            } else {
                alert("Unknown error");
            }

            setIsLoading(false);
        } catch (error) {
            handleError(error, "");
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (!isAdmin()) window.location = "/";

        setNewUsersCount(4);
        setAdminsCount(4);
        setCoachesCount(4);
        setNormalUsersCount(8);

        get(setIsLoadingNewUsers, newUsersPage, newUsersCount, null, setNewUsers, setNewUsersTotal);
        get(setIsLoadingAdmins, adminsPage, adminsCount, "ADMIN", setAdmins, setAdminsTotal);
        get(setIsLoadingCoaches, coachesPage, coachesCount, "COACH", setCoaches, setCoachesTotal);
        get(setIsLoadingNormalUsers, normalUsersPage, normalUsersCount, "USER", setNormalUsers, setNormalUsersTotal);
    }, [refresh]);

    const updateUser = async (userId, role=null) => {
        try {
            setIsLoadingUpdate(true);

            var username = "", password = "";
            if (role === null) {
                username = newUsername;
                password = newPassword;
            }

            const response = await authApi.put(`/api/users/${userId}`,
                {
                    newUsername: username,
                    newPassword: password,
                    newRole: role === "INACTIVE" ? null: role,
                    delete: role === "INACTIVE"
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                }
            );

            if (response.status === 200) {
                setEditIsShown("");
                setRefresh(!refresh);
            } else {
                alert("Unknown error");
            }

            setIsLoadingUpdate(false);
        } catch (error) {
            handleError(error, "\nThe user has not been updated!");
            setIsLoadingUpdate(false);
        }
    }

    const renderCard = (userList) => {
        return (
            <Grid container spacing={3} className={classes.grid}>
                {userList.map(user => {
                    return (
                        <Grid item xs={12} sm={6} md={3}>
                            <Card>
                                <CardHeader
                                    avatar={
                                        <Avatar
                                            alt="avatarURI"
                                            src={user["profilePicURI"]}
                                        />
                                    }
                                    title={user["username"]}
                                    subheader={user["role"]}
                                />
                                <CardActions style={{justifyContent: "center"}}>
                                    <Tooltip title="Make an administrator" arrow>
                                        <IconButton
                                            onClick={() => updateUser(user["userId"], "ADMIN")}
                                            aria-label="Make an administrator" disabled={userIsAdmin(user)}
                                        >
                                            <ManageAccountsIcon style={{color: userIsAdmin(user) ? '' : 'gold'}}/>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Make a coach" arrow>
                                        <IconButton
                                            onClick={() => updateUser(user["userId"], "COACH")}
                                            aria-label="Make a coach" disabled={userIsCoach(user)}
                                        >
                                            <StarIcon style={{color: userIsCoach(user) ? '' : 'blue'}} />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Make a normal user" arrow>
                                        <IconButton
                                            onClick={() => updateUser(user["userId"], "USER")}
                                            aria-label="Make a normal user" disabled={userIsNormal(user)}
                                        >
                                            <PersonIcon style={{color: userIsNormal(user) ? '' : 'green'}} />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Edit" arrow>
                                        <IconButton onClick={() => {
                                                setNewUsername("");
                                                setNewPassword("");
                                                setEditIsShown(user["userId"])
                                            }}
                                            aria-label="Edit"
                                        >
                                            <EditIcon style={{color: 'orange'}} />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete" arrow>
                                        <IconButton onClick={() => updateUser(user["userId"], "INACTIVE")} aria-label="Delete">
                                            <DeleteForeverIcon style={{color: 'red'}} />
                                        </IconButton>
                                    </Tooltip>
                                </CardActions>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>
        );
    }

    const userIsAdmin = (user) => user["role"] === "ADMIN";

    const userIsCoach = (user) => user["role"] === "COACH";

    const userIsNormal = (user) => user["role"] === "USER";

    return (
        <>
            {editIsShown !== "" && ( 
                <Modal onClose={() => {setEditIsShown("")}}>
                    <Paper className={classes.Paper}>
                        <h2>Edit User</h2>
                        <TextField
                            className={classes.FormInput}
                            onChange={(e) => setNewUsername(e.target.value)}
                            value={newUsername}
                            label={"New Username"}
                        />
                        <TextField
                            className={classes.FormInput}
                            onChange={(e) => setNewPassword(e.target.value)}
                            value={newPassword}
                            label={"New Password"}
                            type="password"
                        />
                        <LoadingButton
                            loading={isLoadingUpdate}
                            variant="outlined"
                            className={classes.FormButton}
                            onClick={() => updateUser(editIsShown)}
                        >
                            Save
                        </LoadingButton>
                    </Paper>
                </Modal>
            )}

            <div className={classes.container}>
                <h1>User Management</h1>

                { isLoadingUpdate ? <Spinner /> :
                    <>        
                        {newUsers && 
                            <>
                                <h2 className={classes.subtitle}>{ROLES[null]}</h2>
                                {isLoadingNewUsers ? <CircularProgress className={classes.spinner} /> :
                                    <>
                                        {renderCard(newUsers)}
                                        {newUsersTotal > 1 &&
                                            <Pagination
                                                className={classes.pagination}  
                                                count={newUsersTotal} page={newUsersPage}
                                                onChange={(event, value) => {
                                                    setNewUsersPage(value);
                                                    get(
                                                        setIsLoadingNewUsers, value, newUsersCount, null,
                                                        setNewUsers, setNewUsersTotal
                                                    );
                                                }}
                                            />
                                        }
                                    </>
                                }
                            </>
                        }

                        {admins && 
                            <>
                                <h2 className={classes.subtitle}>{ROLES["ADMIN"]}</h2>
                                {isLoadingAdmins ? <CircularProgress className={classes.spinner} /> :
                                    <>
                                        {renderCard(admins)}
                                        {adminsTotal > 1 &&
                                            <Pagination
                                                className={classes.pagination}  
                                                count={adminsTotal} page={adminsPage}
                                                onChange={(event, value) => {
                                                    setAdminsPage(value);
                                                    get(setIsLoadingAdmins, value, adminsCount, "ADMIN", setAdmins, setAdminsTotal);
                                                }}
                                            />
                                        }
                                    </>
                                }
                            </>
                        }

                        {coaches && 
                            <>
                                <h2 className={classes.subtitle}>{ROLES["COACH"]}</h2>
                                {isLoadingCoaches ? <CircularProgress className={classes.spinner} /> :
                                    <>
                                        {renderCard(coaches)}
                                        {coachesTotal > 1 &&
                                            <Pagination
                                                className={classes.pagination}  
                                                count={coachesTotal} page={coachesPage}
                                                onChange={(event, value) => {
                                                    setCoachesPage(value);
                                                    get(setIsLoadingCoaches, value, coachesCount, "COACH", setCoaches, setCoachesTotal);
                                                }}
                                            />
                                        }
                                    </>
                                }
                            </>
                        }

                        {normalUsers && 
                            <>
                                <h2 className={classes.subtitle}>{ROLES["USER"]}</h2>
                                {isLoadingNormalUsers ? <CircularProgress className={classes.spinner} /> :
                                    <>
                                        {renderCard(normalUsers)}
                                        {normalUsersTotal > 1 &&
                                            <Pagination
                                                className={classes.pagination}  
                                                count={normalUsersTotal} page={normalUsersPage}
                                                onChange={(event, value) => {
                                                    setNormalUsersPage(value);
                                                    get(
                                                        setIsLoadingNormalUsers, value, normalUsersCount, "USER",
                                                        setNormalUsers, setNormalUsersTotal
                                                    );
                                                }}
                                            />
                                        }
                                    </>
                                }
                            </>
                        }
                    </>
                }
            </div>
        </>
    )
}

export default UserManagement;
