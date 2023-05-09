import { useDispatch } from "react-redux";
import { useState } from "react";
import { userActions } from "../../store/user";

import Modal from "../Modal";
import { Paper, TextField } from "@material-ui/core";
import LoadingButton from "@mui/lab/LoadingButton";

import { codeforcesApi } from "../../service/codeforcesApi";
import { uvaApi } from "../../service/uvaApi";
import { atcoderApi } from "../../service/atcoderApi";

import classes from "./userInfo.module.css";
import { spojApi } from "../../service/spojApi";

const UserInfo = (props) => {
  const [isCodeforcesUserValid, setIsCodeforcesUserValid] = useState(true);
  const [isUvaUserValid, setIsUvaUserValid] = useState(true);
  const [isAtcoderUserValid, setIsAtcoderUserValid] = useState(true);
  const [isSpojUserValid, setIsSpojUserValid] = useState(true);

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

  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const checkCodeforcesHandle = async (handles) => {
    if (handles === "") {
      return true;
    }

    const res = await codeforcesApi.get(`/userInfo?handle=${handles}`);

    return res.data.status !== "FAILED";
  };

  const checkUvaHandle = async (handle) => {
    if (handle === "") {
      return true;
    }

    const res = await uvaApi.get(`/userInfo?handle=${handle}`);

    return res.data.status !== "FAILED";
  };

  const checkAtcoderHandle = async (handle) => {
    if (handle === "") {
      return true;
    }

    const res = await atcoderApi.get(`/userInfo?handle=${handle}`);
    return res.data.status !== "FAILED";
  };

  const checkSpojHandle = async (handle) => {
    if (handle === "") {
      return true;
    }

    const res = await spojApi.get(`/userInfo?handle=${handle}`);
    return res.data.status !== "FAILED";
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    const codeforcesUserExists = await checkCodeforcesHandle(codeforcesHandle);
    const uvaUserExists = await checkUvaHandle(uvaHandle);
    const atcoderUserExists = await checkAtcoderHandle(atcoderHandle);
    const spojUserExists = await checkSpojHandle(spojHandle);

    setIsCodeforcesUserValid(codeforcesUserExists);
    setIsUvaUserValid(uvaUserExists);
    setIsAtcoderUserValid(atcoderUserExists);
    setIsSpojUserValid(spojUserExists);

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

    if (
      codeforcesUserExists &&
      uvaUserExists &&
      atcoderUserExists &&
      spojUserExists
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
