import {getPhotos, Photo} from "@/lib/unsplash/";
import Masonry from "@/components/MasonryDisplayComponents/MasonryGrid/Masonry";
import React from "react";
import Pagination from "@/components/MasonryDisplayComponents/Pagination/Pagination";
import ViewToggle from "@/components/MasonryDisplayComponents/ViewToggle/ViewToggle";
import SearchInput from "@/components/SearchInput/SearchInput";
import PhotoCard from "@/components/MasonryDisplayComponents/PhotoCard/PhotoCard";
import {PageProps} from "@/utility/types";
import {getCollectionPhotos} from "@/actions/collection";
import {buildPhotoMap} from "@/utility/createPhotoMap";
import {auth} from "@/lib/auth/auth";

export default async function Home({searchParams}: Readonly<PageProps>) {

    const params = await searchParams;
    const page = params.page || 1;
    const per_page = params.per_page;

    const [data, collection, session] = await Promise.all([getPhotos(page, per_page), getCollectionPhotos(), auth()])

    const collectionMap = collection.success ? buildPhotoMap(collection.data) : new Map();

    return (
        <>
            <div className='search-row horizontal-padding'>
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
                searchParams={params}
            >
                {data.map((img: Photo) => (
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
                    basePath="/"
                />
            </div>
        </>
    );
}
