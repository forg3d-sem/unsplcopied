import {createApi} from "unsplash-js";
import {publicUnsplashApiKey} from "@/utility/environment";

const unsplash = createApi({
    accessKey: publicUnsplashApiKey
})

export default unsplash;