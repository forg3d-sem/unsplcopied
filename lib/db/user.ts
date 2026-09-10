import {pool} from "./db";
import {User} from "@/utility/types";

export async function createUser(user:Pick<User, 'first_name' | 'email' | 'pass_hash'>) {
    const {first_name, email, pass_hash} = user;

    const result = await pool.query(
        `
        INSERT INTO users (first_name, email, pass_hash)
        VALUES ($1, $2, $3)
        RETURNING *
        `,
        [first_name, email, pass_hash]
    )

    return result.rows[0]
}

export async function getUserByEmail(email:string) {
    const result = await pool.query(
        `
        SELECT * FROM users
        WHERE email = $1
        `,
        [email]
    )

    return result.rows[0]
}

export async function getUserById(id:string) {
    const result = await pool.query(
        `
        SELECT * FROM users
        WHERE id = $1
        `,
        [id]
    )

    return result.rows[0]
}
