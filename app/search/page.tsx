import React from 'react';
import SearchInput from "@/components/SearchInput/SearchInput";
import ViewToggle from "@/components/MasonryDisplayComponents/ViewToggle/ViewToggle";
import Pagination from "@/components/MasonryDisplayComponents/Pagination/Pagination";
import Masonry from "@/components/MasonryDisplayComponents/MasonryGrid/Masonry";
import {Photo, searchPhotos} from "@/lib/unsplash/";
import {SearchParams} from "@/utility/types";
import Empty from "@/components/MasonryDisplayComponents/Empty/Empty";
import {Metadata} from "next";
import PhotoCard from "@/components/MasonryDisplayComponents/PhotoCard/PhotoCard";
import {getCollectionPhotos} from "@/actions/collection";
import {buildPhotoMap} from "@/utility/createPhotoMap";
import {auth} from "@/lib/auth/auth";

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

    const [data, collection, session] = await Promise.all([searchPhotos(query, page, per_page), getCollectionPhotos(), auth()])

    const {results, total_pages} = data;

    const collectionMap = collection.success ? buildPhotoMap(collection.data) : new Map();

    return (
        <>
            <div className='search-row horizontal-padding'>
                <SearchInput/>
            </div>
            <div className='query-row horizontal-padding'>
                <h1>
                    {query}
                </h1>
            </div>
            {
                data.results.length === 0 &&
                <Empty/>
            }
            {
                results.length > 0 &&
                <>
                    <div className='row-between main-page-controls horizontal-padding'>
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
                        searchParams={params}
                    >
                        {results.map((img: Photo) => (
                            <PhotoCard
                                key={img.id}
                                photo={img}
                                isInCollection={collectionMap.has(img.id)}
                                isAuthenticated={!!session?.user.id}
                            />

                        ))}
                    </Masonry>

                    <div className='row-between horizontal-padding main-page-controls-bottom'>
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