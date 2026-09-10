'use client';
import React, {useCallback, useOptimistic, useTransition} from 'react';
import {SearchParams, SimplifiedPhoto} from "@/utility/types";
import CollectionPhoto from "@/components/ProfileComponents/CollectionPhoto/CollectionPhoto";
import {removePhoto} from "@/actions/collection";
import Link from "next/link";
import styles from './ProfileCollection.module.scss';
import Masonry from "@/components/MasonryDisplayComponents/MasonryGrid/Masonry";
import ViewToggle from "@/components/MasonryDisplayComponents/ViewToggle/ViewToggle";

interface ProfileCollectionProps {
    initialPhotos: SimplifiedPhoto[];
    params: SearchParams;
}

const optimisticRemove = (photos: SimplifiedPhoto[], id: string) => {
    return photos.filter((photo) => photo.unsplash_id !== id);
}

const ProfileCollection = ({initialPhotos, params}: ProfileCollectionProps) => {
    const [optimisticPhotos, setOptimisticPhotos] = useOptimistic(initialPhotos, optimisticRemove);
    const [isPending, startTransition] = useTransition()


    const handleRemoveFromCollection = useCallback((e: React.MouseEvent<HTMLButtonElement>, photoId: string) => {
        e.preventDefault();
        e.stopPropagation();

        startTransition(async () => {
            setOptimisticPhotos(photoId)
            await removePhoto(photoId)
        })
    }, [startTransition, setOptimisticPhotos])

    if (optimisticPhotos.length) return (
        <>
            <div className={styles.spacer}></div>
            <div className='horizontal-padding main-page-controls'>
                <div className="toggle-responsive-container">
                    <ViewToggle
                        searchParams={params}
                        basePath="/profile"
                    />
                </div>
            </div>
            <Masonry searchParams={params}>
                {
                    optimisticPhotos.map((photo) =>
                        <CollectionPhoto
                            key={photo.id}
                            photo={photo}
                            removeHandler={handleRemoveFromCollection}
                            isPending={isPending}
                        />
                    )
                }
            </Masonry>
        </>
    );

    return (
        <div className={`horizontal-padding ${styles.emptyCollection}`}>
            <h2>Currently you have no photos in your collection</h2>
            <Link href={'/'} className={styles.link}>Let's add some!</Link>
        </div>
    );
};

export default ProfileCollection;