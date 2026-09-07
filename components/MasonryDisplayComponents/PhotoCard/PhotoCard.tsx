import React from 'react';
import Link from "next/link";
import Image from "next/image";
import {Photo} from "@/lib/unsplash/types";
import styles from './PhotoCard.module.scss';
import UserData from "@/components/UserData/UserData";

interface PhotoCardProps {
    photo: Photo,
}

const PhotoCard = ({photo}: PhotoCardProps) => {

    return (
        <div className={styles.photoItem}>
            <div className={styles.mobileInfo}>
                <UserData
                    src={photo.user.profile_image.small}
                    name={photo.user.name}
                    color={'#000'}
                />
            </div>
            <Link href={'/photo/' + photo.id} rel="noopener noreferrer" className={styles.photoLink}>
                <Image
                    src={photo.urls.regular}
                    alt={photo.description ?? 'Unsplash Photo'}
                    width={photo.width}
                    height={photo.height}
                    className={styles.photo}
                />
                <div className={styles.overlay}>
                    <div className="overlay-top"></div>
                    <UserData
                        src={photo.user.profile_image.small}
                        name={photo.user.name}
                        color={'#fff'}
                    />
                </div>
            </Link>
        </div>
    );
};

export default PhotoCard;