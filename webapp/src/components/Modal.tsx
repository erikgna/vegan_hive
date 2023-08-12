import React from 'react'

interface ModalPrps {
    changeModal: () => void;
    children: React.ReactNode;
}

export const Modal = ({ changeModal, children }: ModalPrps) => {
    const handleOutsideClick = (event: React.MouseEvent) => {
        if (event.target === event.currentTarget) {
            changeModal()
        }
    }

    return (
        <div onClick={handleOutsideClick} className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="flex bg-white p-4 overflow-hidden relative rounded-md dark:bg-black">
                {children}
            </div>
        </div>
    )
}
