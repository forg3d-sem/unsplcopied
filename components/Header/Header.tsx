import React from 'react';
import Frame from "@/components/Frame/Frame";
import Link from "next/link";
import styles from './Header.module.scss';

const Header = () => {
    return (
        <header>
            <Frame>
                <div className='horizontal-padding row-between'>
                    <Link href={'/'} className={styles.headerLink}>
                        <h1 className={styles.headerTitle}>UNSPLCOPIED</h1>
                    </Link>
                    {/*<nav>*/}
                    {/*    <Link href={'/'}>Home</Link>*/}
                    {/*</nav>*/}
                </div>
            </Frame>
        </header>
    );
};

export default Header;