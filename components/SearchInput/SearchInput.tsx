'use client';
import React from 'react';
import {SubmitHandler, useForm} from "react-hook-form";
import {Search, X} from 'lucide-react';
import {useRouter} from "next/navigation";
import styles from './SearchInput.module.scss';

type Inputs = {
    search: string
}

const SearchInput = () => {

    const router = useRouter();

    const {register, handleSubmit,  resetField, watch} = useForm<Inputs>()

    const searchVal = watch('search');

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        const params = new URLSearchParams({
            query: data.search
        });
        router.push(`/search?${params}`)
    }

    return (
        <form
            className={styles.form}
            onSubmit={handleSubmit(onSubmit)}
        >
            <button
                type='submit'
                className={styles.formBtn}
                aria-label='Submit search'
            >
                <Search
                    color={'#676767'}
                    size={16}
                />
            </button>
            <input
                className={styles.input}
                type="text"
                {...register('search', {required: true, maxLength: 100})}
                placeholder={'Search photos and illustrations'}
            />
            {
                !!searchVal?.length &&
                <button
                    type='reset'
                    className={styles.formBtn}
                    onClick={() => resetField('search')}
                >
                    <X size={16} color={'#676767'}/>
                </button>
            }
        </form>
    );
};

export default SearchInput;