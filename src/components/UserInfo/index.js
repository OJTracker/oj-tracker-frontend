import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
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

import classes from "./userInfo.module.css";

const UserInfo = (props) => {
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

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

  useEffect(() => {
    const checkCodeforcesUser = async () => {
      try {
        const res = await codeforcesApi.get(
          `/userInfo?handle=${codeforcesHandle}`
        );
        if (res.data.status === "FAILED") {
          setIsCodeforcesUserValid(false);
        } else {
          localStorage.setItem("codeforcesHandle", codeforcesHandle);
          dispatch(handleActions.setCodeforcesHandle(codeforcesHandle));

          localStorage.setItem("codeforcesRanking", res.data.result[0].rating);
          dispatch(userActions.setCodeforcesRanking(res.data.result[0].rating));

          localStorage.setItem(
            "userName",
            `${res.data.result[0].firstName} ${res.data.result[0].lastName}` ||
              ""
          );
          dispatch(
            userActions.setUserName(
              `${res.data.result[0].firstName} ${res.data.result[0].lastName}` ||
                ""
            )
          );

          localStorage.setItem("profilePicURI", res.data.result[0].avatar);
          dispatch(userActions.setProfilePicURI(res.data.result[0].avatar));
        }
      } catch (error) {
        console.log("erro when try to fetch codeforces user info");
      }
    };

    const checkAtcoderUser = async () => {
      try {
        const res = await atcoderApi.get(`/userInfo?handle=${atcoderHandle}`);
        if (res.data.status === "FAILED") {
          setIsAtcoderUserValid(false);
        } else {
          localStorage.setItem("atcoderHandle", atcoderHandle);
          dispatch(handleActions.setAtcoderHandle(atcoderHandle));

          localStorage.setItem("atcoderRanking", res.data.result[0].rating);
          dispatch(userActions.setAtcoderRanking(res.data.result[0].rating));

          localStorage.setItem("profilePicURI", res.data.result[0].avatarURL);
          dispatch(userActions.setProfilePicURI(res.data.result[0].avatarURL));
        }
      } catch (error) {
        console.log("erro when try to fetch atcoder user info");
      }
    };

    const checkUvaUser = async () => {
      try {
        const res = await uvaApi.get(`/userInfo?handle=${uvaHandle}`);
        if (res.data.status === "FAILED") {
          setIsUvaUserValid(false);
        } else {
          localStorage.setItem("uvaHandle", uvaHandle);
          dispatch(handleActions.setUvaHandle(uvaHandle));

          localStorage.setItem("uvaAvgDacu", res.data.result[0].avgDacu);
          dispatch(userActions.setUvaAvgDacu(res.data.result[0].avgDacu));

          localStorage.setItem("userName", res.data.result[0].username);
          dispatch(userActions.setUserName(res.data.result[0].username));

          localStorage.setItem("profilePicURI", res.data.result[0].avatar);
          dispatch(userActions.setProfilePicURI(res.data.result[0].avatar));
        }
      } catch (error) {
        console.log("erro when try to fetch uva user info");
      }
    };

    const checkSpojUser = async () => {
      try {
        const res = await spojApi.get(`/userInfo?handle=${spojHandle}`);
        if (res.data.status === "FAILED") {
          setIsSpojUserValid(false);
        } else {
          localStorage.setItem("spojHandle", spojHandle);
          dispatch(handleActions.setSpojHandle(spojHandle));

          localStorage.setItem("spojRanking", res.data.result[0].rank);
          dispatch(userActions.setSpojRanking(res.data.result[0].rank));

          localStorage.setItem("userName", res.data.result[0].userName);
          dispatch(userActions.setUserName(res.data.result[0].userName));

          localStorage.setItem("profilePicURI", res.data.result[0].avatarURL);
          dispatch(userActions.setProfilePicURI(res.data.result[0].avatarURL));
        }
      } catch (error) {
        console.log("erro when try to fetch spoj user info");
      }
    };

    const checkCodechefUser = async () => {
      try {
        const res = await codechefApi.get(`/userInfo?handle=${codechefHandle}`);
        if (res.data.status === "FAILED") {
          setIsCodechefUserValid(false);
        } else {
          localStorage.setItem("codechefHandle", codechefHandle);
          dispatch(handleActions.setCodechefHandle(codechefHandle));

          localStorage.setItem("codechefRanking", res.data.result[0].rating);
          dispatch(userActions.setCodechefRanking(res.data.result[0].rating));

          localStorage.setItem("userName", res.data.result[0].username);
          dispatch(userActions.setUserName(res.data.result[0].username));
        }
      } catch (error) {
        console.log("erro when try to fetch codechef user info");
      }
    };

    setIsLoading(true);

    if (!!codeforcesHandle && isFormSubmitted) checkCodeforcesUser();
    if (!!atcoderHandle && isFormSubmitted) checkAtcoderUser();
    if (!!uvaHandle && isFormSubmitted) checkUvaUser();
    if (!!spojHandle && isFormSubmitted) checkSpojUser();
    if (!!codechefHandle && isFormSubmitted) checkCodechefUser();

    setIsLoading(false);

    if (
      isCodeforcesUserValid &&
      isAtcoderUserValid &&
      isUvaUserValid &&
      isSpojUserValid &&
      isCodechefUserValid &&
      isFormSubmitted
    ) {
      props.onClose();
    }
  }, [
    atcoderHandle,
    codechefHandle,
    codeforcesHandle,
    dispatch,
    isAtcoderUserValid,
    isCodechefUserValid,
    isCodeforcesUserValid,
    isFormSubmitted,
    isSpojUserValid,
    isUvaUserValid,
    props,
    spojHandle,
    uvaHandle,
  ]);

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
          onClick={() => setIsFormSubmitted(true)}
        >
          Save
        </LoadingButton>
      </Paper>
    </Modal>
  );
};

export default UserInfo;
