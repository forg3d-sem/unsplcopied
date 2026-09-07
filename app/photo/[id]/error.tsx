'use client';
import React from 'react';
import Link from "next/link";

const ErrorPage = ({error, retry}: {
    error: Error & { digest?: string }
    retry: () => void
}) => {
    return (
        <div className='error'>
            <h1>
                Error fetching photo:
            </h1>
            <p>
                {error.message}
            </p>
            <div className='buttons'>
                <button className="button primary">
                    Retry
                </button>
                <Link
                    className='button secondary'
                    href={'/'}
                >
                    Home
                </Link>
            </div>
        </div>
    );
};

export default ErrorPage;