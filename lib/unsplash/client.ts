import {createApi} from "unsplash-js";
import {publicUnsplashApiKey} from "@/utilitiy/environment";

const unsplash = createApi({
    accessKey: publicUnsplashApiKey
})

export default unsplash;