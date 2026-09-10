'use client';
import React from 'react';
import Link from "next/link";
import {LogIn, LogOut, User} from 'lucide-react';
import styles from './ProfileSection.module.scss';
import {useSession, signOut} from "next-auth/react";

const ProfileSection = () => {

    const {status} = useSession();

    const handleSignOut = async () => {
        await signOut({redirectTo: '/'});
    }

    if (status === 'authenticated') return(
        <div className={styles.container}>
            <Link href='/profile' className={styles.link}>
                <User size={24} color={'#676767'}/>
            </Link>
            <button
                onClick={handleSignOut}
                className={styles.link}
            >
                <LogOut size={24} color={'#676767'}/>
            </button>
        </div>
    );

    return (
        <Link href='/login' className={styles.link}>
            <LogIn size={24} color={'#676767'}/>
        </Link>

    );
};

export default ProfileSection;