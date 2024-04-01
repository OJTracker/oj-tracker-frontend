import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

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

import { Platforms } from "../../utils/enums";

import classes from "./userInfo.module.css";
import { handleError } from "../../utils/error";

const UserInfo = (props) => {
  const [isCodeforcesUserValid, setIsCodeforcesUserValid] = useState(true);
  const [isUvaUserValid, setIsUvaUserValid] = useState(true);
  const [isAtcoderUserValid, setIsAtcoderUserValid] = useState(true);
  const [isSpojUserValid, setIsSpojUserValid] = useState(true);
  const [isCodechefUserValid, setIsCodechefUserValid] = useState(true);

  const [codeforcesHandle, setCodeforcesHandle] = useState(
    useSelector((state) => state.handles.codeforcesHandle) || ""
  );
  const [uvaHandle, setUvaHandle] = useState(
    useSelector((state) => state.handles.uvaHandle) || ""
  );
  const [atcoderHandle, setAtcoderHandle] = useState(
    useSelector((state) => state.handles.atcoderHandle) || ""
  );
  const [spojHandle, setSpojHandle] = useState(
    useSelector((state) => state.handles.spojHandle) || ""
  );
  const [codechefHandle, setCodechefHandle] = useState(
    useSelector((state) => state.handles.codechefHandle) || ""
  );

  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const submit = async () => {
    setIsLoading(true);

    let platformsData = [];
    const token = localStorage.getItem("tk");

    if (codeforcesHandle) {
      try {
        const res = await codeforcesApi.get(`/userInfo?handle=${codeforcesHandle}`);
        if (res.data.status === "FAILED") {
          setIsCodeforcesUserValid(false);
        } else {
          setIsCodeforcesUserValid(true);
  
          dispatch(handleActions.setCodeforcesHandle(codeforcesHandle));
  
          const ranking = res.data.result[0].rating
          dispatch(userActions.setCodeforcesRanking(ranking));
    
          const profilePicURI = res.data.result[0].avatar
          dispatch(userActions.setProfilePicURI(profilePicURI));
  
          platformsData.push({
              platform: Platforms.CODEFORCES,
              handle: codeforcesHandle,
              ranking,
              profilePicURI
          });
        }
      } catch (error) {
        console.log("erro when try to fetch codeforces user info");
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

          dispatch(handleActions.setAtcoderHandle(atcoderHandle));

          const ranking = res.data.result[0].rating
          dispatch(userActions.setAtcoderRanking(ranking));

          const profilePicURI = res.data.result[0].avatarURL;
          dispatch(userActions.setProfilePicURI(profilePicURI));

          platformsData.push({
            platform: Platforms.ATCODER,
            handle: atcoderHandle,
            ranking,
            profilePicURI
          });
        }
      } catch (error) {
        console.log("erro when try to fetch atcoder user info");
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

          dispatch(handleActions.setUvaHandle(uvaHandle));

          const uvaAvgDacu = res.data.result[0].avgDacu;
          dispatch(userActions.setUvaAvgDacu(uvaAvgDacu));

          const profilePicURI = res.data.result[0].avatar;
          dispatch(userActions.setProfilePicURI(profilePicURI));

          platformsData.push({
            platform: Platforms.UVA,
            handle: uvaHandle,
            ranking: uvaAvgDacu,
            profilePicURI
          });
        }
      } catch (error) {
        console.log("erro when try to fetch uva user info");
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

          dispatch(handleActions.setSpojHandle(spojHandle));

          const ranking = res.data.result[0].rank;
          dispatch(userActions.setSpojRanking(ranking));

          const profilePicURI = res.data.result[0].avatarURL;
          dispatch(userActions.setProfilePicURI(profilePicURI));

          platformsData.push({
            platform: Platforms.SPOJ,
            handle: spojHandle,
            ranking,
            profilePicURI
          });
        }
      } catch (error) {
        console.log("erro when try to fetch spoj user info");
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

          dispatch(handleActions.setCodechefHandle(codechefHandle));

          const ranking = res.data.result[0].rating;
          dispatch(userActions.setCodechefRanking(ranking));

          platformsData.push({
            platform: Platforms.CODECHEF,
            handle: codechefHandle,
            ranking,
          });
        }
      } catch (error) {
        console.log("erro when try to fetch codechef user info");
        setIsCodechefUserValid(false);
      }
    }

    try {
      await authApi.put(`/api/users/platforms`,
        platformsData,
        {
          headers: {
            Authorization: 'Bearer ' + token
          }
        }
      );
    } catch (error) {
      handleError(error, "\nUser's Handles not persisted.");
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
