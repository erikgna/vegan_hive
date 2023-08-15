import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { sendPasswordResetEmail } from 'firebase/auth';

import { ConstRoutes } from '../../constants/Routes'
import { auth } from '../../../firebase';
import { Loading } from '../../components/Loading';
import { errorMessages } from '../../../firebase/error_messages/auth_errors';
import { FeedbackTypes } from '../../constants/FeedbackTypes';

export const ForgotPassword = () => {
    const [email, setEmail] = React.useState<string>('')
    const [loading, setLoading] = React.useState<boolean>(false)
    const [feedback, setFeedback] = useState({ msg: '', type: '' })

    const onRecoverPassword = (e: React.FormEvent) => {
        e.preventDefault()

        setLoading(true)
        sendPasswordResetEmail(auth, email)
            .then((_) => setFeedback({ msg: "Email sent successfuly!", type: FeedbackTypes.SUCCESS }))
            .catch((error) => setFeedback({ msg: errorMessages[error.code], type: FeedbackTypes.ERROR }))
            .finally(() => setLoading(false))
    }

    return <section className="flex h-screen">
        <div className="w-1/2 bg-gray-700 flex flex-col justify-center px-6">
            <h1 className="text-4xl font-semibold mb-4 text-white">O Melhor Espaço Para Se Cuidar</h1>
            <p className="text-sm text-white mb-8">Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>
            <div className="flex">
                <button className="font-semibold bg-white text-gray-700 px-4 py-2 hover:bg-yellow-500 hover:text-white focus:outline-none focus:ring focus:border-yellow-300 mr-4 transition-all duration-300">Aprenda sobre nós</button>
                <button className="font-semibold text-white bg-transparent border border-white px-4 py-2 mr-4 hover:text-yellow-500 hover:border-yellow-500 focus:outline-none focus:ring focus:border-yellow-300 transition-all duration-300">Ver agenda</button>
            </div>
        </div>

        <form onSubmit={onRecoverPassword} className="w-1/2 px-8 flex flex-col justify-center items-start">
            <h1 className="text-3xl font-bold mb-3">Posturalle</h1>
            <p className="text-sm text-gray-600 mb-6">Ao apertar em recuperar senha, você receberá um email com um link para resetar sua senha.</p>

            <div className="mb-2 w-full max-w-[700px]">
                <label htmlFor="email" className="block text-sm font-semibold mb-2">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Type your email"
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-yellow-300"
                    onChange={e => setEmail(e.target.value)}
                    value={email}
                    required
                />
            </div>

            {feedback.msg !== '' && <p className={`text-${feedback.type === FeedbackTypes.ERROR ? 'red' : 'green'}-600 mb-2 text-sm`}>{feedback.msg}</p>}

            {loading ?
                <Loading /> :
                <button type="submit" className="bg-yellow-500 text-white font-semibold py-2 px-4 rounded hover:bg-yellow-600 focus:outline-none focus:ring focus:border-yellow-300 max-w-[700px] w-full">Recover password</button>
            }

            <p className="text-sm mt-2">
                Already has an account? <Link to={ConstRoutes.LOGIN} className="text-yellow-500 font-semibold">Sign in here</Link>
            </p>
        </form>
    </section>
}
