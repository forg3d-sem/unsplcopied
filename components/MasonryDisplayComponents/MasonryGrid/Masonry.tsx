import React from 'react';
import styles from './PhotoMasonry.module.scss';
import {SearchParams} from "@/utility/types";

interface MasonryProps {
    searchParams: SearchParams,
    children: React.ReactNode,
}


const Masonry = ({searchParams, children}: MasonryProps) => {

    return (
        <div className={styles.masonry} style={{"--columns": searchParams.columns || 3} as React.CSSProperties}>
            {children}
        </div>
    );
};

export default Masonry;