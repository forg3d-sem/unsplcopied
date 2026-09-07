import {getPhotos} from "@/lib/unsplash/getPhotos";
import {getPhotoById} from "@/lib/unsplash/getPhotoById";

export type Photo = Awaited<ReturnType<typeof getPhotos>>[number]
export type DetailedPhoto = Awaited<ReturnType<typeof getPhotoById>>
export type Tags = DetailedPhoto['tags'];
export type Tag = Tags[number];