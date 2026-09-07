import React from 'react';
import styles from './Pagination.module.scss';
import {ChevronLeft, ChevronRight} from 'lucide-react';
import Link from "next/link";
import {SearchParams} from "@/utility/types";

export interface NavigationProps {
    searchParams: SearchParams;
    basePath: string;
    totalPages?: number
}

const Pagination = ({searchParams, totalPages, basePath}: NavigationProps) => {

    const currentPage = searchParams.page || 1;

    function getNavigateUrl(page: number | string) {
        const params = new URLSearchParams();

        Object.entries(searchParams).forEach(([key, value]) => {
            params.set(key, value.toString());
        });

        params.set('page', page.toString());

        return `${basePath}?${params.toString()}`;
    }

    return (
        <nav aria-label='Pagination' className={styles.pagination}>
            {
                currentPage <= 1
                    ?
                    <span>
                        <ChevronLeft color={'#676767'} size={32}/>
                    </span>
                    :
                    <Link
                        href={getNavigateUrl(Number(currentPage) - 1)}
                        className={styles.paginationBtn}
                        aria-label='Navigate back'
                        >
                        <ChevronLeft color={'#676767'} size={32}/>
                    </Link>
            }
            {
                !totalPages || (totalPages && totalPages > Number(currentPage))
                    ?
                    <Link
                        href={getNavigateUrl(Number(currentPage) + 1)}
                        className={styles.paginationBtn}
                        aria-label='Navigate forward'
                    >
                        <ChevronRight color={'#676767'} size={32}/>
                    </Link>
                    :
                    <span>
                        <ChevronRight color={'#676767'} size={32}/>
                    </span>
            }
        </nav>
    );
};

export default Pagination;