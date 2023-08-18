import { useState } from 'react';

import Modal from './Modal'
import { useMutation } from '@apollo/client';
import { CREATE_POST } from '../apollo';
import Loading from './Loading';
import React from 'react';

interface NewPostProps {
    changeShowNewPostModal: () => void;
}

const NewPost = ({ changeShowNewPostModal }: NewPostProps) => {
    const [description, setDescription] = useState<string>('')
    const [selectedImage, setSelectedImage] = useState<File | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(false)

    const [postPost] = useMutation(CREATE_POST);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        setLoading(true)
        await postPost({
            variables: {
                input: {
                    content: description,
                    file: selectedImage
                }
            }
        }).finally(() => window.location.reload())
    }

    return (
        <>
            <Modal changeModal={changeShowNewPostModal}>
                <div className="flex flex-col justify-center items-center p-1 sm:p-4 min-w-[260px] min-w-[320px]">
                    <h2 className="text-xl font-semibold mb-2 dark:text-white">New Post</h2>
                    {loading ? <div className='mt-8'>
                        <Loading />
                    </div> :
                        <form onSubmit={handleSubmit}>
                            <div className="w-full max-w-[700px] mb-4 relative overflow-hidden mt-4 dark:text-white">
                                <label htmlFor="image" className="block text-sm font-semibold mb-2">
                                    Upload Image
                                </label>
                                <div className="bg-gray-100 border border-dashed border-gray-400 text-center p-8 cursor-pointer hover:bg-gray-200 dark:bg-[#111] dark:hover:bg-gray-900 transition-all duration-300">
                                    {selectedImage ? (
                                        <img src={URL.createObjectURL(selectedImage)} alt="Preview" className="mx-auto h-full w-full object-contain" />
                                    ) : (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="mx-auto h-12 w-12 text-gray-400 mb-2"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M2 7a2 2 0 012-2h12a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V7zm2-1a1 1 0 00-1 1v6a1 1 0 001 1h12a1 1 0 001-1V7a1 1 0 00-1-1H4z"
                                                clipRule="evenodd"
                                            />
                                            <path
                                                fillRule="evenodd"
                                                d="M9.293 13.293a1 1 0 001.414 0L12 11.414V16a1 1 0 102 0V11.414l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 101.414 1.414zM4 15a1 1 0 100-2 1 1 0 000 2z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    )}
                                    {!selectedImage && <p className="text-gray-500">Upload an image</p>}
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
                                <label htmlFor="description" className="block text-sm font-semibold mb-2">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    placeholder="Type the description"
                                    className="w-full min-w-[260px] sm:min-w-[320px] px-3 py-2 border rounded focus:outline-none focus:ring focus:border-yellow-300 resize-none dark:bg-transparent dark:border-gray-600 dark:text-white"
                                    onChange={(e) => setDescription(e.target.value)}
                                    value={description}
                                    required
                                />
                            </div>
                            <div className="w-full flex justify-center">
                                <button type='submit' className="w-full font-semibold py-2 bg-yellow-500 text-white focus:outline-none border-yellow-300 hover:bg-yellow-700 mr-2 transition-all duration-300">Create Post</button>
                                <button onClick={changeShowNewPostModal} className="w-full font-semibold border py-2 text-yellow-500 hover:text-yellow-300 border-yellow-500 focus:outline-none border-yellow-300 transition-all duration-300">Cancel</button>
                            </div>
                        </form>
                    }
                </div>
            </Modal>
        </>
    )
}

export default React.memo(NewPost)
