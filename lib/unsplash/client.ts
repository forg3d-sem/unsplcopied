import {createApi} from "unsplash-js";
import {unsplashApiKey} from "@/utility/environment";

const unsplash = createApi({
    accessKey: unsplashApiKey
})

export default unsplash;