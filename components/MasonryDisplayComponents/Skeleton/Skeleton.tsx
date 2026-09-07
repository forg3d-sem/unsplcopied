import React from 'react';
import styles from './Skeleton.module.scss';

const Skeleton = () => {
    return (
        <>
            <div className='search-row horizontal-padding'>
                <div className={`${styles.loadingBar} ${styles.search}`}/>
            </div>
            <div className='query-row horizontal-padding'>
                <div className={`${styles.loadingBar} ${styles.query}`}/>
            </div>
            <div className='row-between main-page-controls horizontal-padding'>
                <div className={`${styles.loadingBar} ${styles.nav}`}/>
            </div>
            <div className={styles.fakeMasonry}>
                {
                    Array.from({length: 15}).map((_, i) => (
                        <div key={i} className={`${styles.loadingBar} ${styles.skeletonCard}`}/>
                    ))
                }
            </div>
            <div className='row-between main-page-controls-bottom'>
                <div className={`${styles.loadingBar} ${styles.nav}`}/>
            </div>
        </>
    );
};

export default Skeleton;