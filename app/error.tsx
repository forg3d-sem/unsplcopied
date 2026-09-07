'use client';
import React from 'react';

const MainErrorPage = ({error, retry}: {
    error: Error & { digest?: string }
    retry: () => void
}) => {
    return (
        <div className='error'>
            <h1>
                Error fetching data:
            </h1>
            <p>
                {error.message}
            </p>
            <div className='buttons'>
                <button
                    className="button primary"
                    onClick={retry}
                >
                    Retry
                </button>
            </div>
        </div>
    );
};

export default MainErrorPage;