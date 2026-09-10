import {z} from 'zod';

export const credentialsSchema = z.object({
    email: z.email(),
    password: z.string().min(8)
});

export const registrationSchema = z.object({
    email: z.email(),
    password: z.string().min(8, {message: 'Password must be at least 8 characters.'}),
    first_name: z.string().min(2, {message: 'First name must be at least 2 characters.'})
});