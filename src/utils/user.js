import { handleError } from "./error";
import { authApi } from "../service/authApi";

const get = async (setIsLoading, page, count, role, setList, setTotal, search=null, justUsers=false) => {
    const token = localStorage.getItem("tk");

    try {
        setIsLoading(true);

        const response = await authApi.get('/api/users',
            {
                headers: {
                    Authorization: 'Bearer ' + token
                },
                params: {
                    page,
                    count,
                    role,
                    byUsername: !!search,
                    username: search,
                    justUsers
                },
            }
        );

        if (response.status === 200) {
            setList(response.data.result);
            setTotal(response.data.totalPages);
        } else {
            alert("Unknown error");
        }

        setIsLoading(false);
    } catch (error) {
        handleError(error, "");
        setIsLoading(false);
    }
}

export { get }
