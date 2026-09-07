import React from 'react';
import Link from "next/link";

const AppNotFound = () => {
    return (
        <div className='error'>
            <h1>
                Route not found
            </h1>
            <p>
                It seems like you navigated to invalid route
            </p>
            <div className='buttons'>
                <Link
                    className='button primary'
                    href={'/'}
                >
                    Home
                </Link>
            </div>
        </div>
    );
};

export default AppNotFound;