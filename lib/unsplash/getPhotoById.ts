import unsplash from "@/lib/unsplash/client";
import {handleFetchResponse} from "@/lib/unsplash/handleFetchResponse";

export const getPhotoById = async (id: string, revalidate = 3600) => {

    const result = await unsplash.GET("/photos/{assetSlug}", {
        params: {
            path: { assetSlug: id},
        },
        next: {
            revalidate
        }
    })

    return handleFetchResponse(result)
}