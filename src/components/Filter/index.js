import { useState } from "react";

import { useSelector } from "react-redux";

import TuneIcon from "@mui/icons-material/Tune";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import classes from "./filter.module.css";
import { Button } from "@mui/material";

const Filter = (props) => {
  const [isOpenFilterPage, setIsOpenFilterPage] = useState(false);
  const [localOnlineJudge, setLocalOnlineJudge] = useState(props.onlineJudge);
  const [localVerdict, setLocalVerdict] = useState(props.verdict);

  const codeforcesHandle = useSelector(
    (state) => state.handles.codeforcesHandle
  );
  const uvaHandle = useSelector((state) => state.handles.uvaHandle);
  const atcoderHandle = useSelector((state) => state.handles.atcoderHandle);
  const spojHandle = useSelector((state) => state.handles.spojHandle);
  const codechefHandle = useSelector((state) => state.handles.codechefHandle);

  const handleOnlineJudgeChange = (event) => {
    setLocalOnlineJudge(event.target.value);
  };

  const handleVerdictChange = (event) => {
    setLocalVerdict(event.target.value);
  };

  const onClickFiltersHandle = () => {
    props.setOnlineJudge(localOnlineJudge);
    props.setVerdict(localVerdict);
    setIsOpenFilterPage((prevState) => !prevState);
  };

  const onClickOpenFilter = () => {
    setIsOpenFilterPage((prevState) => !prevState);
  };

  return (
    <>
      <div
        className={`${classes.filters} ${
          isOpenFilterPage ? classes.roundedJustOnTop : classes.rounded
        }`}
      >
        <div className={classes.filtersActives}>
          <p className={classes.title}>Filters: </p>
          {!!localOnlineJudge && (
            <div className={classes.filterBox}>
              <p className={classes.title}>Online Judge:</p>
              <p>{localOnlineJudge}</p>
            </div>
          )}
          {!!localVerdict && (
            <div className={classes.filterBox}>
              <p className={classes.title}>Verdict:</p>
              <p>{localVerdict}</p>
            </div>
          )}
        </div>
        <div className={classes.filterButton}>
          <IconButton
            style={{ color: "white" }}
            aria-label="filter"
            onClick={onClickOpenFilter}
          >
            <TuneIcon />
          </IconButton>
        </div>
      </div>
      {isOpenFilterPage && (
        <div
          className={`${classes.filterExpanded} ${classes.roundedJustOnBottom}`}
        >
          <div className={classes.filtersValue}>
            <FormControl fullWidth>
              <InputLabel style={{ borderBlockColor: "black" }}>
                Online Judge
              </InputLabel>
              <Select
                value={localOnlineJudge}
                label="Online Judge"
                onChange={handleOnlineJudgeChange}
              >
                {!!codeforcesHandle && (
                  <MenuItem value={"Codeforces"}>Codeforces</MenuItem>
                )}
                {!!uvaHandle && (
                  <MenuItem value={"Online Judge"}>Online Judge</MenuItem>
                )}
                {!!atcoderHandle && (
                  <MenuItem value={"Atcoder"}>Atcoder</MenuItem>
                )}
                {!!spojHandle && <MenuItem value={"Spoj"}>SPOJ</MenuItem>}
                {!!codechefHandle && (
                  <MenuItem value={"Codechef"}>Codechef</MenuItem>
                )}
              </Select>
            </FormControl>
          </div>
          <div className={classes.filtersValue}>
            <FormControl fullWidth>
              <InputLabel>Verdict</InputLabel>
              <Select
                value={localVerdict}
                label="Verdict"
                onChange={handleVerdictChange}
              >
                <MenuItem value={""}>Select verdict</MenuItem>
                <MenuItem value={"Accepted"}>Accepted</MenuItem>
                <MenuItem value={"Wrong Answer"}>Wrong Answer</MenuItem>
              </Select>
            </FormControl>
          </div>
          <Button
            variant="contained"
            style={{
              marginLeft: "16px",
              backgroundColor: "#4a8ddc",
              color: "white",
            }}
            onClick={onClickFiltersHandle}
          >
            Apply filters
          </Button>
        </div>
      )}
    </>
  );
};

export default Filter;
