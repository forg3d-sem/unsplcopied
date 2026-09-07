import React from 'react';
import Link from "next/link";

const NotFound = () => {
    return (
        <div className='error'>
            <h1>
                Photo not found
            </h1>
            <p>
                We couldn't find photo you requested.
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

export default NotFound;