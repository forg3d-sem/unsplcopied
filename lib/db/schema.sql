-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.users (
                              id uuid NOT NULL DEFAULT gen_random_uuid(),
                              first_name character varying NOT NULL DEFAULT ''::character varying,
                              email character varying NOT NULL UNIQUE,
                              created_at timestamp with time zone NOT NULL DEFAULT now(),
                              pass_hash character varying NOT NULL,
                              CONSTRAINT users_pkey PRIMARY KEY (id)
);
CREATE TABLE public.images (
                               id uuid NOT NULL DEFAULT gen_random_uuid(),
                               url character varying NOT NULL,
                               unsplash_id character varying NOT NULL,
                               user_id uuid NOT NULL,
                               created_at timestamp with time zone NOT NULL DEFAULT now(),
                               width integer NOT NULL,
                               height integer NOT NULL,
                               description character varying,
                               author_name character varying NOT NULL,
                               author_avatar character varying NOT NULL,
                               CONSTRAINT images_pkey PRIMARY KEY (id),
                               CONSTRAINT images_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);