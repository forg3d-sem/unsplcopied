'use client';
import React from 'react';
import {useSearchParams} from "next/navigation";
import Skeleton from "@/components/MasonryDisplayComponents/Skeleton/Skeleton";

const Loading = () => {
    const params = useSearchParams();
    const columns = params.get('columns') || 3;

    return (
        <Skeleton
            columns={Number(columns)}
        />
    );
};

export default Loading;