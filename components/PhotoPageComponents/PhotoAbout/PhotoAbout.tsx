import React from 'react';
import styles from './PhotoAbout.module.scss';
import {Calendar, Camera, DownloadIcon} from 'lucide-react';

interface PhotoAboutProps {
    downloads: number;
    created_at: string;
    camera: string | null;
    description: string | null;
}

const PhotoAbout = ({downloads, camera, created_at, description}: PhotoAboutProps) => {

    return (
        <div className={`${styles.about} horizontal-padding`}>
            <h5 className={styles.dataTitle}>
                About photo:
            </h5>
            <p className={styles.dataDescription}>
                {description}
            </p>
            <div className={styles.dataSubSection}>
                <div className={styles.dataSubBlock}>
                    <Camera size={18} color={'#676767'}/>
                    <span className={styles.subBlockText}>
                    {
                        camera ?? 'N/A'
                    }
                </span>
                </div>
                <div className={styles.dataSubBlock}>
                    <DownloadIcon size={18} color={'#676767'}/>
                    <span className={styles.subBlockText}>
                    {
                        downloads ?? 'N/A'
                    }
                </span>
                </div>
                <div className={styles.dataSubBlock}>
                    <Calendar size={18} color={'#676767'}/>
                    <span className={styles.subBlockText}>
                    {
                        created_at ? new Date(created_at).toLocaleDateString() : 'N/A'
                    }
                </span>
                </div>
            </div>
        </div>
    );
};

export default PhotoAbout;