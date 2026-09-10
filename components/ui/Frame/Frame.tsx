import React from 'react';
import styles from './Frame.module.scss';

interface FrameProps {
    children: React.ReactNode;
}

const Frame = ({ children }: FrameProps) => {
    return (
        <section className={styles.frame}>
            {children}
        </section>
    );
};

export default Frame;