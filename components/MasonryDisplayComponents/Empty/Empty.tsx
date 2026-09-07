import React from 'react';
import styles from './Empty.module.scss';

const Empty = () => {
    return (
        <div className='horizontal-padding'>
            <span className={styles.emptyText}>
                No images were found
            </span>
        </div>
    );
};

export default Empty;