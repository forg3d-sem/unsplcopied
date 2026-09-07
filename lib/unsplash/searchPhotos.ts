import {handleFetchResponse} from "@/lib/unsplash/handleFetchResponse";
import unsplash from "@/lib/unsplash/client";

export const searchPhotos = async (query: string, page = 1, per_page = 12, revalidate = 3600) => {
    const result = await unsplash.GET('/search/photos', {
        params: {
            query: {
                query,
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