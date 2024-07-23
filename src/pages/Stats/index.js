import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { Redirect } from "react-router-dom";

import Table from "../../components/Table/index.js";
import Pagination from "@mui/material/Pagination";

import Modal from "../../components/Modal/index.js";

import { atcoderApi } from "../../service/atcoderApi.js";
import { codeforcesApi } from "../../service/codeforcesApi.js";
import { uvaApi } from "../../service/uvaApi.js";

import classes from "./stats.module.css";
import Spinner from "../../components/Spinner/index.js";
import { spojApi } from "../../service/spojApi.js";
import { codechefApi } from "../../service/codechefApi.js";

import Chart from "../../components/Chart/index.js";

const tableColumns = [
  "submissionId",
  "Problem",
  "Verdict",
  "Language",
  "Online Judge",
];

const rowsPerPage = 5;

const Stats = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [shouldGetSubmissions, setShouldGetSubmissions] = useState(false);
  const [isSubmissionsLoading, setIsSubmissionsLoading] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [codeforcesUserStats, setCodeforcesUserStats] = useState([]);
  const [atcoderUserStats, setAtcoderUserStats] = useState([]);
  const [uvaUserStats, setUvaUserStats] = useState([]);
  const [spojUserStats, setSpojUserStats] = useState([]);
  const [codechefUserStats, setCodechefUserStats] = useState([]);

  const [shouldShowModal, setShouldShowModal] = useState(false);

  const showModal = () => {
    setShouldShowModal(true);
  };

  const hideModal = () => {
    setShouldShowModal(false);
    setShouldGetSubmissions(false);
  };

  const codeforcesHandle = useSelector(
    (state) => state.handles.codeforcesHandle
  );
  const uvaHandle = useSelector((state) => state.handles.uvaHandle);
  const atcoderHandle = useSelector((state) => state.handles.atcoderHandle);
  const spojHandle = useSelector((state) => state.handles.spojHandle);
  const codechefHandle = useSelector((state) => state.handles.codechefHandle);

  const [onlineJudge, setOnlineJudge] = useState("");

  const [verdict, setVerdict] = useState("Accepted");

  useEffect(() => {
    const getCodeforcesData = async () => {
      try {
        setIsSubmissionsLoading(true);
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
        setIsSubmissionsLoading(false);
      } catch (error) {
        console.log("erro when try to fetch codeforces submissions");
      }
    };

    const getUvaData = async () => {
      try {
        setIsSubmissionsLoading(true);
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
                {res.title}
              </a>
            ),
            verdict: (
              <p className={classes[parse(res.verdict)]}>{res.verdict}</p>
            ),
            language: <p>{res.language}</p>,
            onlineJudge: <p>Online Judge OJ</p>,
          }))
        );
        setTotalPages(response.data.totalPages);
        setIsSubmissionsLoading(false);
      } catch (error) {
        console.log("erro when try to fetch Online Judge submissions");
      }
    };

    const getAtcoderData = async () => {
      try {
        setIsSubmissionsLoading(true);
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
        setIsSubmissionsLoading(false);
      } catch (error) {
        console.log("erro when try to fetch atcoder submissions");
      }
    };

    const getSpojData = async () => {
      try {
        setIsSubmissionsLoading(true);
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
        setIsSubmissionsLoading(false);
      } catch (error) {
        console.log("erro when try to fetch spoj submissions");
      }
    };

    const getCodechefData = async () => {
      try {
        setIsSubmissionsLoading(true);
        const response = await codechefApi.get(
          `/submissions?handle=${codechefHandle}&page=${page}&count=${rowsPerPage}&verdict=${verdict}`
        );
        setSubmissions(
          response.data.result.map((res) => ({
            submission: (
              <a
                href={`https://www.codechef.com/status/${res.problemId}?usernames=${codechefHandle}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Submission for {res.problemId}
              </a>
            ),
            problem: (
              <a
                href={`https://www.codechef.com/problems/${res.problemId}`}
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
            OnlineJudge: <p>Codechef</p>,
          }))
        );
        setTotalPages(response.data.totalPages);
        setIsSubmissionsLoading(false);
      } catch (error) {
        console.log("erro when try to fetch codechef submissions");
      }
    };
    if (onlineJudge === "Codeforces" && shouldGetSubmissions)
      getCodeforcesData();
    if (onlineJudge === "Online Judge" && shouldGetSubmissions) getUvaData();
    if (onlineJudge === "Atcoder" && shouldGetSubmissions) getAtcoderData();
    if (onlineJudge === "Spoj" && shouldGetSubmissions) getSpojData();
    // TO-DO if (onlineJudge === "Codechef" && shouldGetSubmissions) getCodechefData();
  }, [
    page,
    verdict,
    onlineJudge,
    codeforcesHandle,
    uvaHandle,
    atcoderHandle,
    spojHandle,
    codechefHandle,
    shouldGetSubmissions,
  ]);

  useEffect(() => {
    setPage(1);
  }, [onlineJudge]);

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

  const getRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
  };

  useEffect(() => {
    const getCodeforcesUserStats = async () => {
      try {
        const response = await codeforcesApi.get(
          `/userStats?handle=${codeforcesHandle}`
        );
        setCodeforcesUserStats([
          {
            labels: ["AC Count", "WA Count", "Others Verdicts Count"],
            datasets: [
              {
                data: [
                  response.data.result[0].acCount,
                  response.data.result[0].waCount,
                  response.data.result[0].othersVerdictCount,
                ],
                backgroundColor: ["#33ae81", "#dc5b57", "#dd915f"],
                hoverBackgroundColor: ["#33ae81", "#dc5b57", "#dd915f"],
              },
            ],
          },
          {
            labels: Object.keys(response.data.result[0].tagsCount).map(
              (tag) => tag
            ),
            datasets: [
              {
                data: Object.keys(response.data.result[0].tagsCount).map(
                  (tag) => response.data.result[0].tagsCount[tag]
                ),
                backgroundColor: Object.keys(
                  response.data.result[0].tagsCount
                ).map((tag) => getRandomColor()),
                hoverBackgroundColor: Object.keys(
                  response.data.result[0].tagsCount
                ).map((tag) => getRandomColor()),
              },
            ],
          },
        ]);
      } catch (error) {
        console.log("erro when try to fetch codeforces user stats");
      }
    };

    const getAtcoderUserStats = async () => {
      try {
        const response = await atcoderApi.get(
          `/userStats?handle=${atcoderHandle}`
        );
        setAtcoderUserStats([
          {
            labels: ["AC Count", "WA Count", "Others Verdicts Count"],
            datasets: [
              {
                data: [
                  response.data.result[0].acCount,
                  response.data.result[0].waCount,
                  response.data.result[0].othersVerdictCount,
                ],
                backgroundColor: ["#33ae81", "#dc5b57", "#dd915f"],
                hoverBackgroundColor: ["#33ae81", "#dc5b57", "#dd915f"],
              },
            ],
          },
          {
            labels: Object.keys(response.data.result[0].contestsIndexCount).map(
              (tag) => tag
            ),
            datasets: [
              {
                data: Object.keys(
                  response.data.result[0].contestsIndexCount
                ).map((tag) => response.data.result[0].contestsIndexCount[tag]),
                backgroundColor: Object.keys(
                  response.data.result[0].contestsIndexCount
                ).map((tag) => getRandomColor()),
                hoverBackgroundColor: Object.keys(
                  response.data.result[0].contestsIndexCount
                ).map((tag) => getRandomColor()),
              },
            ],
          },
        ]);
      } catch (error) {
        console.log("erro when try to fetch atcoder user stats");
      }
    };

    const getUvaUserStats = async () => {
      try {
        const response = await uvaApi.get(`/userStats?handle=${uvaHandle}`);
        setUvaUserStats([
          {
            labels: ["AC Count", "WA Count", "Others Verdicts Count"],
            datasets: [
              {
                data: [
                  response.data.result[0].acCount,
                  response.data.result[0].waCount,
                  response.data.result[0].othersVerdictCount,
                ],
                backgroundColor: ["#33ae81", "#dc5b57", "#dd915f"],
                hoverBackgroundColor: ["#33ae81", "#dc5b57", "#dd915f"],
              },
            ],
          },
        ]);
      } catch (error) {
        console.log("erro when try to fetch Online Judge user stats");
      }
    };

    const getSpojUserStats = async () => {
      try {
        const response = await spojApi.get(`/userStats?handle=${spojHandle}`);
        setSpojUserStats([
          {
            labels: ["AC Count", "WA Count", "Others Verdicts Count"],
            datasets: [
              {
                data: [
                  response.data.result[0].acCount,
                  response.data.result[0].waCount,
                  response.data.result[0].othersVerdictCount,
                ],
                backgroundColor: ["#33ae81", "#dc5b57", "#dd915f"],
                hoverBackgroundColor: ["#33ae81", "#dc5b57", "#dd915f"],
              },
            ],
          },
          {
            labels: Object.keys(response.data.result[0].tagsCount).map(
              (tag) => tag
            ),
            datasets: [
              {
                data: Object.keys(response.data.result[0].tagsCount).map(
                  (tag) => response.data.result[0].tagsCount[tag]
                ),
                backgroundColor: Object.keys(
                  response.data.result[0].tagsCount
                ).map((tag) => getRandomColor()),
                hoverBackgroundColor: Object.keys(
                  response.data.result[0].tagsCount
                ).map((tag) => getRandomColor()),
              },
            ],
          },
        ]);
      } catch (error) {
        console.log("erro when try to fetch spoj user stats");
      }
    };

    const getCodechefUserStats = async () => {
      try {
        const response = await codechefApi.get(
          `/userStats?handle=${codechefHandle}`
        );
        setCodechefUserStats([
          {
            labels: ["AC Count", "WA Count", "Others Verdicts Count"],
            datasets: [
              {
                data: [
                  response.data.result[0].acCount,
                  response.data.result[0].waCount,
                  response.data.result[0].othersVerdictCount,
                ],
                backgroundColor: ["#33ae81", "#dc5b57", "#dd915f"],
                hoverBackgroundColor: ["#33ae81", "#dc5b57", "#dd915f"],
              },
            ],
          },
          {
            labels: Object.keys(response.data.result[0].tagsCount).map(
              (tag) => tag
            ),
            datasets: [
              {
                data: Object.keys(response.data.result[0].tagsCount).map(
                  (tag) => response.data.result[0].tagsCount[tag]
                ),
                backgroundColor: Object.keys(
                  response.data.result[0].tagsCount
                ).map((tag) => getRandomColor()),
                hoverBackgroundColor: Object.keys(
                  response.data.result[0].tagsCount
                ).map((tag) => getRandomColor()),
              },
            ],
          },
        ]);
      } catch (error) {
        console.log("erro when try to fetch codechef user stats");
      }
    };

    const getOnlineJudgeUserStats = async () => {
      setIsLoading(true);

      if (!!codeforcesHandle) await getCodeforcesUserStats();
      if (!!atcoderHandle) await getAtcoderUserStats();
      if (!!uvaHandle) await getUvaUserStats();
      if (!!spojHandle) await getSpojUserStats();
      // TO-DO if (!!codechefHandle) await getCodechefUserStats();

      setIsLoading(false);
    };

    getOnlineJudgeUserStats();
  }, [codeforcesHandle, atcoderHandle, uvaHandle, spojHandle, codechefHandle]);

  return (
    <>
      {!codeforcesHandle &&
      !uvaHandle &&
      !atcoderHandle &&
      !spojHandle &&
      !codechefHandle ? (
        <Redirect to="/" />
      ) : (
        <div className={classes.pageContent}>
          {isLoading ? (
            <div className={classes.spinnerDiv}>
              <Spinner />
            </div>
          ) : (
            <>
              {codeforcesUserStats.length > 0 && (
                <>
                  <h1>Codeforces Stats: </h1>
                  <div className={classes.chartField}>
                    <Chart
                      data={codeforcesUserStats[0]}
                      onClick={(event, elements) => {
                        if (elements.length > 0) {
                          setOnlineJudge("Codeforces");
                          const selectedIndex = elements[0].index;
                          setVerdict(
                            selectedIndex === 0 ? "Accepted" : "Wrong Answer"
                          );
                          setShouldGetSubmissions(selectedIndex <= 1);
                          setShouldShowModal(selectedIndex <= 1);
                        }
                      }}
                    />
                    <Chart
                      data={codeforcesUserStats[1]}
                      onClick={(event, elements) => {
                        if (elements.length > 0) {
                          const selectedIndex = elements[0].index;
                          console.log("Dado selecionado:", selectedIndex);
                        }
                      }}
                    />
                  </div>
                </>
              )}
              {atcoderUserStats.length > 0 && (
                <>
                  <h1>Atcoder Stats: </h1>
                  <div className={classes.chartField}>
                    <Chart
                      data={atcoderUserStats[0]}
                      onClick={(event, elements) => {
                        if (elements.length > 0) {
                          setOnlineJudge("Atcoder");
                          const selectedIndex = elements[0].index;
                          setVerdict(
                            selectedIndex === 0 ? "Accepted" : "Wrong Answer"
                          );
                          setShouldGetSubmissions(selectedIndex <= 1);
                          setShouldShowModal(selectedIndex <= 1);
                        }
                      }}
                    />
                    <Chart
                      data={atcoderUserStats[1]}
                      onClick={(event, elements) => {
                        if (elements.length > 0) {
                          const selectedIndex = elements[0].index;
                          console.log("Dado selecionado:", selectedIndex);
                        }
                      }}
                    />
                  </div>
                </>
              )}
              {uvaUserStats.length > 0 && (
                <>
                  <h1>Online Judge Stats: </h1>
                  <div className={classes.chartField}>
                    <Chart
                      data={uvaUserStats[0]}
                      onClick={(event, elements) => {
                        if (elements.length > 0) {
                          setOnlineJudge("Online Judge");
                          const selectedIndex = elements[0].index;
                          setVerdict(
                            selectedIndex === 0 ? "Accepted" : "Wrong Answer"
                          );
                          setShouldGetSubmissions(selectedIndex <= 1);
                          setShouldShowModal(selectedIndex <= 1);
                        }
                      }}
                    />
                  </div>
                </>
              )}
              {spojUserStats.length > 0 && (
                <>
                  <h1>SPOJ Stats: </h1>
                  <div className={classes.chartField}>
                    <Chart
                      data={spojUserStats[0]}
                      onClick={(event, elements) => {
                        if (elements.length > 0) {
                          setOnlineJudge("Spoj");
                          const selectedIndex = elements[0].index;
                          setVerdict(
                            selectedIndex === 0 ? "Accepted" : "Wrong Answer"
                          );
                          setShouldGetSubmissions(selectedIndex <= 1);
                          setShouldShowModal(selectedIndex <= 1);
                        }
                      }}
                    />
                    <Chart
                      data={spojUserStats[1]}
                      onClick={(event, elements) => {
                        if (elements.length > 0) {
                          const selectedIndex = elements[0].index;
                          console.log("Dado selecionado:", selectedIndex);
                        }
                      }}
                    />
                  </div>
                </>
              )}
              {codechefUserStats.length > 0 && (
                <>
                  <h1>Codechef Stats: </h1>
                  <div
                    className={classes.chartField}
                    style={{ marginBottom: "16px" }}
                  >
                    <Chart
                      data={codechefUserStats[0]}
                      onClick={(event, elements) => {
                        if (elements.length > 0) {
                          setOnlineJudge("Codechef");
                          const selectedIndex = elements[0].index;
                          setVerdict(
                            selectedIndex === 0 ? "Accepted" : "Wrong Answer"
                          );
                          setShouldGetSubmissions(selectedIndex <= 1);
                          setShouldShowModal(selectedIndex <= 1);
                        }
                      }}
                    />
                    <Chart
                      data={codechefUserStats[1]}
                      onClick={(event, elements) => {
                        if (elements.length > 0) {
                          const selectedIndex = elements[0].index;
                          console.log("Dado selecionado:", selectedIndex);
                        }
                      }}
                    />
                  </div>
                </>
              )}
              {shouldShowModal && (
                <Modal open={showModal} onClose={hideModal}>
                  {isSubmissionsLoading ? (
                    <Spinner />
                  ) : (
                    <>
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
                </Modal>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Stats;
