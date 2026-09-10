'use client';
import {useState, useTransition} from 'react';
import {toggleSave} from "@/actions/collection";
import {DetailedPhoto, Photo} from "@/lib/unsplash";
import {ImageMinus, ImagePlus} from "lucide-react";
import styles from './CollectionToggle.module.scss';

interface CollectionToggleProps {
    initialValue: boolean;
    isAuthenticated: boolean;
    data: Photo | DetailedPhoto;
    hasBg?: boolean;
}

const CollectionToggle = ({initialValue, isAuthenticated, data, hasBg = true}:CollectionToggleProps) => {

    const [isPending, startTransition] = useTransition()
    const [isInCollection, setIsInCollection] = useState(initialValue);

    const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        e.preventDefault();
        const wasSaved = isInCollection;
        startTransition(async () => {
            setIsInCollection(!wasSaved);
            const result = await toggleSave(wasSaved, data);
            if (!result.success) setIsInCollection(wasSaved);
        })
    }

    if (isAuthenticated) return (
        <button
            type='button'
            disabled={isPending}
            onClick={(event) => handleToggle(event)}
            className={hasBg ? `${styles.button} ${styles.buttonBg}` : styles.button}
            aria-label={isInCollection ? 'Remove from collection' : 'Save to collection'}
        >
            {
                isInCollection
                ?
                    <ImageMinus size={24} color={'#676767'}/>
                    :
                    <ImagePlus size={24} color={'#676767'}/>
            }
        </button>
    );

    return null;
};

export default CollectionToggle;