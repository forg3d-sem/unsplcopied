import {getPhotos} from "@/lib/unsplash/";
import Masonry from "@/components/MasonryDisplayComponents/MasonryGrid/Masonry";
import React from "react";
import Pagination from "@/components/MasonryDisplayComponents/Pagination/Pagination";
import ViewToggle from "@/components/MasonryDisplayComponents/ViewToggle/ViewToggle";
import SearchInput from "@/components/SearchInput/SearchInput";
import {SearchParams} from "@/utility/types";



type Props = {
    searchParams: Promise<SearchParams>
}

export default async function Home({searchParams}: Readonly<Props>) {

    const params = await searchParams;
    const page = params.page || 1;
    const per_page = params.per_page;

    const data = await getPhotos(page, per_page)

    return (
        <>
            <div className='search-row'>
                <SearchInput/>
            </div>
            <div className='query-row'>
                <div className='query-empty-placeholder'></div>
            </div>
            <div className='row-between horizontal-padding main-page-controls'>
                <div className="toggle-responsive-container">
                    <ViewToggle
                        searchParams={params}
                        basePath="/"
                    />
                </div>
                <Pagination
                    searchParams={params}
                    basePath="/"
                />
            </div>
            <Masonry
                images={data}
                searchParams={params}
            />
            <div className='row-between horizontal-padding main-page-controls-bottom'>
                <Pagination
                    searchParams={params}
                    basePath="/"
                />
            </div>
        </>
    );
}
