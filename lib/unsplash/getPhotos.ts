import {handleFetchResponse} from "@/lib/unsplash/handleFetchResponse";
import unsplash from "@/lib/unsplash/client";


export const getPhotos = async (page = 1, per_page = 12, revalidate = 3600) => {
    const result = await unsplash.GET('/photos', {
        params: {
            query: {
                page,
                per_page
            }
        },
        next: {
            revalidate
        }
    })

    return handleFetchResponse(result)
}