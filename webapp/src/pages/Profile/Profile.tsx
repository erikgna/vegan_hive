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
    const id = location.pathname.split('/')[2];

    const posts = useQuery(QUERY_USER_POSTS, {
        variables: { userId: id ?? localStorage.getItem('userId') }
    });

    const profile = useQuery(QUERY_PROFILE, {
        variables: { userId: id ?? localStorage.getItem('userId') }
    });

    const editProfileChangeModal = () => {
        setShowEditProfile(!showEditProfile);
    }

    if (posts.loading || profile.loading) return <div className='h-screen w-screen flex items-center justify-center'><Loading /></div>

    const profileData = profile.data.getProfileInformation as IUser;

    return (
        <section className='w-full flex justify-center pb-8 dark:bg-black min-h-screen pt-8 xl:pl-[256px] pl-2 pr-2 sm:pl-20'>
            {showEditProfile && <EditProfile user={profileData} editProfileChangeModal={editProfileChangeModal} />}
            <div className='flex flex-col items-center'>
                <div className="container mx-auto p-4">
                    <div className="flex">
                        {/* Mostrará a foto do usuário de forma redonda */}
                        <div className='mr-8 sm:mr-16'>
                            <div className="rounded-full overflow-hidden w-24 h-24 sm:w-40 sm:h-40">
                                <img
                                    src={profileData.iconPath === null ? defaultAvatar : `${BASE_URL}${profileData.iconPath}`}
                                    alt={profileData.username}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        <div className='dark:text-white'>
                            {/* Mostrará o nome da pessoa e um botão de seguir ao lado */}
                            <div className="flex items-start flex-col sm:flex-row sm:items-center">
                                <h2 className="text-lg font-semibold">{profileData.username}</h2>
                                <button onClick={editProfileChangeModal} className="ml-0 mt-2 sm:ml-6 sm:mt-0 bg-yellow-500 text-white px-4 py-2 rounded-md">
                                    {id ? 'Follow' : 'Edit Profile'}
                                </button>
                            </div>
                            {/* Mostrará a contagem de posts, seguidores e seguindo */}
                            <div className="mt-4 text-center hidden sm:flex">
                                <div className="mr-8">
                                    <span className="font-semibold">{posts.data.getUserPosts.length} posts</span>
                                </div>
                                <div className="mr-8">
                                    <span className="font-semibold">123 followers</span>
                                </div>
                                <div>
                                    <span className="font-semibold">32 following</span>
                                </div>
                            </div>
                            {/* Mostrará uma descrição do próprio usuário */}
                            <div className="mt-4 hidden sm:block">
                                <p>{profileData.description}</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 dark:text-white sm:hidden">
                        <p>{profileData.description}</p>
                    </div>
                    <div className='dark:text-white'>
                        <div className="grid grid-cols-3 mt-10 text-center sm:hidden">
                            <div className="mr-8">
                                <span className="font-semibold">{posts.data.getUserPosts.length} <br />posts</span>
                            </div>
                            <div className="mr-8">
                                <span className="font-semibold">123 <br />followers</span>
                            </div>
                            <div>
                                <span className="font-semibold">32 <br />following</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full border-t sm:mt-8 mb-2"></div>
                <h2 className="text-lg font-semibold mb-4 dark:text-white">Posts</h2>
                <div className="max-w-[940px]">
                    <div className="grid grid-cols-3 gap-1">
                        {posts.data.getUserPosts.map((post: IPost) => (
                            <UserPost key={post.postId} post={post} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
