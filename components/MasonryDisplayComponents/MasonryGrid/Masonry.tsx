import React from 'react';
import styles from './PhotoMasonry.module.scss';
import {SearchParams} from "@/utility/types";
import {Photo} from "@/lib/unsplash/types";
import PhotoCard from "@/components/MasonryDisplayComponents/PhotoCard/PhotoCard";

interface MasonryProps {
    images: Photo[],
    searchParams: SearchParams
}


const Masonry = ({images, searchParams}: MasonryProps) => {

    return (
        <div className={styles.masonry} style={{"--columns": searchParams.columns || 3} as React.CSSProperties}>
            {images.map((img: Photo) => (
                <PhotoCard
                    key={img.id}
                    photo={img}
                />

            ))}
        </div>
    );
};

export default Masonry;