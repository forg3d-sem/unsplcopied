'use client';
import React from 'react';
import styles from "./CollectionPhoto.module.scss";
import Image from "next/image";
import Link from "next/link";
import {ImageMinus} from "lucide-react";
import {SimplifiedPhoto} from "@/utility/types";
import UserData from "@/components/UserData/UserData";

interface CollectionPhotoProps {
    photo: SimplifiedPhoto;
    removeHandler: (e: React.MouseEvent<HTMLButtonElement>, photoId: string) => void;
    isPending: boolean;
}

const CollectionPhoto = ({photo, removeHandler, isPending}: CollectionPhotoProps) => {
    return (
        <div className={styles.photoItem}>
            <div className={styles.mobileInfo}>
                <UserData
                    src={photo.author_avatar}
                    name={photo.author_name}
                    color={'#000'}
                />
            </div>
            <Link href={'/photo/' + photo.unsplash_id} rel="noopener noreferrer" className={styles.photoLink}>
                <Image
                    src={photo.url}
                    alt={photo.description ?? 'Unsplash Photo'}
                    width={photo.width}
                    height={photo.height}
                    className={styles.photo}
                />
                <div className={styles.overlay}>
                    <div className={styles.overlayTop}>
                        <button
                            type='button'
                            className={styles.removeBtn}
                            disabled={isPending}
                            onClick={(event) => removeHandler(event, photo.unsplash_id)}
                        >
                            <ImageMinus
                                size={24}
                                color={'#676767'}
                            />
                        </button>
                    </div>
                    <UserData
                        src={photo.author_avatar}
                        name={photo.author_name}
                        color={'#fff'}
                    />
                </div>
            </Link>
        </div>
    );
};

export default CollectionPhoto;