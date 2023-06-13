import { useEffect, useState } from "react";

import { useSelector } from "react-redux";

import TuneIcon from "@mui/icons-material/Tune";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";

import classes from "./recommendationFilter.module.css";
import { Button } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

import codechefTags from "../../assets/ojTags/codechef-tags.json";
import codeforcesTags from "../..//assets/ojTags/codeforces-tags.json";
import spojTags from "../..//assets/ojTags/spoj-tags.json";
import uvaCP1Tags from "../..//assets/ojTags/uva-cp1.json";
import uvaCP2Tags from "../..//assets/ojTags/uva-cp2.json";
import uvaCP3Tags from "../..//assets/ojTags/uva-cp3.json";
import generateRandomKey from "../../utils/generateRandomKey";

const RecommendationFilter = (props) => {
  const [minDifficultyTooltip, setMinDifficultyTooltip] = useState("");
  const [maxDifficultyTooltip, setMaxDifficultyTooltip] = useState("");
  const [isOpenFilterPage, setIsOpenFilterPage] = useState(false);

  const [localOnlineJudge, setLocalOnlineJudge] = useState(props.onlineJudge);

  const [localRecommendationMethod, setLocalRecommendationMethod] = useState(
    props.recommendationMethod
  );
  const [localTag, setLocalTag] = useState(props.tag);
  const [localMinDifficulty, setLocalMinDifficulty] = useState(
    props.minDifficulty
  );
  const [localMaxDifficulty, setLocalMaxDifficulty] = useState(
    props.maxDifficulty
  );
  const [localCpBookEdition, setLocalCpBookEdition] = useState(
    props.cpBookEdition
  );

  const [shouldShowTagList, setShouldShowTagList] = useState(true);
  const [tagList, setTagList] = useState([]);
  const [allRequiredsFields, setAllRequiredFields] = useState(true);

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

  const handleMethodChange = (event) => {
    setLocalRecommendationMethod(event.target.value);
  };

  const handleChangeTag = (event) => {
    setLocalTag(event.target.value);
  };

  const handleMinDifficultyChange = (event) => {
    setLocalMinDifficulty(event.target.value);
  };

  const handleMaxDifficultyChange = (event) => {
    setLocalMaxDifficulty(event.target.value);
  };

  const getDifficultyPattern = () => {
    if (localOnlineJudge === "Codeforces" || localOnlineJudge === "Codechef") {
      return "Rating";
    } else if (localOnlineJudge === "Atcoder") {
      return "Difficulty";
    }
    return "Dacu";
  };

  const checkFields = () => {
    if (
      localRecommendationMethod === "byProblemRating" &&
      (!localMinDifficulty || !localMaxDifficulty)
    ) {
      setAllRequiredFields(false);
      return false;
    } else if (
      localRecommendationMethod === "byCPBook" &&
      !localCpBookEdition
    ) {
      setAllRequiredFields(false);
      return false;
    }
    setAllRequiredFields(true);
    return true;
  };

  const onClickFiltersHandle = () => {
    console.log("checkFields: ", checkFields());
    if (checkFields()) {
      props.setOnlineJudge(localOnlineJudge);
      props.setRecommendationMethod(localRecommendationMethod);
      props.setCpBookEdition(localCpBookEdition);
      props.setMinDifficulty(localMinDifficulty);
      props.setMaxDifficulty(localMaxDifficulty);
      props.setTag(localTag);
      const queryParams = `min${getDifficultyPattern()}=${localMinDifficulty}&max${getDifficultyPattern()}=${localMaxDifficulty}&tag=${localTag}&bookEdition=${localCpBookEdition}`;
      props.setQueryParams(queryParams);
      setIsOpenFilterPage((prevState) => !prevState);
    }
  };

  const onClickOpenFilter = () => {
    setIsOpenFilterPage((prevState) => !prevState);
  };

  useEffect(() => {
    const showTags = () => {
      return (
        (localRecommendationMethod === "byUserRating" &&
          (localOnlineJudge === "Spoj" ||
            localOnlineJudge === "Codeforces" ||
            localOnlineJudge === "Codechef")) ||
        (localOnlineJudge === "Uva" &&
          localRecommendationMethod === "byCPBook" &&
          !!localCpBookEdition)
      );
    };

    const setTooltipText = () => {
      if (localRecommendationMethod === "byProblemRating") {
        if (
          localOnlineJudge === "Codeforces" ||
          localOnlineJudge === "Codechef" ||
          localOnlineJudge === "Atcoder"
        ) {
          setMaxDifficultyTooltip(
            "the difficulty of the problems on this platform are similar to user ratings, so the higher the difficulty, the harder the problem will be"
          );
          setMinDifficultyTooltip(
            "The difficulty of the problems on this platform are similar to user ratings, so the lower the difficulty, the easier the problem will be."
          );
        } else {
          setMaxDifficultyTooltip(
            "the difficulty of the problems on this platform are based on how many people solved the question, so the higher the difficulty, the easier the problem will be"
          );
          setMinDifficultyTooltip(
            "the difficulty of the problems on this platform are based on how many people solved the question, so the lower the difficulty, the harder the problem will be"
          );
        }
      }
    };

    setTooltipText();

    const loadTagList = () => {
      if (localOnlineJudge === "Codeforces") {
        setTagList(codeforcesTags);
      } else if (localOnlineJudge === "Codechef") {
        setTagList(codechefTags);
      } else if (localOnlineJudge === "Spoj") {
        setTagList(spojTags);
      } else if (localCpBookEdition === 1) {
        setTagList(uvaCP1Tags);
      } else if (localCpBookEdition === 2) {
        setTagList(uvaCP2Tags);
      } else if (localCpBookEdition === 3) {
        setTagList(uvaCP3Tags);
      }
      return true;
    };

    const shouldListTags = showTags();
    setShouldShowTagList(shouldListTags);

    if (shouldListTags) loadTagList();
    else setLocalTag("");

    if (localRecommendationMethod !== "byProblemRating") {
      setLocalMinDifficulty("");
      setLocalMaxDifficulty("");
    }

    if (localRecommendationMethod !== "byCPBook") setLocalCpBookEdition("");
  }, [localRecommendationMethod, localOnlineJudge, localCpBookEdition]);

  useEffect(() => {
    setLocalRecommendationMethod("byUserRating");
  }, [localOnlineJudge]);

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
          {!!localRecommendationMethod && (
            <div className={classes.filterBox}>
              <p className={classes.title}>Method:</p>
              <p>{localRecommendationMethod}</p>
            </div>
          )}
          {!!localMinDifficulty && (
            <div className={classes.filterBox}>
              <p className={classes.title}>min Difficulty:</p>
              <p>{localMinDifficulty}</p>
            </div>
          )}
          {!!localMaxDifficulty && (
            <div className={classes.filterBox}>
              <p className={classes.title}>max Difficulty:</p>
              <p>{localMaxDifficulty}</p>
            </div>
          )}
          {!!localCpBookEdition && (
            <div className={classes.filterBox}>
              <p className={classes.title}>Book Edition:</p>
              <p>{localCpBookEdition}</p>
            </div>
          )}
          {!!localTag && (
            <div className={classes.filterBox}>
              <p className={classes.title}>Tag:</p>
              <p>{localTag}</p>
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
                  <MenuItem value={"Uva"}>Uva Online Judge</MenuItem>
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
              <InputLabel>Method</InputLabel>
              <Select
                value={localRecommendationMethod}
                label="Method"
                onChange={handleMethodChange}
              >
                <MenuItem value={"randomRecommendation"}>
                  Random Recommendation
                </MenuItem>
                <MenuItem value={"byUserRating"}>By User Rating</MenuItem>
                <MenuItem value={"byProblemRating"}>By Problem Rating</MenuItem>
                {localOnlineJudge === "Uva" && (
                  <MenuItem value={"byCPBook"}>
                    By Competitive Programming Book
                  </MenuItem>
                )}
              </Select>
            </FormControl>
          </div>
          {localRecommendationMethod === "byProblemRating" && (
            <div className={classes.filtersValue}>
              <div className={classes.tooltipField}>
                <FormControl sx={{ width: "40ch" }}>
                  <TextField
                    label="minDifficulty"
                    value={localMinDifficulty || ""}
                    onChange={handleMinDifficultyChange}
                    error={!allRequiredsFields && !localMinDifficulty}
                    helperText={
                      !allRequiredsFields && !localMinDifficulty
                        ? "This field is required!"
                        : " "
                    }
                  />
                </FormControl>
                <div className={classes.tooltip}>
                  <Tooltip title={minDifficultyTooltip} arrow>
                    <HelpOutlineIcon />
                  </Tooltip>
                </div>
              </div>
              <div className={classes.tooltipField}>
                <FormControl sx={{ width: "40ch" }}>
                  <TextField
                    label="maxDifficulty"
                    value={localMaxDifficulty || ""}
                    onChange={handleMaxDifficultyChange}
                    error={!allRequiredsFields && !localMaxDifficulty}
                    helperText={
                      !allRequiredsFields && !localMaxDifficulty
                        ? "This field is required!"
                        : " "
                    }
                  />
                </FormControl>
                <div className={classes.tooltip}>
                  <Tooltip title={maxDifficultyTooltip} arrow>
                    <HelpOutlineIcon />
                  </Tooltip>
                </div>
              </div>
            </div>
          )}
          {localRecommendationMethod === "byCPBook" && (
            <div className={classes.filtersValue}>
              <FormControl fullWidth>
                <InputLabel>Book Edition</InputLabel>
                <Select
                  value={localCpBookEdition || ""}
                  label="cpBookEdition"
                  onChange={(event) => {
                    setLocalCpBookEdition(event.target.value);
                  }}
                  error={!allRequiredsFields && !localCpBookEdition}
                  helperText={
                    !allRequiredsFields && !localCpBookEdition
                      ? "This field is required!"
                      : " "
                  }
                >
                  <MenuItem key={generateRandomKey()} value={1}>
                    1
                  </MenuItem>
                  <MenuItem key={generateRandomKey()} value={2}>
                    2
                  </MenuItem>
                  <MenuItem key={generateRandomKey()} value={3}>
                    3
                  </MenuItem>
                </Select>
              </FormControl>
            </div>
          )}
          {shouldShowTagList && (
            <div className={classes.filtersValue}>
              <FormControl fullWidth>
                <InputLabel>Tags</InputLabel>
                <Select value={localTag} label="Tag" onChange={handleChangeTag}>
                  {tagList.map((tags) => {
                    return (
                      <MenuItem key={generateRandomKey()} value={tags}>
                        {tags}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </div>
          )}
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

export default RecommendationFilter;
