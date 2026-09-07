import React from 'react';
import styles from './Frame.module.scss';

interface FrameProps {
    children: React.ReactNode;
}

const Frame = ({ children }: FrameProps) => {
    return (
        <div className={styles.frame}>
            {children}
        </div>
    );
};

export default Frame;