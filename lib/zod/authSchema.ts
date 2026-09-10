import {z} from 'zod';

export const credentialsSchema = z.object({
    email: z.email(),
    password: z.string().min(6)
});

export const registrationSchema = z.object({
    email: z.email(),
    password: z.string().min(6, {message: 'Password must be at least 6 characters.'}),
    first_name: z.string().min(2, {message: 'First name must be at least 2 characters.'})
});