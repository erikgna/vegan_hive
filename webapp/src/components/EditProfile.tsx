import { useState } from 'react';

import { Modal } from './Modal'
import { useMutation } from '@apollo/client';
import { auth } from '../../firebase';
import { EDIT_USER } from '../apollo';
import { Loading } from './Loading';
import { IUser } from '../interfaces/User';
import { BASE_URL } from '../constants/Url';

import defaultAvatar from '../assets/images/default_avatar.png'

interface EditProfileProps {
    editProfileChangeModal: () => void;
    user: IUser;
}

export const EditProfile = ({ editProfileChangeModal, user }: EditProfileProps) => {
    const [description, setDescription] = useState<string>(user.description ?? '')
    const [username, setUsername] = useState<string>(user.username ?? '')
    const [selectedImage, setSelectedImage] = useState<File | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(false)

    const [editUser] = useMutation(EDIT_USER);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        setLoading(true)
        await editUser({
            variables: {
                input: {
                    description: description,
                    email: auth.currentUser?.email,
                    file: selectedImage,
                    username: username
                }
            }
        }).finally(() => window.location.reload())
    }

    return (
        <>
            <Modal changeModal={editProfileChangeModal}>
                <div className="flex flex-col justify-center items-center p-4 min-w-[320px]">
                    <h2 className="text-xl font-semibold mb-2 dark:text-white">Editing profile</h2>
                    {loading ? <div className='mt-8'>
                        <Loading />
                    </div> :
                        <form onSubmit={handleSubmit}>
                            <div className="w-full max-w-[700px] mb-4 relative overflow-hidden mt-4 dark:text-white">
                                <label htmlFor="image" className="block text-sm font-semibold mb-2">
                                    Change Profile Image
                                </label>
                                <div className="bg-gray-100 border border-dashed border-gray-400 text-center p-8 cursor-pointer hover:bg-gray-200 dark:bg-black dark:hover:bg-gray-900 transition-all duration-300">
                                    {selectedImage ? (
                                        <img
                                            src={URL.createObjectURL(selectedImage)}
                                            alt="Preview"
                                            className="mx-auto h-full w-full object-contain"
                                        />
                                    ) : (
                                        <img
                                            src={user.iconPath === null ? defaultAvatar : `${BASE_URL}/${user.iconPath}`}
                                            alt="Old Profile"
                                            className="mx-auto h-24 w-24 mb-2 rounded-full object-cover"
                                        />
                                    )}
                                    {!selectedImage && <p className="text-gray-500">Upload a new image</p>}
                                    <input
                                        type="file"
                                        id="image"
                                        name="image"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        onChange={(e) => setSelectedImage(e.target.files?.[0])}
                                    />
                                </div>
                            </div>
                            <div className="mb-4 w-full max-w-[700px] dark:text-white">
                                <label htmlFor="username" className="block text-sm font-semibold mb-2">Your name</label>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    placeholder="Type your name"
                                    className="w-full min-w-[320px] px-3 py-2 border rounded focus:outline-none focus:ring focus:border-yellow-300 resize-none dark:bg-transparent dark:border-gray-600 dark:text-white"
                                    onChange={(e) => setUsername(e.target.value)}
                                    value={username}
                                    required
                                />
                            </div>
                            <div className="mb-4 w-full max-w-[700px] dark:text-white">
                                <label htmlFor="description" className="block text-sm font-semibold mb-2">Your description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    placeholder="Type the description"
                                    className="w-full min-w-[320px] px-3 py-2 border rounded focus:outline-none focus:ring focus:border-yellow-300 resize-none dark:bg-transparent dark:border-gray-600 dark:text-white"
                                    onChange={(e) => setDescription(e.target.value)}
                                    value={description}
                                    required
                                />
                            </div>
                            <div className="w-full flex justify-center">
                                <button type='submit' className="w-full font-semibold py-2 bg-yellow-500 text-white focus:outline-none border-yellow-300 hover:bg-yellow-700 mr-2 transition-all duration-300">Edit Profile</button>
                                <button onClick={editProfileChangeModal} className="w-full font-semibold border py-2 text-yellow-500 hover:text-yellow-300 border-yellow-500 focus:outline-none border-yellow-300 transition-all duration-300">Cancel</button>
                            </div>
                        </form>
                    }
                </div>
            </Modal>
        </>
    )
}
