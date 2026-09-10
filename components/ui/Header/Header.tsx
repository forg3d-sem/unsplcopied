import React from 'react';
import Frame from "@/components/ui/Frame/Frame";
import Link from "next/link";
import styles from './Header.module.scss';
import ProfileSection from "./ProfileSection/ProfileSection";
import SessionProviderWrap from "@/components/SessionProviderWrap";

const Header = () => {
    return (
        <header>
            <Frame>
                <div className='horizontal-padding row-between'>
                    <Link href={'/'} className={styles.headerLink}>
                        <h1 className={styles.headerTitle}>UNSPLCOPIED</h1>
                    </Link>
                    <SessionProviderWrap>
                        <ProfileSection/>
                    </SessionProviderWrap>
                </div>
            </Frame>
        </header>
    );
};

export default Header;