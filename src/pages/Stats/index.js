import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { Redirect } from "react-router-dom";

import { Paper } from "@material-ui/core";
import Table from "../../components/Table/index.js";
import Pagination from "@mui/material/Pagination";

import { atcoderApi } from "../../service/atcoderApi.js";
import { codeforcesApi } from "../../service/codeforcesApi.js";
import { uvaApi } from "../../service/uvaApi.js";

import classes from "./stats.module.css";
import Spinner from "../../components/Spinner/index.js";
import Filter from "../../components/Filter/index.js";
import { spojApi } from "../../service/spojApi.js";

const tableColumns = [
  "submissionId",
  "Problem",
  "Verdict",
  "Language",
  "Online Judge",
];

const rowsPerPage = 15;

const Stats = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [submissions, setSubmissions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const codeforcesHandle = useSelector((state) => state.user.codeforcesHandle);
  const uvaHandle = useSelector((state) => state.user.uvaHandle);
  const atcoderHandle = useSelector((state) => state.user.atcoderHandle);
  const spojHandle = useSelector((state) => state.user.spojHandle);

  const [onlineJudge, setOnlineJudge] = useState(
    !!codeforcesHandle
      ? "Codeforces"
      : !!uvaHandle
      ? "Uva"
      : !!atcoderHandle
      ? "Atcoder"
      : !!spojHandle
      ? "Spoj"
      : ""
  );
  const [verdict, setVerdict] = useState("Accepted");

  useEffect(() => {
    const getCodeforcesData = async () => {
      try {
        setIsLoading(true);
        const response = await codeforcesApi.get(
          `/submissions?handle=${codeforcesHandle}&page=${page}&count=${rowsPerPage}&verdict=${verdict}`
        );
        setSubmissions(
          response.data.result.map((res) => ({
            submission: (
              <a
                href={`https://codeforces.com/contest/${res.contestId}/submission/${res.id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {res.id}
              </a>
            ),
            problem: (
              <a
                href={`https://codeforces.com/contest/${res.contestId}/problem/${res.problem.index}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {res.problem.contestId}
                {res.problem.index}
              </a>
            ),
            verdict: (
              <p className={classes[parse(res.verdict)]}>{res.verdict}</p>
            ),
            language: <p>{res.programmingLanguage}</p>,
            onlineJudge: <p>Codeforces</p>,
          }))
        );
        setTotalPages(response.data.totalPages);
        setIsLoading(false);
      } catch (error) {
        console.log("erro when try to fetch codeforces submissions");
      }
    };

    const getUvaData = async () => {
      try {
        setIsLoading(true);
        const response = await uvaApi.get(
          `/submissions?handle=${uvaHandle}&page=${page}&count=${rowsPerPage}&verdict=${verdict}`
        );
        setSubmissions(
          response.data.result.map((res) => ({
            submission: <p>{res.submissionId}</p>,
            problem: (
              <a
                href={`https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&category=8&page=show_problem&problem=${res.problemId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {res.problemId}
              </a>
            ),
            verdict: (
              <p className={classes[parse(res.verdict)]}>{res.verdict}</p>
            ),
            language: <p>{res.language}</p>,
            onlineJudge: <p>UVA OJ</p>,
          }))
        );
        setTotalPages(response.data.totalPages);
        setIsLoading(false);
      } catch (error) {
        console.log("erro when try to fetch uva submissions");
      }
    };

    const getAtcoderData = async () => {
      try {
        setIsLoading(true);
        const response = await atcoderApi.get(
          `/submissions?handle=${atcoderHandle}&page=${page}&count=${rowsPerPage}&verdict=${verdict}`
        );
        setSubmissions(
          response.data.result.map((res) => ({
            submission: (
              <a
                href={`https://atcoder.jp/contests/${res.contestId}/submissions/${res.submissionId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {res.submissionId}
              </a>
            ),
            problem: (
              <a
                href={`https://atcoder.jp/contests/${res.contestId}/tasks/${res.problemId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {res.problemId}
              </a>
            ),
            verdict: (
              <p className={classes[parse(res.verdict)]}>{res.verdict}</p>
            ),
            language: <p>{res.language}</p>,
            OnlineJudge: <p>AtCoder</p>,
          }))
        );
        setTotalPages(response.data.totalPages);
        setIsLoading(false);
      } catch (error) {
        console.log("erro when try to fetch atcoder submissions");
      }
    };

    const getSpojData = async () => {
      try {
        setIsLoading(true);
        const response = await spojApi.get(
          `/submissions?handle=${spojHandle}&page=${page}&count=${rowsPerPage}&verdict=${verdict}`
        );
        setSubmissions(
          response.data.result.map((res) => ({
            submission: (
              <a
                href={`https://www.spoj.com/status/${res.problemId},${spojHandle}/`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Submission for {res.problemId}
              </a>
            ),
            problem: (
              <a
                href={`https://www.spoj.com/problems/${res.problemId}/`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {res.problemId}
              </a>
            ),
            verdict: (
              <p className={classes[parse(res.verdict)]}>{res.verdict}</p>
            ),
            language: <p> - </p>,
            OnlineJudge: <p>SPOJ</p>,
          }))
        );
        setTotalPages(response.data.totalPages);
        setIsLoading(false);
      } catch (error) {
        console.log("erro when try to fetch spoj submissions");
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
          : ""
      );
    };

    if (
      !onlineJudge &&
      (!!codeforcesHandle || !!atcoderHandle || !!uvaHandle || !!spojHandle)
    )
      fixOnlineJudge();
    if (onlineJudge === "Codeforces" && !!codeforcesHandle) getCodeforcesData();
    if (onlineJudge === "Uva" && !!uvaHandle) getUvaData();
    if (onlineJudge === "Atcoder" && !!atcoderHandle) getAtcoderData();
    if (onlineJudge === "Spoj" && !!spojHandle) getSpojData();
  }, [
    page,
    verdict,
    onlineJudge,
    codeforcesHandle,
    uvaHandle,
    atcoderHandle,
    spojHandle,
  ]);

  useEffect(() => {
    setPage(1);
  }, [
    codeforcesHandle,
    uvaHandle,
    atcoderHandle,
    spojHandle,
    onlineJudge,
    verdict,
  ]);

  const onPageChange = (event, page) => {
    setPage(page);
  };

  const parse = (verdict) => {
    if (verdict === "Accepted") {
      return "Accepted";
    } else if (verdict === "Wrong answer") {
      return "Wrong";
    }

    return "Tryed";
  };

  return (
    <>
      {!codeforcesHandle && !uvaHandle && !atcoderHandle && !spojHandle ? (
        <Redirect to="/" />
      ) : (
        <div className={classes.pageContent}>
          <Paper className={classes.tablePaper}>
            {isLoading ? (
              <Spinner />
            ) : (
              <>
                <Filter
                  verdict={verdict}
                  onlineJudge={onlineJudge}
                  setVerdict={setVerdict}
                  setOnlineJudge={setOnlineJudge}
                />
                <Table columns={tableColumns} rows={submissions} />
                <Pagination
                  size="small"
                  siblingCount={2}
                  boundaryCount={0}
                  count={totalPages}
                  page={page}
                  onChange={onPageChange}
                  style={{ marginTop: "16px", marginBottom: "16px" }}
                />
              </>
            )}
          </Paper>
        </div>
      )}
    </>
  );
};

export default Stats;
