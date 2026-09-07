import React from 'react';
import SearchInput from "@/components/SearchInput/SearchInput";
import ViewToggle from "@/components/MasonryDisplayComponents/ViewToggle/ViewToggle";
import Pagination from "@/components/MasonryDisplayComponents/Pagination/Pagination";
import Masonry from "@/components/MasonryDisplayComponents/MasonryGrid/Masonry";
import {searchPhotos} from "@/lib/unsplash/";
import {SearchParams} from "@/utilitiy/types";
import Empty from "@/components/MasonryDisplayComponents/Empty/Empty";
import {Metadata} from "next";

type Props = {
    searchParams: Promise<SearchParams>
}

export async function generateMetadata({searchParams}:Props):Promise<Metadata> {
    const {query} = await searchParams;

    return{
        title: `Search results for "${query}" | Unsplcopied`,
    }
}

export default async function SearchPage({searchParams}: Readonly<Props>) {

    const path = '/search'

    const params = await searchParams;
    const page = params.page || 1;
    const per_page = params.per_page;
    const query = params.query || '';

    const {results, total_pages} = await searchPhotos(query, page, per_page);

    return (
        <>
            <div className='search-row'>
                <SearchInput/>
            </div>
            <div className='query-row'>
                <h1>
                    {query}
                </h1>
            </div>
            {
                results.length === 0 &&
                <Empty/>
            }
            {
                results.length > 0 &&
                <>
                    <div className='row-between main-page-controls'>
                        <div className="toggle-responsive-container">
                            <ViewToggle
                                searchParams={params}
                                basePath={path}
                            />
                        </div>
                        <Pagination
                            searchParams={params}
                            basePath={path}
                            totalPages={total_pages}
                        />
                    </div>
                    <Masonry
                        images={results}
                        searchParams={params}
                    />
                    <div className='row-between main-page-controls-bottom'>
                        <Pagination
                            searchParams={params}
                            basePath={path}
                            totalPages={total_pages}
                        />
                    </div>
                </>
            }
        </>
    );
};