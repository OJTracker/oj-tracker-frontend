import { atcoderApi } from "../service/atcoderApi";
import { authApi } from "../service/authApi";
import { codechefApi } from "../service/codechefApi";
import { codeforcesApi } from "../service/codeforcesApi";
import { spojApi } from "../service/spojApi";
import { uvaApi } from "../service/uvaApi";

import { Platforms } from "./enums";

import { handleError } from "./error";

const token = localStorage.getItem("tk");

const submitAdd = async (
    setShowSuccess, setAddIsLoading, setPlatformError, setExternalIdError, setExternalIdHelperText, platform,
    externalId, id
) => {
    setShowSuccess(false);
    setAddIsLoading(true);

    if (platform === "") {
        setPlatformError(true);
        setAddIsLoading(false);
        return;
    }

    setPlatformError(false);

    if (externalId === "") {
        setExternalIdError(true);
        setAddIsLoading(false);
        return;
    }

    if (platform === Platforms.UVA && Number.isNaN(Number(externalId))) {
        setExternalIdError(true);
        setExternalIdHelperText("Invalid Id.");
        setAddIsLoading(false);
        return;
    }

    setExternalIdError(false);

    let alreadyExists = false;

    let problemName = "";
    let link = "";

    try {
        const response = await authApi.get(`/api/problems?externalId=${externalId}&platform=${platform}`,
            {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            }
        );

        if (response) {
            if (response.data) {
                problemName = response.data.name;
                platform = response.data.platform;
                externalId = response.data.externalId;
                link = response.data.link;

                alreadyExists = true;
            }
        }
    } catch { }

    switch (platform + (alreadyExists ? "-" : "")) {
        case Platforms.CODEFORCES:
            try {
                let firstNonDigit = externalId.search(/[^0-9]/);
                let contestId = externalId.slice(0, firstNonDigit);
                let index = externalId.slice(firstNonDigit);

                if (contestId === "" || index === "") {
                    setExternalIdError(true);
                    setExternalIdHelperText("Invalid Id.");
                    setAddIsLoading(false);
                    return;
                }

                const response = await codeforcesApi.get(`/problems?contestId=${contestId}&index=${index}`);

                if (response.status === 200) {
                    if (response.data.result.length < 1) {
                        setExternalIdError(true);
                        setExternalIdHelperText("Invalid Id.");
                        setAddIsLoading(false);
                        return;
                    }

                    link = `https://codeforces.com/problemset/problem/${contestId}/${index}`;
                    problemName = response.data.result[0].name;
                } else {
                    alert("Unknown error");
                    setAddIsLoading(false);
                    return;
                }
            } catch (error) {
                handleError(error, "\nProblem not added!");
                setAddIsLoading(false);
                return;
            }
            break;

        case Platforms.UVA:
            try {
                const response = await uvaApi.get(`/problems/${externalId}`);

                if (response.status === 200) {
                    if (response.data.result.length < 1) {
                        setExternalIdError(true);
                        setExternalIdHelperText("Invalid Id.");
                        setAddIsLoading(false);
                        return;
                    }

                    let problem = response.data.result[0];
                    
                    link = `https://onlinejudge.org/external/${
                        Math.floor(externalId / 100)
                    }/${externalId}.pdf`;

                    problemName = problem.title;
                } else {
                    alert("Unknown error");
                    setAddIsLoading(false);
                    return;
                }
            } catch (error) {
                handleError(error, "\nProblem not added!");
                setAddIsLoading(false);
                return;
            }
            break;

        case Platforms.ATCODER:
            try {
                const response = await atcoderApi.get(`/problems?problemId=${externalId}`);

                if (response.status === 200) {
                    if (response.data.result.length < 1) {
                        setExternalIdError(true);
                        setExternalIdHelperText("Invalid Id.");
                        setAddIsLoading(false);
                        return;
                    }

                    let problem = response.data.result[0];
                    link = `https://atcoder.jp/contests/${problem.contestId}/tasks/${problem.problemId}`;
                    problemName = problem.name;
                } else {
                    alert("Unknown error");
                    setAddIsLoading(false);
                    return;
                }
            } catch (error) {
                handleError(error, "\nProblem not added!");
                setAddIsLoading(false);
                return;
            }
            break;

        case Platforms.SPOJ:
            try {
                let _externalId = externalId.toUpperCase();

                const response = await spojApi.get(`/problems/${_externalId}`);

                if (response.status === 200) {
                    if (response.data.result.length < 1) {
                        setExternalIdError(true);
                        setExternalIdHelperText("Invalid Id.");
                        setAddIsLoading(false);
                        return;
                    }

                    let problem = response.data.result[0];
                    
                    link = `https://www.spoj.com/problems/${_externalId}`;

                    problemName = problem.problemName;
                } else {
                    alert("Unknown error");
                    setAddIsLoading(false);
                    return;
                }
            } catch (error) {
                handleError(error, "\nProblem not added!");
                setAddIsLoading(false);
                return;
            }
            break;

        case Platforms.CODECHEF:
            try {
                const response = await codechefApi.get(`/problems?problemId=${externalId}`);

                if (response.status === 200) {
                    if (response.data.result.length < 1) {
                        setExternalIdError(true);
                        setExternalIdHelperText("Invalid Id.");
                        setAddIsLoading(false);
                        return;
                    }

                    let problem = response.data.result[0];
                    link = `https://www.codechef.com/problems/${problem.problemId}`;
                    problemName = problem.problemName;
                } else {
                    alert("Unknown error");
                    setAddIsLoading(false);
                    return;
                }
            } catch (error) {
                handleError(error, "\nProblem not added!");
                setAddIsLoading(false);
                return;
            }
            break;

        default:
            break;
    }

    setExternalIdError(false);
    setExternalIdHelperText("");

    if (!id) {
        setShowSuccess(true);
        setAddIsLoading(false);
        return { problemName, platform, externalId, link };
    }

    try {
        const response = await authApi.post(`/api/curated-lists/${id}/problem`,
            {
                name: problemName,
                platform,
                externalId,
                link
            },
            {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            }                
        );

        if (response.status === 200) {
            setShowSuccess(true);
        } else {
            alert("Unknown error");
        }
    } catch (error) {
        handleError(error, "\nProblem not persisted!");
    }

    setAddIsLoading(false);
}

export { submitAdd }
