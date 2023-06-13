import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { Redirect } from "react-router-dom";

import Modal from "../../components/Modal/index.js";

import { Paper } from "@material-ui/core";
import Table from "../../components/Table/index.js";

import { atcoderApi } from "../../service/atcoderApi.js";
import { codeforcesApi } from "../../service/codeforcesApi.js";
import { uvaApi } from "../../service/uvaApi.js";
import { spojApi } from "../../service/spojApi.js";
import { codechefApi } from "../../service/codechefApi.js";

import classes from "./recommendation.module.css";
import Spinner from "../../components/Spinner/index.js";

import RecommendationFilter from "../../components/RecommendationFilter/index.js";
import { Button } from "@mui/material";

const tableColumns = ["Problem", "Difficulty", "Online Judge"];

const Recommendation = () => {
  const codeforcesHandle = useSelector(
    (state) => state.handles.codeforcesHandle
  );
  const uvaHandle = useSelector((state) => state.handles.uvaHandle);
  const atcoderHandle = useSelector((state) => state.handles.atcoderHandle);
  const spojHandle = useSelector((state) => state.handles.spojHandle);
  const codechefHandle = useSelector((state) => state.handles.codechefHandle);

  const [recommendationMethod, setRecommendationMethod] =
    useState("byUserRating");
  const [tag, setTag] = useState("");
  const [minDifficulty, setMinDifficulty] = useState("");
  const [maxDifficulty, setMaxDifficulty] = useState("");
  const [cpBookEdition, setCpBookEdition] = useState("");

  const [queryParams, setQueryParams] = useState("");

  const [onlineJudge, setOnlineJudge] = useState(
    !!codeforcesHandle
      ? "Codeforces"
      : !!uvaHandle
      ? "Uva"
      : !!atcoderHandle
      ? "Atcoder"
      : !!spojHandle
      ? "Spoj"
      : !!codechefHandle
      ? "Codechef"
      : ""
  );

  const [recommendation, setRecommendation] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [shoNotDataFoundModal, setShowNotDataFoundModal] = useState(false);

  const hideModal = () => {
    setShowNotDataFoundModal(false);
  };

  useEffect(() => {
    const getCodeforcesRecommendation = async () => {
      try {
        setIsLoading(true);
        const response = await codeforcesApi.get(
          `/recommendation/${recommendationMethod}?handle=${codeforcesHandle}&${queryParams}`
        );
        setRecommendation(
          response.data.result.map((res) => ({
            problem: (
              <a
                href={`https://codeforces.com/contest/${res.contestId}/problem/${res.index}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {res.name}
              </a>
            ),
            difficulty: <p>{res.rating}</p>,
            onlineJudge: <p>Codeforces</p>,
          }))
        );
        setIsLoading(false);
        setShowNotDataFoundModal(response.data.result.length <= 0);
      } catch (error) {
        console.log("erro when try to fetch codeforces recommendation");
      }
    };

    const getUvaRecommendation = async () => {
      try {
        setIsLoading(true);
        const response = await uvaApi.get(
          `/recommendation/${recommendationMethod}?handle=${uvaHandle}&${queryParams}`
        );
        setRecommendation(
          response.data.result.map((res) => ({
            problem: (
              <a
                href={`https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&category=8&page=show_problem&problem=${res.id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {res.title}
              </a>
            ),
            difficulty: <p>{res.dacu}</p>,
            onlineJudge: <p>Online Judge</p>,
          }))
        );
        setIsLoading(false);
        setShowNotDataFoundModal(response.data.result.length <= 0);
      } catch (error) {
        console.log("erro when try to fetch online judgge recommendation");
      }
    };

    const getAtcoderRecommendation = async () => {
      try {
        setIsLoading(true);
        const response = await atcoderApi.get(
          `/recommendation/${recommendationMethod}?handle=${atcoderHandle}&${queryParams}`
        );
        setRecommendation(
          response.data.result.map((res) => ({
            problem: (
              <a
                href={`https://atcoder.jp/contests/${res.contestId}/tasks/${res.problemId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {res.title}
              </a>
            ),
            difficulty: <p>{res.difficulty}</p>,
            onlineJudge: <p>Atcoder</p>,
          }))
        );
        setIsLoading(false);
        setShowNotDataFoundModal(response.data.result.length <= 0);
      } catch (error) {
        console.log("erro when try to fetch atcoder recommendation");
      }
    };

    const getSPOJRecommendation = async () => {
      try {
        setIsLoading(true);
        const response = await spojApi.get(
          `/recommendation/${recommendationMethod}?handle=${spojHandle}&${queryParams}`
        );
        setRecommendation(
          response.data.result.map((res) => ({
            problem: (
              <a
                href={`https://www.spoj.com/problems/${res.problemId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {res.problemName}
              </a>
            ),
            difficulty: <p>{res.users}</p>,
            onlineJudge: <p>SPOJ</p>,
          }))
        );
        setIsLoading(false);
        setShowNotDataFoundModal(response.data.result.length <= 0);
      } catch (error) {
        console.log("erro when try to fetch spoj recommendation");
      }
    };

    const getCodechefRecommendation = async () => {
      try {
        setIsLoading(true);
        const response = await codechefApi.get(
          `/recommendation/${recommendationMethod}?handle=${codechefHandle}&${queryParams}`
        );
        setRecommendation(
          response.data.result.map((res) => ({
            problem: (
              <a
                href={`https://www.codechef.com/problems/${res.problemId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {res.problemName}
              </a>
            ),
            difficulty: <p>{res.difficulty}</p>,
            onlineJudge: <p>Codechef</p>,
          }))
        );
        setIsLoading(false);
        setShowNotDataFoundModal(response.data.result.length <= 0);
      } catch (error) {
        console.log("erro when try to fetch codechef recommendation");
      }
    };

    const fixOnlineJudge = async () => {
      await setOnlineJudge(
        !!codeforcesHandle
          ? "Codeforces"
          : !!uvaHandle
          ? "Uva"
          : !!atcoderHandle
          ? "Atcoder"
          : !!spojHandle
          ? "Spoj"
          : !!codechefHandle
          ? "Codechef"
          : ""
      );
    };

    if (
      !onlineJudge &&
      (!!codeforcesHandle ||
        !!atcoderHandle ||
        !!uvaHandle ||
        !!spojHandle ||
        !!codechefHandle)
    ) {
      fixOnlineJudge();
    }

    if (onlineJudge === "Codeforces" && !!codeforcesHandle)
      getCodeforcesRecommendation();
    if (onlineJudge === "Uva" && !!uvaHandle) getUvaRecommendation();
    if (onlineJudge === "Atcoder" && !!atcoderHandle)
      getAtcoderRecommendation();
    if (onlineJudge === "Spoj" && !!spojHandle) getSPOJRecommendation();
    if (onlineJudge === "Codechef" && !!codechefHandle)
      getCodechefRecommendation();
  }, [
    codeforcesHandle,
    uvaHandle,
    atcoderHandle,
    spojHandle,
    codechefHandle,
    onlineJudge,
    recommendationMethod,
    queryParams,
  ]);

  return (
    <>
      {!codeforcesHandle && !uvaHandle && !atcoderHandle ? (
        <Redirect to="/" />
      ) : (
        <div className={classes.pageContent}>
          <Paper className={classes.tablePaper}>
            {isLoading ? (
              <>
                <Spinner />
              </>
            ) : (
              <>
                <RecommendationFilter
                  recommendationMethod={recommendationMethod}
                  setRecommendationMethod={setRecommendationMethod}
                  queryParams={queryParams}
                  setQueryParams={setQueryParams}
                  onlineJudge={onlineJudge}
                  setOnlineJudge={setOnlineJudge}
                  tag={tag}
                  setTag={setTag}
                  minDifficulty={minDifficulty}
                  setMinDifficulty={setMinDifficulty}
                  maxDifficulty={maxDifficulty}
                  setMaxDifficulty={setMaxDifficulty}
                  cpBookEdition={cpBookEdition}
                  setCpBookEdition={setCpBookEdition}
                />
                {recommendation.length > 0 && (
                  <Table columns={tableColumns} rows={recommendation} />
                )}
                {shoNotDataFoundModal && (
                  <Modal onClose={hideModal}>
                    <Paper className={classes.Paper}>
                      <h2>Data not Found</h2>
                      <div>
                        No recommendation was found for the user and method
                        selected!
                      </div>
                      <Button onClick={hideModal}>Close</Button>
                    </Paper>
                  </Modal>
                )}
              </>
            )}
          </Paper>
        </div>
      )}
    </>
  );
};

export default Recommendation;
