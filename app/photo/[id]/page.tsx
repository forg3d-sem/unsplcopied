import React from 'react';
import {DetailedPhoto} from "@/lib/unsplash/types";

import PhotoDisplay from "@/components/PhotoPageComponents/PhotoDisplay/PhotoDisplay";
import UserData from "@/components/UserData/UserData";
import PhotoAbout from "@/components/PhotoPageComponents/PhotoAbout/PhotoAbout";
import Tags from "@/components/PhotoPageComponents/Tags/Tags";
import {getPhotoById} from "@/lib/unsplash/";
import {Metadata} from "next";


type PhotoPageProps = {
    params: Promise<{id: string}>
}

export async function generateMetadata({params}:PhotoPageProps):Promise<Metadata> {
    const {id} = await params;
    const data = await getPhotoById(id);

    return{
        title: `Photo by ${data.user.name} | Unsplcopied`,
    }
}

const PhotoPage = async ({params}:PhotoPageProps) => {

    const { id } = await params;

    const data:DetailedPhoto = await getPhotoById(id, 3600);


    return (
        <>
            <div className='horizontal-padding row-between'>
                <UserData
                    src={data.user.profile_image.small}
                    name={data.user.name}
                    color={'#000'}
                />
            </div>
            <PhotoDisplay
                src={data.urls.regular}
                alt={data.description ?? 'Unsplash photo'}
                height={data.height}
                width={data.width}
            />
            <div>
                <PhotoAbout
                    downloads={data.downloads}
                    created_at={data.created_at}
                    camera={data.exif.model}
                    description={data.description}
                />
            </div>
            <div className='horizontal-padding'>
                <Tags
                    tags={data.tags}
                />
            </div>
        </>
    );
};

export default PhotoPage;