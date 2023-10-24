import { useState } from "react";
import { useDispatch } from "react-redux";

import { handleActions } from "../../store/handles";
import { userActions } from "../../store/user";

import Modal from "../Modal";

import { Paper, TextField } from "@material-ui/core";
import LoadingButton from "@mui/lab/LoadingButton";

import { codeforcesApi } from "../../service/codeforcesApi";
import { uvaApi } from "../../service/uvaApi";
import { atcoderApi } from "../../service/atcoderApi";
import { spojApi } from "../../service/spojApi";
import { codechefApi } from "../../service/codechefApi";
import { authApi } from "../../service/authApi";

import classes from "./userInfo.module.css";

const UserInfo = (props) => {
  const [isCodeforcesUserValid, setIsCodeforcesUserValid] = useState(true);
  const [isUvaUserValid, setIsUvaUserValid] = useState(true);
  const [isAtcoderUserValid, setIsAtcoderUserValid] = useState(true);
  const [isSpojUserValid, setIsSpojUserValid] = useState(true);
  const [isCodechefUserValid, setIsCodechefUserValid] = useState(true);

  const [codeforcesHandle, setCodeforcesHandle] = useState(
    localStorage.getItem("codeforcesHandle") || ""
  );
  const [uvaHandle, setUvaHandle] = useState(
    localStorage.getItem("uvaHandle") || ""
  );
  const [atcoderHandle, setAtcoderHandle] = useState(
    localStorage.getItem("atcoderHandle") || ""
  );
  const [spojHandle, setSpojHandle] = useState(
    localStorage.getItem("spojHandle") || ""
  );
  const [codechefHandle, setCodechefHandle] = useState(
    localStorage.getItem("codechefHandle") || ""
  );

  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const submit = async () => {
    setIsLoading(true);

    const username = localStorage.getItem("userName");
    const token = localStorage.getItem("tk");

    if (codeforcesHandle) {
      try {
        const res = await codeforcesApi.get(`/userInfo?handle=${codeforcesHandle}`);
        if (res.data.status === "FAILED") {
          setIsCodeforcesUserValid(false);
        } else {
          setIsCodeforcesUserValid(true);
  
          localStorage.setItem("codeforcesHandle", codeforcesHandle);
          dispatch(handleActions.setCodeforcesHandle(codeforcesHandle));
  
          const codeforcesRanking = res.data.result[0].rating
          localStorage.setItem("codeforcesRanking", codeforcesRanking);
          dispatch(userActions.setCodeforcesRanking(codeforcesRanking));
    
          const profilePicURI = res.data.result[0].avatar
          localStorage.setItem("profilePicURI", profilePicURI);
          dispatch(userActions.setProfilePicURI(profilePicURI));
  
          await authApi.put(`/api/users/${username}/codeforces`, 
            {
              codeforcesHandle,
              codeforcesRanking,
              profilePicURI
            },
            {
              headers: {
                Authorization: 'Bearer ' + token
              }
            }
          );
        }
      } catch (error) {
        console.log("erro when try to fetch or persist codeforces user info");
        setIsCodeforcesUserValid(false);
      }
    }

    if (atcoderHandle) {
      try {
        const res = await atcoderApi.get(`/userInfo?handle=${atcoderHandle}`);
        if (res.data.status === "FAILED") {
          setIsAtcoderUserValid(false);
        } else {
          setIsAtcoderUserValid(true);

          localStorage.setItem("atcoderHandle", atcoderHandle);
          dispatch(handleActions.setAtcoderHandle(atcoderHandle));

          const atcoderRanking = res.data.result[0].rating
          localStorage.setItem("atcoderRanking", atcoderRanking);
          dispatch(userActions.setAtcoderRanking(atcoderRanking));

          const profilePicURI = res.data.result[0].avatarURL;
          localStorage.setItem("profilePicURI", profilePicURI);
          dispatch(userActions.setProfilePicURI(profilePicURI));

          await authApi.put(`/api/users/${username}/atcoder`, 
            {
              atcoderHandle,
              atcoderRanking,
              profilePicURI
            },
            {
              headers: {
                Authorization: 'Bearer ' + token
              }
            }
          );
        }
      } catch (error) {
        console.log("erro when try to fetch or persist atcoder user info");
        setIsAtcoderUserValid(false);
      }
    }

    if (uvaHandle) {
      try {
        const res = await uvaApi.get(`/userInfo?handle=${uvaHandle}`);
        if (res.data.status === "FAILED") {
          setIsUvaUserValid(false);
        } else {
          setIsUvaUserValid(true);

          localStorage.setItem("uvaHandle", uvaHandle);
          dispatch(handleActions.setUvaHandle(uvaHandle));

          const uvaAvgDacu = res.data.result[0].avgDacu;
          localStorage.setItem("uvaAvgDacu", uvaAvgDacu);
          dispatch(userActions.setUvaAvgDacu(uvaAvgDacu));

          const profilePicURI = res.data.result[0].avatar;
          localStorage.setItem("profilePicURI", profilePicURI);
          dispatch(userActions.setProfilePicURI(profilePicURI));

          await authApi.put(`/api/users/${username}/uva`, 
            {
              uvaHandle,
              uvaAvgDacu,
              profilePicURI
            },
            {
              headers: {
                Authorization: 'Bearer ' + token
              }
            }
          );
        }
      } catch (error) {
        console.log("erro when try to fetch or persist uva user info");
        setIsUvaUserValid(false);
      }
    }

    if (spojHandle) {
      try {
        const res = await spojApi.get(`/userInfo?handle=${spojHandle}`);
        if (res.data.status === "FAILED") {
          setIsSpojUserValid(false);
        } else {
          setIsSpojUserValid(true);

          localStorage.setItem("spojHandle", spojHandle);
          dispatch(handleActions.setSpojHandle(spojHandle));

          const spojRanking = res.data.result[0].rank;
          localStorage.setItem("spojRanking", spojRanking);
          dispatch(userActions.setSpojRanking(spojRanking));

          const profilePicURI = res.data.result[0].avatarURL;
          localStorage.setItem("profilePicURI", profilePicURI);
          dispatch(userActions.setProfilePicURI(profilePicURI));

          await authApi.put(`/api/users/${username}/spoj`, 
            {
              spojHandle,
              spojRanking,
              profilePicURI
            },
            {
              headers: {
                Authorization: 'Bearer ' + token
              }
            }
          );
        }
      } catch (error) {
        console.log("erro when try to fetch or persist spoj user info");
        setIsSpojUserValid(false);
      }
    }

    if (codechefHandle) {
      try {
        const res = await codechefApi.get(`/userInfo?handle=${codechefHandle}`);
        if (res.data.status === "FAILED") {
          setIsCodechefUserValid(false);
        } else {
          setIsCodechefUserValid(true);

          localStorage.setItem("codechefHandle", codechefHandle);
          dispatch(handleActions.setCodechefHandle(codechefHandle));

          const codechefRanking = res.data.result[0].rating;
          localStorage.setItem("codechefRanking", codechefRanking);
          dispatch(userActions.setCodechefRanking(codechefRanking));

          await authApi.put(`/api/users/${username}/codechef`, 
            {
              codechefHandle,
              codechefRanking
            },
            {
              headers: {
                Authorization: 'Bearer ' + token
              }
            }
          );
        }
      } catch (error) {
        console.log("erro when try to fetch codechef user info");
        setIsCodechefUserValid(false);
      }
    }

    setIsLoading(false);
  }

  return (
    <Modal onClose={props.onClose}>
      <Paper className={classes.Paper}>
        <h2>User`s Handles</h2>
        <TextField
          className={classes.FormInput}
          onChange={(e) => setCodeforcesHandle(e.target.value)}
          value={codeforcesHandle}
          label={"Codeforces Handle"}
          error={!isCodeforcesUserValid}
          helperText={!isCodeforcesUserValid ? "User does not exists" : " "}
        />
        <TextField
          className={classes.FormInput}
          onChange={(e) => setUvaHandle(e.target.value)}
          value={uvaHandle}
          label={"UVA Handle"}
          error={!isUvaUserValid}
          helperText={!isUvaUserValid ? "User does not exists" : " "}
        />
        <TextField
          className={classes.FormInput}
          onChange={(e) => setAtcoderHandle(e.target.value)}
          value={atcoderHandle}
          label={"AtCoder Handle"}
          error={!isAtcoderUserValid}
          helperText={!isAtcoderUserValid ? "User does not exists" : " "}
        />
        <TextField
          className={classes.FormInput}
          onChange={(e) => setSpojHandle(e.target.value)}
          value={spojHandle}
          label={"SPOJ Handle"}
          error={!isSpojUserValid}
          helperText={!isSpojUserValid ? "User does not exists" : " "}
        />
        <TextField
          className={classes.FormInput}
          onChange={(e) => setCodechefHandle(e.target.value)}
          value={codechefHandle}
          label={"Codechef Handle"}
          error={!isCodechefUserValid}
          helperText={!isCodechefUserValid ? "User does not exists" : " "}
        />
        <LoadingButton
          loading={isLoading}
          variant="outlined"
          className={classes.FormButton}
          onClick={submit}
        >
          Save
        </LoadingButton>
      </Paper>
    </Modal>
  );
};

export default UserInfo;
