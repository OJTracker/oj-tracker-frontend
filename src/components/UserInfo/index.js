import { useDispatch } from "react-redux";
import { useState } from "react";
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

  const checkOjHandle = async (ojApi, handle) => {
    if (handle === "") {
      return true;
    }
    const res = await ojApi.get(`/userInfo?handle=${handle}`);
    return res.data.status !== "FAILED";
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    const codeforcesUserExists = await checkOjHandle(
      codeforcesApi,
      codeforcesHandle
    );
    const uvaUserExists = await checkOjHandle(uvaApi, uvaHandle);
    const atcoderUserExists = await checkOjHandle(atcoderApi, atcoderHandle);
    const spojUserExists = await checkOjHandle(spojApi, spojHandle);
    const codechefUserExists = await checkOjHandle(codechefApi, codechefHandle);

    setIsCodeforcesUserValid(codeforcesUserExists);
    setIsUvaUserValid(uvaUserExists);
    setIsAtcoderUserValid(atcoderUserExists);
    setIsSpojUserValid(spojUserExists);
    setIsCodechefUserValid(codechefUserExists);

    if (codeforcesUserExists) {
      localStorage.setItem("codeforcesHandle", codeforcesHandle);
      dispatch(userActions.setCodeforcesHandle(codeforcesHandle));
    }

    if (uvaUserExists) {
      localStorage.setItem("uvaHandle", uvaHandle);
      dispatch(userActions.setUvaHandle(uvaHandle));
    }

    if (atcoderUserExists) {
      localStorage.setItem("atcoderHandle", atcoderHandle);
      dispatch(userActions.setAtcoderHandle(atcoderHandle));
    }

    if (spojUserExists) {
      localStorage.setItem("spojHandle", spojHandle);
      dispatch(userActions.setSpojHandle(spojHandle));
    }

    if (codechefUserExists) {
      localStorage.setItem("codechefHandle", codechefHandle);
      dispatch(userActions.setCodechefHandle(codechefHandle));
    }

    if (
      codeforcesUserExists &&
      uvaUserExists &&
      atcoderUserExists &&
      spojUserExists &&
      codechefUserExists
    ) {
      props.onClose();
    }

    setIsLoading(false);
  };

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
          onClick={handleSubmit}
        >
          Save
        </LoadingButton>
      </Paper>
    </Modal>
  );
};

export default UserInfo;
