import React from 'react';
import {Tag} from "@/lib/unsplash";
import styles from './Tags.module.scss';
import Link from "next/link";
import {nanoid} from "nanoid";

interface CollectionsProps {
    tags: Tag[]
}

const Tags = ({tags}:CollectionsProps) => {

    const verifiedTags = tags.filter((tag): tag is {title: string} => 'title' in tag);

    return (
        <div className={styles.tagsList}>
            {
                verifiedTags.map((tag) => (
                    <Link href={`/search?query=${tag.title}`} key={nanoid()} className={styles.tag}>
                        {tag.title}
                    </Link>
                ))
            }
        </div>
    );
};

export default Tags;