import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { Modal } from './Modal';
import { ConstRoutes } from '../constants/Routes';
import { NewPost } from './NewPost';

import houseIconDark from '../assets/icons/house-solid-dark.svg';
import houseIconWhite from '../assets/icons/house-solid-white.svg';
import powerOffWhite from '../assets/icons/power-off-solid-white.svg';
import powerOffDark from '../assets/icons/power-off-solid-dark.svg';
import plusIcon from '../assets/icons/plus-solid.svg';
import sunIcon from '../assets/icons/moon-regular.svg';
import moonIcon from '../assets/icons/sun-regular.svg';

export const SideBar = () => {
    const location = useLocation();
    const [current, setCurrent] = useState<string>(location.pathname);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
    const [showNewPostModal, setShowNewPostModal] = useState<boolean>(false)

    const changeCurrentRoute = (path: string) => setCurrent(path);

    const changeDeleteModal = () => {
        setShowDeleteModal(!showDeleteModal)
    }

    const changeShowNewPostModal = () => {
        setShowNewPostModal(!showNewPostModal)
    }

    const changeThemeMode = () => {
        const root = document.getElementsByTagName('html')[0];
        if (root.classList.contains('dark')) {
            window.localStorage.setItem('theme', 'light');
        } else {
            window.localStorage.setItem('theme', 'dark');
        }

        window.location.reload();
    }

    if (current === ConstRoutes.LOGIN || current === ConstRoutes.FORGOT_PASSWORD || current === ConstRoutes.REGISTER) {
        return null;
    }

    return (
        <aside className='flex flex-col justify-between fixed inset-0 bg-white w-64 h-full border-r border-grey-500 pt-4 dark:bg-black dark:border-gray-800'>
            {showDeleteModal &&
                <Modal changeModal={changeDeleteModal}>
                    <div className="flex flex-col justify-center p-4 text-center">
                        <h2 className="text-xl font-semibold mb-2 dark:text-white">Confirm Sign Out</h2>
                        <p className="text-gray-600 dark:text-white">Are you sure you want to sign out?</p>
                        <div className="w-full flex justify-center mt-6">
                            <button className="w-full font-semibold py-2 bg-yellow-500 text-white focus:outline-none border-yellow-300 hover:bg-yellow-700 mr-2 transition-all duration-300">Confirm</button>
                            <button onClick={changeDeleteModal} className="w-full font-semibold border py-2 text-yellow-500 hover:text-yellow-300 border-yellow-500 focus:outline-none border-yellow-300 transition-all duration-300">Cancel</button>
                        </div>
                    </div>
                </Modal>
            }
            {showNewPostModal && <NewPost changeShowNewPostModal={changeShowNewPostModal} />}
            <div>
                <Link to={ConstRoutes.HOME} onClick={() => changeCurrentRoute(ConstRoutes.HOME)}>
                    <div className="w-full flex justify-center">
                        <svg className="h-36 w-36" focusable="false" aria-hidden="true" viewBox="0 0 263.69 158.65"><g fill="#F3AD2E"><path d="M131.26,99.56,99.48,81.92A20.47,20.47,0,0,1,88.82,64V34.81c0-5.81,3-16.58,10.9-20.82L120.47,2.81A23.3,23.3,0,0,1,142.91,3l20.6,11.43c6.63,3.69,10.14,12.64,10.6,19.4v.15l0,30.55a20.5,20.5,0,0,1-10.9,17.83Zm.3-95a18.84,18.84,0,0,0-8.94,2.26L101.87,18c-5.75,3.1-8.47,11.88-8.51,16.84V64a15.92,15.92,0,0,0,8.33,14l29.6,16.43,29.82-16.07a15.94,15.94,0,0,0,8.51-13.84l0-30.45c-.42-5.74-3.38-12.94-8.28-15.66L140.71,6.93A18.79,18.79,0,0,0,131.56,4.55Z"></path><path d="M160.11,35.32c-.41-7.23-3.18-12.16-7.82-13.87h0c-6.29-2.34-14.13,1.91-21,11.16h-.19c-6.84-9.26-14.68-13.51-21-11.17-4.64,1.71-7.42,6.64-7.82,13.87-.37,6.6,2,14.67,5.26,22.71a64.61,64.61,0,0,0,10.84,17c4.22,4.84,12.21,10.2,12.78,10.2h0c.61,0,8.59-5.39,12.78-10.2a64.77,64.77,0,0,0,10.84-17C158.16,50,160.48,41.92,160.11,35.32ZM131.18,77c-3.43-7.21-9.09-20.35-9.09-28.36,0-6.12,3.94-10.74,9.17-10.74s9.16,4.62,9.16,10.74C140.42,55,135,68.44,131.18,77ZM112.07,56.38c-6.52-15.83-5.69-28.65-.16-30.7a5.18,5.18,0,0,1,1.85-.32c3.56,0,8.11,2.9,12.4,8.18-5.69,2.15-9.66,7.89-9.66,15.05,0,7,4.22,17.54,7.49,25.2C119.61,68.68,114.11,61.32,112.07,56.38Zm38.31,0c-2.1,5.11-7.85,12.74-12.34,17.91,3.39-8.11,8-19.44,8-25.7,0-7.18-4-12.92-9.7-15.07,5.07-6.26,10.5-9.23,14.24-7.84,2.74,1,4.48,4.62,4.78,9.88C155.66,41.53,153.46,48.92,150.38,56.38Z"></path><path d="M35.68,106.74a2.17,2.17,0,0,1,.65,1.62,3.63,3.63,0,0,1-.31,1.35L20.59,145.1a2.45,2.45,0,0,1-2.45,1.72,2.57,2.57,0,0,1-2.45-1.72L.42,110.18A5.33,5.33,0,0,1,0,108.36a2.15,2.15,0,0,1,.65-1.65,2.56,2.56,0,0,1,1.8-.6A2.48,2.48,0,0,1,5,107.73l13.14,31.48,13.34-31.48a2.39,2.39,0,0,1,.94-1.28,3,3,0,0,1,1.51-.34A2.5,2.5,0,0,1,35.68,106.74Z"></path><path d="M59.15,133.76a2.39,2.39,0,0,1-1.72.66H37.62a9.17,9.17,0,0,0,3.31,5.88,10.2,10.2,0,0,0,6.7,2.25,11.17,11.17,0,0,0,6-2,2.67,2.67,0,0,1,1.72-.58,2.44,2.44,0,0,1,2.5,2.3,1.88,1.88,0,0,1-.83,1.56,14.37,14.37,0,0,1-4.4,2.29,15.89,15.89,0,0,1-12.69-1A13.35,13.35,0,0,1,34.68,140a14.55,14.55,0,0,1-1.91-7.45,15.41,15.41,0,0,1,1.8-7.48,13.13,13.13,0,0,1,5-5.16,14.33,14.33,0,0,1,7.28-1.85,13.13,13.13,0,0,1,6.93,1.77,11.77,11.77,0,0,1,4.48,5,16.32,16.32,0,0,1,1.56,7.29A2.17,2.17,0,0,1,59.15,133.76Zm-18.48-9.09a9.39,9.39,0,0,0-3,5.58H55a9.2,9.2,0,0,0-2.61-5.58,7.63,7.63,0,0,0-5.57-2.09A9,9,0,0,0,40.67,124.67Z"></path><path d="M85.73,120a13.42,13.42,0,0,1,5.11,5.14,15,15,0,0,1,1.85,7.5v11.26a15.5,15.5,0,0,1-1.83,7.5,13.6,13.6,0,0,1-5.13,5.35,14.47,14.47,0,0,1-7.48,2,16.57,16.57,0,0,1-7-1.48,14.65,14.65,0,0,1-5.42-4.25,2.37,2.37,0,0,1-.57-1.46,2.28,2.28,0,0,1,1.1-1.88,2.68,2.68,0,0,1,1.46-.47,2.57,2.57,0,0,1,2.13,1.1A9.28,9.28,0,0,0,73.51,153a11.68,11.68,0,0,0,4.84,1A9,9,0,0,0,83,152.74a8.9,8.9,0,0,0,3.34-3.6,12,12,0,0,0,1.25-5.66v-2.55a12,12,0,0,1-4.28,4.48,11.28,11.28,0,0,1-6,1.62,13.11,13.11,0,0,1-6.91-1.85A12.66,12.66,0,0,1,65.66,140,16,16,0,0,1,64,132.59a15.22,15.22,0,0,1,1.82-7.5A13.15,13.15,0,0,1,70.9,120a14.94,14.94,0,0,1,7.45-1.85A14.7,14.7,0,0,1,85.73,120Zm-2.61,21.14a8.73,8.73,0,0,0,3.29-3.47,10.6,10.6,0,0,0,1.17-5,10.71,10.71,0,0,0-1.17-5,8.68,8.68,0,0,0-3.29-3.5,9.73,9.73,0,0,0-9.54,0,8.86,8.86,0,0,0-3.31,3.5,10.49,10.49,0,0,0-1.19,5,10.38,10.38,0,0,0,1.19,5,8.92,8.92,0,0,0,3.31,3.47,9.73,9.73,0,0,0,9.54,0Z"></path><path d="M118.49,120a14,14,0,0,1,5.16,5.22,14.48,14.48,0,0,1,1.9,7.37v11.62a2.69,2.69,0,0,1-4.56,1.91,2.62,2.62,0,0,1-.76-1.91v-1.92a13.12,13.12,0,0,1-16.86,2.86A13.16,13.16,0,0,1,98.58,140a15.52,15.52,0,0,1-1.75-7.38,14.67,14.67,0,0,1,1.88-7.37,13.74,13.74,0,0,1,5.18-5.22,14.54,14.54,0,0,1,7.33-1.9A14.24,14.24,0,0,1,118.49,120Zm-2.56,21.06a9,9,0,0,0,3.31-3.49,10.3,10.3,0,0,0,1.2-5,10.41,10.41,0,0,0-1.2-5,9.18,9.18,0,0,0-12.74-3.52,9.13,9.13,0,0,0-3.34,3.52,10.31,10.31,0,0,0-1.22,5,10.2,10.2,0,0,0,1.22,5,9.19,9.19,0,0,0,3.34,3.49,9.32,9.32,0,0,0,9.43,0Z"></path><path d="M150.34,119.61a11.12,11.12,0,0,1,4.48,4.56,15.13,15.13,0,0,1,1.61,7.22v12.82a2.66,2.66,0,1,1-5.31,0V131.39q0-4.21-2.27-6.38a8.37,8.37,0,0,0-6-2.17,8.92,8.92,0,0,0-4,.89,7,7,0,0,0-2.81,2.4,5.93,5.93,0,0,0-1,3.39v14.69a2.63,2.63,0,0,1-.73,1.91,2.82,2.82,0,0,1-3.83,0,2.61,2.61,0,0,1-.75-1.91V121a2.58,2.58,0,0,1,.75-1.93A2.65,2.65,0,0,1,135,121v.57a11.61,11.61,0,0,1,4-2.58,13.09,13.09,0,0,1,4.9-.91A13.34,13.34,0,0,1,150.34,119.61Z"></path><path d="M191,106.87a2.71,2.71,0,0,1,1.93-.76,2.62,2.62,0,0,1,1.91.76,2.65,2.65,0,0,1,.75,1.95v35.29a2.64,2.64,0,0,1-.75,1.95,2.58,2.58,0,0,1-1.91.76,2.66,2.66,0,0,1-2.71-2.71V128.58H166v15.53a2.65,2.65,0,0,1-.76,1.93,2.58,2.58,0,0,1-2,.78,2.66,2.66,0,0,1-2.71-2.71V108.82a2.6,2.6,0,0,1,.78-1.95,2.68,2.68,0,0,1,1.93-.76,2.6,2.6,0,0,1,2.71,2.71v15h24.18v-15A2.6,2.6,0,0,1,191,106.87Z"></path><path d="M205.15,107.81a3.39,3.39,0,1,1-2.42-1A3.3,3.3,0,0,1,205.15,107.81ZM200.82,119a2.63,2.63,0,0,1,1.91-.73,2.56,2.56,0,0,1,1.92.73,2.6,2.6,0,0,1,.73,1.93v23.19a2.59,2.59,0,0,1-.73,1.9,2.51,2.51,0,0,1-1.92.76,2.58,2.58,0,0,1-2.66-2.66V121A2.58,2.58,0,0,1,200.82,119Z"></path><path d="M235.87,119.53a2.21,2.21,0,0,1,.36,1.23,2.15,2.15,0,0,1-.26,1l-11.05,23.3a2.55,2.55,0,0,1-2.39,1.72,2.52,2.52,0,0,1-1.46-.39,3.46,3.46,0,0,1-1-1.33L209,121.75a2.2,2.2,0,0,1-.2-.94,2.3,2.3,0,0,1,1.46-2.14,2.22,2.22,0,0,1,1.09-.26,2.37,2.37,0,0,1,1.2.34,2.24,2.24,0,0,1,.88,1l9.07,19.54,9-19.54a2.25,2.25,0,0,1,.91-1,2.64,2.64,0,0,1,1.28-.34,2.71,2.71,0,0,1,1.2.26A2.48,2.48,0,0,1,235.87,119.53Z"></path><path d="M263,133.76a2.39,2.39,0,0,1-1.72.66H241.49a9.17,9.17,0,0,0,3.31,5.88,10.2,10.2,0,0,0,6.7,2.25,11.1,11.1,0,0,0,6-2,2.67,2.67,0,0,1,1.72-.58,2.46,2.46,0,0,1,2.51,2.3,1.89,1.89,0,0,1-.84,1.56,14.37,14.37,0,0,1-4.4,2.29,15.89,15.89,0,0,1-12.69-1,13.35,13.35,0,0,1-5.29-5.14,14.55,14.55,0,0,1-1.91-7.45,15.41,15.41,0,0,1,1.8-7.48,13.09,13.09,0,0,1,5-5.16,14.29,14.29,0,0,1,7.27-1.85,13.13,13.13,0,0,1,6.93,1.77,11.77,11.77,0,0,1,4.48,5,16.32,16.32,0,0,1,1.56,7.29A2.17,2.17,0,0,1,263,133.76Zm-18.48-9.09a9.39,9.39,0,0,0-3,5.58H258.9a9.2,9.2,0,0,0-2.61-5.58,7.63,7.63,0,0,0-5.57-2.09A9,9,0,0,0,244.54,124.67Z"></path></g></svg>
                    </div>
                </Link>
                <ul className="space-y-3 font-medium px-3 mt-4">
                    <li>
                        <Link onClick={() => changeCurrentRoute(ConstRoutes.HOME)} to={ConstRoutes.HOME} className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 group dark:text-white transition-all duration-300 ${current === ConstRoutes.HOME ? 'bg-gray-100 dark:bg-gray-900' : ''}`}>
                            <img src={window.localStorage.getItem('theme')?.includes('dark') ? houseIconWhite : houseIconDark} alt='home' className="w-8 h-8 text-gray-500 transition duration-75 group-hover:text-gray-900" />
                            <span className="ml-3">Home</span>
                        </Link>
                    </li>
                    <li>
                        <Link onClick={() => changeCurrentRoute(ConstRoutes.PROFILE)} to={ConstRoutes.PROFILE} className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 group dark:text-white transition-all duration-300 ${current === ConstRoutes.PROFILE ? 'bg-gray-100 dark:bg-gray-900' : ''}`}>
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/President_Barack_Obama.jpg/245px-President_Barack_Obama.jpg"
                                alt="User Avatar"
                                className="w-8 h-8 rounded-full"
                            />
                            <span className="ml-3">Profile</span>
                        </Link>
                    </li>
                    <li className='pt-8'>
                        <button onClick={changeShowNewPostModal} className="flex items-center justify-center bg-yellow-500 p-2 rounded-lg font-semibold text-white w-full transition duration-300 ease-in-out hover:bg-yellow-600">
                            <img src={plusIcon} alt="Ícone" className="w-5 h-5 mr-2" />
                            New Post
                        </button>
                    </li>
                </ul>
            </div>
            <div className='px-2 pb-4'>
                <div onClick={changeThemeMode} className='flex items-center cursor-pointer pb-3 pl-2'>
                    <img className='h-6 w-6 mr-2' src={window.localStorage.getItem('theme')?.includes('dark') ? sunIcon : moonIcon} alt="light toggle" />
                    <span className='font-bold text-yellow-500'>{window.localStorage.getItem('theme')?.includes('dark') ? 'Light mode' : 'Dark mode'}</span>
                </div>
                <div onClick={changeDeleteModal} className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 cursor-pointer dark:text-white transition-all duration-300">
                    <img src={window.localStorage.getItem('theme')?.includes('dark') ? powerOffWhite : powerOffDark} alt='home' className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900" />
                    <span className="ml-3">Logout</span>
                </div>
            </div>
        </aside>
    )
}