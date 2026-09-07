import React from 'react';
import styles from './PhotoMasonry.module.scss';
import {SearchParams} from "@/utilitiy/types";
import {Photo} from "@/lib/unsplash/types";
import PhotoCard from "@/components/MasonryDisplayComponents/PhotoCard/PhotoCard";
import {nanoid} from "nanoid";

interface MasonryProps {
    images: Photo[],
    searchParams: SearchParams
}


const Masonry = ({images, searchParams}: MasonryProps) => {

    return (
        <div className={styles.masonry} style={{"--columns": searchParams.columns || 3} as React.CSSProperties}>
            {images?.map((img: Photo) => (
                <PhotoCard
                    key={nanoid()}
                    photo={img}
                />

            ))}
        </div>
    );
};

export default Masonry;