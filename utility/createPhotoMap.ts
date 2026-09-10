import {SimplifiedPhoto} from "@/utility/types";

export function buildPhotoMap(collection: SimplifiedPhoto[]): Map<string, string> {
    return new Map(collection.map((photo) => [photo.unsplash_id, photo.id]));
}