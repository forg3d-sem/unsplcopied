import {LayoutDashboard} from "lucide-react";
import styles from './ViewToggle.module.scss';
import React from 'react';
import {SearchParams} from "@/utility/types";
import Link from "next/link";

interface ViewToggleProps {
    searchParams: SearchParams;
    basePath: string;
}

const ViewToggle = ({searchParams, basePath}:ViewToggleProps) => {

    const layoutValue = searchParams.columns || '3';
    const toggleValue = layoutValue === '3' ? '5' : '3';

    function getNavigateUrl(page: number | string) {
        const params = new URLSearchParams();

        Object.entries(searchParams).forEach(([key, value]) => {
            params.set(key, value.toString());
        });

        params.set('columns', page.toString());

        return `${basePath}?${params.toString()}`;
    }

    return (
        <Link
            href={getNavigateUrl(toggleValue)}
            className={styles.gridToggle}
            aria-label='Toggle layout'
        >
            <LayoutDashboard
                color={'#676767'}
                size={32}
            />
        </Link>
    );
};

export default ViewToggle;