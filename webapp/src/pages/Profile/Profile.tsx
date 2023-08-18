import { useMutation, useQuery } from '@apollo/client';

import { IPost } from '../../interfaces/Post'
import { DELETE_POST, QUERY_PROFILE, QUERY_USER_POSTS } from '../../apollo';
import Loading from '../../components/Loading';
import UserPost from '../../components/UserPost';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import EditProfile from '../../components/EditProfile';
import { IUser } from '../../interfaces/User';

import defaultAvatar from "../../assets/images/default_avatar.png";
import { BASE_URL } from '../../constants/Url';

const Profile = () => {
    const [showEditProfile, setShowEditProfile] = useState<boolean>(false);
    const location = useLocation();
    const id = location.pathname.split('/')[2];

    const [deletePost] = useMutation(DELETE_POST);

    const posts = useQuery(QUERY_USER_POSTS, {
        variables: { userId: id ?? localStorage.getItem('userId') }
    });

    const profile = useQuery(QUERY_PROFILE, {
        variables: { userId: id ?? localStorage.getItem('userId') }
    });

    const editProfileChangeModal = () => {
        if (localStorage.getItem('userId') === id || !id) {
            setShowEditProfile(!showEditProfile);
            return;
        }
        alert("Follow is not implemented yet")
    }

    const handleDeletePost = (postId: string) => {
        deletePost({
            variables: { input: { postId } },
        }).then((_) => {
            window.location.reload();
        });
    };

    if (posts.loading || profile.loading) return <div className='h-screen w-screen flex items-center justify-center'><Loading /></div>

    const profileData = profile.data.getProfileInformation as IUser;

    return (
        <section className='w-full flex justify-center pb-8 dark:bg-black min-h-screen pt-8 xl:pl-[256px] pl-2 pr-2 sm:pl-20'>
            {showEditProfile && <EditProfile user={profileData} editProfileChangeModal={editProfileChangeModal} />}
            <div className='flex flex-col items-center'>
                <div className="container mx-auto pb-4 px-6">
                    <div className="flex">
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
                            <div className="flex items-start flex-row items-center flex-wrap">
                                <h2 className="text-lg font-semibold mr-6">{profileData.username}</h2>
                                <button onClick={editProfileChangeModal} className="ml-0 mt-2 sm:mt-0 bg-yellow-500 text-white px-4 py-2 rounded-md">
                                    {id ? id === localStorage.getItem('userId') ? 'Edit Profile' : 'Follow' : 'Edit Profile'}
                                </button>
                            </div>
                            <div className="mt-4 text-center hidden sm:flex">
                                <div className="mr-8">
                                    <span className="font-semibold">{posts.data.getUserPosts.length} posts</span>
                                </div>
                                <div className="mr-8">
                                    <span className="font-semibold">0 followers</span>
                                </div>
                                <div>
                                    <span className="font-semibold">0 following</span>
                                </div>
                            </div>
                            <div className="mt-4 hidden sm:block">
                                <p>{profileData.description}</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 dark:text-white sm:hidden">
                        <p>{profileData.description}</p>
                    </div>
                    <div className='dark:text-white border-t border-b mt-12 sm:pb-0 pb-4 sm:border-none'>
                        <div className="grid grid-cols-3 text-center sm:hidden pt-4">
                            <div className="mr-8">
                                <span className="font-semibold">{posts.data.getUserPosts.length} <br />posts</span>
                            </div>
                            <div className="mr-8">
                                <span className="font-semibold">0 <br />followers</span>
                            </div>
                            <div>
                                <span className="font-semibold">0 <br />following</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full border-t sm:mt-8 mb-2 sm:block hidden"></div>
                <h2 className="text-lg font-semibold mb-4 dark:text-white">Posts</h2>
                <div className="max-w-[940px]">
                    {posts.data.getUserPosts.length === 0 && <p className="mt-8 text-gray-500 text-center">User has no posts yet</p>}
                    <div className="grid grid-cols-3 gap-1">
                        {posts.data.getUserPosts.map((post: IPost) => (
                            <UserPost key={post.postId} post={post} handleDeletePost={handleDeletePost} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Profile