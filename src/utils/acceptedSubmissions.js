import { atcoderApi } from "../service/atcoderApi";
import { codeforcesApi } from "../service/codeforcesApi";
import { codechefApi } from "../service/codechefApi";
import { spojApi } from "../service/spojApi";
import { uvaApi } from "../service/uvaApi";
import { authApi } from "../service/authApi";

import { handleError } from "./error";
import { Platforms } from "./enums";

const initAcceptedSubmissions = () => {
    localStorage.setItem("isUpdatingAcceptedSubmissions", false);

    for (var platform in Platforms) {
        localStorage.setItem(platform + "AcceptedSubmissions", []);
        localStorage.setItem(platform + "AcceptedSubmissionsCount", 0);
        localStorage.setItem("isUpdating" + platform + "AcceptedSubmissions", false);
    }
}

const clearAcceptedSubmissions = () => {
    localStorage.removeItem("isUpdatingAcceptedSubmissions");

    for (var platform in Platforms) {
        localStorage.removeItem(platform + "AcceptedSubmissions");
        localStorage.removeItem(platform + "AcceptedSubmissionsCount");
        localStorage.removeItem("isUpdating" + platform + "AcceptedSubmissions");
    }
}

const updateAcceptedSubmissions = async (codeforcesHandle, atcoderHandle, uvaHandle, spojHandle, codechefHandle, token) => {
    localStorage.setItem("isUpdatingAcceptedSubmissions", true);

    if (codeforcesHandle) getAcceptedUserSubmissionsAsync(codeforcesApi, codeforcesHandle, Platforms.CODEFORCES, token);
    if (atcoderHandle) getAcceptedUserSubmissionsAsync(atcoderApi, atcoderHandle, Platforms.ATCODER, token);
    if (codechefHandle) getAcceptedUserSubmissionsAsync(codechefApi, codechefHandle, Platforms.CODECHEF, token);
    if (spojHandle) getAcceptedUserSubmissionsAsync(spojApi, spojHandle, Platforms.SPOJ, token);
    if (uvaHandle) getAcceptedUserSubmissionsAsync(uvaApi, uvaHandle, Platforms.UVA, token);
}

const calculateProgress = (amount, codeforcesProblems, uvaProblems, atcoderProblems, spojProblems, codechefProblems) => {
    if (amount <= 0) return (<p>-</p>);

    let done = getAcceptedUserSubmissionsNumber(Platforms.CODEFORCES, codeforcesProblems);
    done += getAcceptedUserSubmissionsNumber(Platforms.UVA, uvaProblems);
    done += getAcceptedUserSubmissionsNumber(Platforms.ATCODER, atcoderProblems);
    done += getAcceptedUserSubmissionsNumber(Platforms.SPOJ, spojProblems);
    done += getAcceptedUserSubmissionsNumber(Platforms.CODECHEF, codechefProblems);

    let percent = ((done/amount) * 100).toFixed(0);
    let colorStr = percent < 55 ? "red" : percent < 86 ? "orange" : "green";

    return (<p>{done}/{amount} <b style={{color: colorStr}}>({percent}%)</b></p>);
}

const getAcceptedUserSubmissionsNumber = (platform, listProblems) => {
    let acceptedRaw = localStorage.getItem(platform + "AcceptedSubmissions");

    if (listProblems.length === 0 || !acceptedRaw) return 0;

    let accepted = JSON.parse(acceptedRaw);
    return listProblems.filter(problemId => accepted.includes(problemId)).length;
}

const checkAccepted = (platform, problemId) => {
    let acceptedRaw = localStorage.getItem(platform + "AcceptedSubmissions");
    if (!acceptedRaw) return false;

    return JSON.parse(acceptedRaw).includes(problemId) ? true : false;
}

const getAcceptedUserSubmissionsAsync = async (api, handle, platform, token) => {
    localStorage.setItem("isUpdating" + platform + "AcceptedSubmissions", true);

    try {
        let acceptedList;

        const responseCount = await authApi.get(`/api/problems/user-accepted-submissions-count?platform=${platform}`, {
            headers: {
                Authorization: 'Bearer ' + token
            },
        });

        let responseRealCountUrl = "";
        switch (platform) {
            case Platforms.ATCODER:
                responseRealCountUrl = `/accepted-count?handle=${handle}`;
                break;

            case Platforms.CODEFORCES:
                responseRealCountUrl = `/submissions?handle=${handle}&acOnly=true&justCount=true`
                break;

            case Platforms.UVA:
                responseRealCountUrl = `/userInfo?handle=${handle}&justAcCount=true`;
                break;

            case Platforms.SPOJ:
                responseRealCountUrl = `/submissions?handle=${handle}&acOnly=true&justCount=true`;
                break;

            case Platforms.CODECHEF:
                // TO-DO
                break;
        }

        const responseRealCount = await api.get(responseRealCountUrl);

        const realCount = responseRealCount?.data?.result[0];
        const count = responseCount?.data;
        const storageCount = localStorage.getItem(platform + "AcceptedSubmissionsCount");

        if (realCount !== undefined && realCount == count) {
            if (realCount != storageCount) {
                const response = await authApi.get(`/api/problems/user-accepted-submissions?platform=${platform}`, {
                    headers: {
                        Authorization: 'Bearer ' + token
                    },
                });

                if (response.data !== undefined) {
                    acceptedList = response.data.acceptedSubmissions;

                    localStorage.setItem(platform + "AcceptedSubmissionsCount", acceptedList.length);
                    localStorage.setItem(platform + "AcceptedSubmissions", JSON.stringify(acceptedList));
                } else {
                    alert("Unknown error");
                }
            }

            localStorage.setItem("isUpdating" + platform + "AcceptedSubmissions", false);
            return;
        } else {
            const response = await api.get(`/submissions?handle=${handle}&acOnly=true`);

            if (response.data.status === "OK") {
                acceptedList = response.data.result;

                localStorage.setItem(platform + "AcceptedSubmissionsCount", acceptedList.length);
                localStorage.setItem(platform + "AcceptedSubmissions", JSON.stringify(acceptedList));
            } else {
                alert("Unknown error");
            }
        }

        if (acceptedList) {
            await authApi.post('/api/problems/user-accepted-submissions',
                {
                    platform,
                    acceptedSubmissions: acceptedList
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + token
                    },
                }
            );
        }
    } catch (error) {
        handleError(error, "\nUnable to check " + platform + " solved problems");
    }

    localStorage.setItem("isUpdating" + platform + "AcceptedSubmissions", false);
}

const checkAcceptedSubmissionsUpdateFinish = () => {
    if (
        localStorage.getItem("isUpdating" + Platforms.CODEFORCES + "AcceptedSubmissions") === "false" &&
        localStorage.getItem("isUpdating" + Platforms.ATCODER + "AcceptedSubmissions") === "false" &&
        localStorage.getItem("isUpdating" + Platforms.CODECHEF + "AcceptedSubmissions") === "false" &&
        localStorage.getItem("isUpdating" + Platforms.SPOJ + "AcceptedSubmissions") === "false" &&
        localStorage.getItem("isUpdating" + Platforms.UVA + "AcceptedSubmissions") === "false"
    ) {
        localStorage.setItem("isUpdatingAcceptedSubmissions", false);
    }
}

const waitAcceptedSubmissions = async () => {
    while (localStorage.getItem("isUpdatingAcceptedSubmissions") === "true") {
        checkAcceptedSubmissionsUpdateFinish();
        await new Promise(resolve => setTimeout(resolve, 500));
    }
}

export {
    initAcceptedSubmissions, clearAcceptedSubmissions, updateAcceptedSubmissions, waitAcceptedSubmissions, calculateProgress,
    checkAccepted
};
