import {notFound} from "next/navigation";

type ApiResult<T> = { data: T; error?: never; response: Response }
    | { data?: never; error: { errors: string[] }; response: Response };

export const handleFetchResponse = <T,>(result: ApiResult<T>):T => {
    if (result.error) {
        console.log(result.error);
        if (result.response.status === 404) {
            notFound()
        }

        if (result.response.status === 403) {
            throw new Error("Rate limit exceeded")
        }

        throw new Error(result.error.errors[0])
    }

    return result.data
}