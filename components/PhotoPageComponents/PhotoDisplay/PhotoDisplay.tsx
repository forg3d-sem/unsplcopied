import React from 'react';
import Image from "next/image";
import styles from './PhotoDisplay.module.scss';

interface PhotoDisplayProps {
    src: string;
    alt: string | null;
    height: number;
    width: number;
}

const PhotoDisplay = ({src, alt, height, width}: PhotoDisplayProps) => {
    return (
            <Image
                src={src}
                alt={alt || 'Unsplash image'}
                height={height}
                width={width}
                className={styles.photo}
                preload={true}
            />
    );
};

export default PhotoDisplay;