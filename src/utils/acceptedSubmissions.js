import { atcoderApi } from "../service/atcoderApi";
import { codeforcesApi } from "../service/codeforcesApi";
import { codechefApi } from "../service/codechefApi";
import { spojApi } from "../service/spojApi";
import { uvaApi } from "../service/uvaApi";

import { handleError } from "./error";
import { Platforms } from "./enums";

const initAcceptedSubmissions = () => {
    localStorage.setItem("isUpdatingAcceptedSubmissions", false);

    for (var platform in Platforms) {
        localStorage.setItem(platform + "AcceptedSubmissions", []);
        localStorage.setItem("isUpdating" + platform + "AcceptedSubmissions", false);
    }
}

const clearAcceptedSubmissions = () => {
    localStorage.removeItem("isUpdatingAcceptedSubmissions");

    for (var platform in Platforms) {
        localStorage.removeItem(platform + "AcceptedSubmissions");
        localStorage.removeItem("isUpdating" + platform + "AcceptedSubmissions");
    }
}

const updateAcceptedSubmissions = async (codeforcesHandle, atcoderHandle, uvaHandle, spojHandle, codechefHandle) => {
    localStorage.setItem("isUpdatingAcceptedSubmissions", true);

    if (codeforcesHandle) getAcceptedUserSubmissionsAsync(codeforcesApi, codeforcesHandle, Platforms.CODEFORCES);
    if (atcoderHandle) getAcceptedUserSubmissionsAsync(atcoderApi, atcoderHandle, Platforms.ATCODER);
    if (codechefHandle) getAcceptedUserSubmissionsAsync(codechefApi, codechefHandle, Platforms.CODECHEF);
    if (spojHandle) getAcceptedUserSubmissionsAsync(spojApi, spojHandle, Platforms.SPOJ);
    if (uvaHandle) getAcceptedUserSubmissionsAsync(uvaApi, uvaHandle, Platforms.UVA);
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

const getAcceptedUserSubmissionsAsync = async (api, handle, platform) => {
    localStorage.setItem("isUpdating" + platform + "AcceptedSubmissions", true);

    try {
        const response = await api.get(`/submissions?handle=${handle}&acOnly=true`);

        if (response.data.status === "OK") {
            localStorage.setItem(platform + "AcceptedSubmissions", JSON.stringify(response.data.result));
        } else {
            alert("Unknown error");
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

export { initAcceptedSubmissions, clearAcceptedSubmissions, updateAcceptedSubmissions, waitAcceptedSubmissions, calculateProgress };
