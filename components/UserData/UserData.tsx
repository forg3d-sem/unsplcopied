import React from 'react';
import styles from "./UserData.module.scss";
import Image from "next/image";

interface UserDataProps {
    src: string;
    name: string;
    color: string;
}

const UserData = ({src, name, color}:UserDataProps) => {
    return (
        <div className={styles.userInfo}>
            <Image
                src={src}
                alt={name}
                width={48}
                height={48}
                className={styles.userAvatar}
            />
            <div className={styles.userDetails}>
                <span className={styles.userName} style={{color: color}}>{name}</span>
            </div>
        </div>
    );
};

export default UserData;