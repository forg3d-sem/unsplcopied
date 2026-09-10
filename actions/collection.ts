'use server';
import {auth} from "@/lib/auth/auth";
import {getCollection, removeFromCollection, addToCollection} from "@/lib/db/collection";
import type {SimplifiedPhoto} from "@/utility/types";
import {DetailedPhoto, Photo} from "@/lib/unsplash";
import {revalidatePath} from "next/cache";

type ActionResult<T> = { success: true; data: T } | { success: false; error: string };

export async function getCollectionPhotos(): Promise<ActionResult<SimplifiedPhoto[]>> {
    const session = await auth();
    if (!session?.user?.id) {
        return {success: false, error: "Unauthorized"};
    }

    try {
        const photos = await getCollection(session.user.id);
        return {success: true, data: photos};
    } catch (err) {
        console.error("getSavedPhotos failed:", err);
        return {success: false, error: "Could not load saved photos."};
    }
}

export async function removePhoto(id: string): Promise<{ success: true } | { success: false; error: string }> {
    const session = await auth();
    if (!session?.user?.id) {
        return {success: false, error: "Unauthorized"};
    }

    try {
        await removeFromCollection(id, session.user.id);
        revalidatePath('/profile');
        return {success: true};
    } catch (err) {
        console.error("removePhoto failed:", err);
        return {success: false, error: "Could not remove photo. Please try again."};
    }
}

export async function toggleSave(
    isSaved: boolean,
    imageData: Photo | DetailedPhoto
): Promise<ActionResult<SimplifiedPhoto | null>> {

    const session = await auth();
    if (!session?.user?.id) {
        return {success: false, error: "Unauthorized"};
    }

    try {
        if (isSaved) {
            await removeFromCollection(imageData.id, session.user.id);
            revalidatePath('/profile');
            return {success: true, data: null};
        }

        const dataToSave: Omit<SimplifiedPhoto, 'id' | 'created_at' | 'user_id'> = {
            unsplash_id: imageData.id,
            url: imageData.urls.regular,
            height: imageData.height,
            width: imageData.width,
            description: imageData.description,
            author_name: imageData.user.name,
            author_avatar: imageData.user.profile_image.small
        }
        const saved = await addToCollection(dataToSave, session.user.id);
        return {success: true, data: saved};
    } catch (err) {
        console.error("toggleSave failed:", err);
        return {success: false, error: "Could not update collection."};
    }
}