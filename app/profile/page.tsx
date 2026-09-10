import React from 'react';
import {auth} from "@/lib/auth/auth";
import {redirect} from "next/navigation";
import {getCollectionPhotos} from "@/actions/collection";
import {getUserData} from "@/actions/user";
import {PageProps} from "@/utility/types";
import ProfileCollection from "@/components/ProfileComponents/ProfileCollection/ProfileCollection";

const Profile = async ({searchParams}:PageProps) => {

    const session = await auth();

    if (!session?.user.id) redirect('/login');

    const [userResult, photoResult, params] = await Promise.all([
        getUserData(),
        getCollectionPhotos(),
        searchParams

    ])

    if (!userResult.success) redirect('/login');

    const {first_name} = userResult.data;

    return (
        <>
        <div className='horizontal-padding'>
            <h1>
                Welcome, {first_name}
            </h1>
        </div>
            {
                photoResult.success
                ?
                        <ProfileCollection
                            initialPhotos={photoResult.data}
                            params={params}
                        />
                    :
                    <div className='horizontal-padding'>
                        <span>Error fetching photos: {photoResult.error}</span>
                    </div>

            }
        </>
    );
};

export default Profile;