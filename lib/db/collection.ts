'use server';
import {pool} from "./db";
import {SimplifiedPhoto} from "@/utility/types";

export async function getCollection(userId:string) {
    const result = await pool.query(
        `
        SELECT * FROM images
        WHERE user_id = $1
        `,
        [userId]
    );

    return result.rows;
}

export async function addToCollection(imageData:Omit<SimplifiedPhoto, 'id' | 'created_at' | 'user_id'>, userId:string) {
    const {url, unsplash_id, height, width, description, author_name, author_avatar} = imageData;

    const result = await pool.query(
        `
        INSERT INTO images (url, unsplash_id, user_id, height, width, description, author_name, author_avatar)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
        `,
        [url, unsplash_id, userId, height, width, description, author_name, author_avatar]
    );

    return result.rows[0];
}

export async function removeFromCollection(unsplash_id:string, userId:string) {
    const result = await pool.query(
        `
        DELETE FROM images 
            WHERE unsplash_id = $1 AND user_id = $2
            RETURNING id
        `,
        [unsplash_id, userId]
    );

    return result.rows
}