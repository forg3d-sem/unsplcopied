import React from 'react';
import styles from "./Skeleton.module.scss";

const Skeleton = () => {
    return (
        <>
            <div className='horizontal-padding row-between'>
                <div className={`${styles.loadingBar} ${styles.user}`}/>
            </div>
            <div className={`${styles.loadingBar} ${styles.photo}`}/>
            <div>

            </div>
            <div className={`${styles.about} horizontal-padding`}>
                <div className={`${styles.loadingBar} ${styles.about}`}></div>
            </div>
            <div className={`horizontal-padding ${styles.tagContainer}`}>
                {
                    Array.from({length: 8}).map((_, i) => (
                        <div key={i} className={`${styles.loadingBar} ${styles.tag}`}/>
                    ))
                }
                <div className={`${styles.loadingBar} ${styles.tag}`}/>
            </div>
        </>
    );
};

export default Skeleton;