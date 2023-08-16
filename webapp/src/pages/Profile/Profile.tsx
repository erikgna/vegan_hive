import { useQuery } from '@apollo/client';

import { IPost } from '../../interfaces/Post'
import { QUERY_PROFILE, QUERY_USER_POSTS } from '../../apollo';
import { Loading } from '../../components/Loading';
import { UserPost } from '../../components/UserPost';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import { EditProfile } from '../../components/EditProfile';
import { IUser } from '../../interfaces/User';

import defaultAvatar from "../../assets/images/default_avatar.png";
import { BASE_URL } from '../../constants/Url';

export const Profile = () => {
    const [showEditProfile, setShowEditProfile] = useState<boolean>(false);
    const location = useLocation();
    const email = location.pathname.split('/')[2];

    const posts = useQuery(QUERY_USER_POSTS, {
        variables: {
            authorEmail: email ?? JSON.parse(localStorage.getItem('user') ?? '')['email']
        }
    });

    const profile = useQuery(QUERY_PROFILE, {
        variables: {
            email: email ?? JSON.parse(localStorage.getItem('user') ?? '')['email']
        }
    });

    const editProfileChangeModal = () => {
        setShowEditProfile(!showEditProfile);
    }

    if (posts.loading || profile.loading) return <div><Loading /></div>

    const profileData = profile.data.getProfileInformation as IUser;

    return (
        <section className='w-full flex justify-center pb-8 dark:bg-black min-h-screen pl-[256px] pt-8'>
            {showEditProfile && <EditProfile user={profileData} editProfileChangeModal={editProfileChangeModal} />}
            <div className='flex flex-col items-center'>
                <div className="container mx-auto p-4">
                    <div className="flex">
                        {/* Mostrará a foto do usuário de forma redonda */}
                        <div className='w-[310px]'>
                            <div className="rounded-full overflow-hidden w-40 h-40">
                                <img
                                    src={profileData.iconPath === null ? defaultAvatar : `${BASE_URL}${profileData.iconPath}`}
                                    alt={profileData.username}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        <div className='dark:text-white'>
                            {/* Mostrará o nome da pessoa e um botão de seguir ao lado */}
                            <div className="flex items-center">
                                <h2 className="text-lg font-semibold">{profileData.username}</h2>
                                <button onClick={editProfileChangeModal} className="ml-6 bg-yellow-500 text-white px-4 py-2 rounded-md">
                                    {email ? 'Follow' : 'Edit Profile'}
                                </button>
                            </div>
                            {/* Mostrará a contagem de posts, seguidores e seguindo */}
                            <div className="flex mt-4">
                                <div className="mr-8">
                                    <span className="font-semibold">10 posts</span>
                                </div>
                                <div className="mr-8">
                                    <span className="font-semibold">123 followers</span>
                                </div>
                                <div>
                                    <span className="font-semibold">32 following</span>
                                </div>
                            </div>
                            {/* Mostrará uma descrição do próprio usuário */}
                            <div className="mt-4">
                                <p>{profileData.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full border-t mt-8 mb-2"></div>
                <h2 className="text-lg font-semibold mb-4 dark:text-white">Posts</h2>
                <div className="max-w-[940px]">
                    <div className="grid grid-cols-3 gap-2">
                        {posts.data.getUserPosts.map((post: IPost) => (
                            <UserPost key={post.postId} post={post} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
