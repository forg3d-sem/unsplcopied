export type ColumnsCount = '3' | '5';

export type SearchParams = {
    page?: number;
    per_page?: number;
    columns?: ColumnsCount;
    query?: string;
}

export type PageProps = {
    searchParams: Promise<SearchParams>
}

//unsplash_id - unsplash image id
//url - url for displaying image
//id - db id
export type SimplifiedPhoto = {
    unsplash_id: string;
    url: string;
    user_id: string;
    id: string;
    created_at: string;
    width: number;
    height: number;
    description: string | null;
    author_name: string;
    author_avatar: string;
}

export type User = {
    id: string;
    first_name: string;
    email: string;
    pass_hash: string;
    created_at: string;
}