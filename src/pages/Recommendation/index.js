import { useSelector } from 'react-redux';
import { useEffect, useState } from "react";

import { Redirect } from "react-router-dom";

import { Paper } from "@material-ui/core";
import Table from "../../components/Table/index.js";

import { atcoderApi } from "../../service/atcoderApi.js";
import { codeforcesApi } from "../../service/codeforcesApi.js"
import { uvaApi } from "../../service/uvaApi.js";

import classes from "./recommendation.module.css";
import Spinner from "../../components/Spinner/index.js";

const tableColumns = 
[
  "Problem",
  "Difficulty",
  "Online Judge"
];

const Recommendation = () => {

  const codeforcesHandle = useSelector(state => state.user.codeforcesHandle);
  const uvaHandle = useSelector(state => state.user.uvaHandle);
  const atcoderHandle = useSelector(state => state.user.atcoderHandle);

  const [data, setData] = useState([]);

  const [isCodeforcesLoading, setIsCodeforcesLoading] = useState(false);
  const [isUvaLoading, setIsUvaLoading] = useState(false);
  const [isAtcoderLoading, setIsAtcoderLoading] = useState(false);

  useEffect(() => {

    setData(prevState => []);
    
    const getCodeforcesData = async () => {
      try {
        setIsCodeforcesLoading(true);
        const response = await codeforcesApi.get(`/recommendation?handle=${codeforcesHandle}`);
        await setData(prevState => [...prevState, ...response.data.result.map((res) => (
          {
            problem: <a href={`https://codeforces.com/contest/${res.contestId}/problem/${res.index}`} 
            target="_blank" rel="noopener noreferrer">{res.name}</a>,
            difficulty: <p>{res.rating}</p>,
            onlineJudge: <p>Codeforces</p>
          }
        ))]);
        setIsCodeforcesLoading(false);
      } catch(error) {
        console.log("erro when try to fetch codeforces recommendation");
      }
    }

    const getUvaData = async () => {
      try { 
        setIsUvaLoading(true);
        const response = await uvaApi.get(`/recommendation?handle=${uvaHandle}`);
        await setData(prevState => [...prevState, ...response.data.result.map((res) => (
          {
            problem: <a href={`https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&category=8&page=show_problem&problem=${res.id}`} 
                          target="_blank" rel="noopener noreferrer">{res.title}</a>,
            difficulty: <p>{res.dacu}</p>,
            onlineJudge: <p>UVA OJ</p>
          }
        ))]);
        setIsUvaLoading(false);
      } catch(error) {
        console.log("erro when try to fetch uva recommendation");
      }
    }

    const getAtcoderData = async () => {
      try {
        setIsAtcoderLoading(true);
        const response = await atcoderApi.get(`/recommendation?handle=${atcoderHandle}`);
        await setData(prevState => [...prevState, ...response.data.result.map((res) => (
          {
            problem: <a href={`https://atcoder.jp/contests/${res.contestId}/tasks/${res.problemId}`} 
            target="_blank" rel="noopener noreferrer">{res.title}</a>,
            difficulty: <p>{res.solverCount}</p>,
            OnlineJudge: <p>AtCoder</p>
          }
        ))]);
        setIsAtcoderLoading(false);
      } catch(error) {
        console.log("erro when try to fetch atcoder recommendation");
      }
    }
    
    if(!!codeforcesHandle) getCodeforcesData();
    if(!!uvaHandle) getUvaData();
    if(!!atcoderHandle) getAtcoderData();

  }, [codeforcesHandle, uvaHandle, atcoderHandle])

  return (
    <>
      {(!codeforcesHandle && !uvaHandle && !atcoderHandle) ? (
        <Redirect to="/" />
      ) : (
        <div className={classes.pageContent}>
          <Paper className={classes.tablePaper}>
            {(isCodeforcesLoading || isUvaLoading || isAtcoderLoading ) ? <Spinner /> : 
              ( 
                <>
                <Table 
                  columns={tableColumns}
                  rows={data}
                  />
                </>
              )
            }
          </Paper>
        </div>
      )}
    </>
  )
}

export default Recommendation;