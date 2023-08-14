import React, { useState } from 'react'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

import { errorMessages } from '../../../firebase/error_messages/auth_errors'
import { AuthFormData } from '../../interfaces/Authentication';
import { Link, useNavigate } from 'react-router-dom';
import { ConstRoutes } from '../../constants/Routes';
import { auth } from '../../../firebase';

import googleBtn from '../../assets/images/google_btn.png'

interface AutheticationProps {
    isLogin: boolean;
}

const provider = new GoogleAuthProvider();

export const Authentication = ({ isLogin }: AutheticationProps) => {
    const navigate = useNavigate()

    const [formData, setFormData] = useState<AuthFormData>({ username: '', email: '', password: '', confirmPassword: '' })
    const [errorMessage, setErrorMessage] = useState<string>('')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (formData.email === '' || formData.password === '') {
            setErrorMessage('Fill in all fields')
        } else if ((formData.username === '' || formData.confirmPassword === '') && !isLogin) {
            setErrorMessage('Fill in all fields')
        }
        else if (formData.confirmPassword !== formData.password && !isLogin) {
            setErrorMessage('Passwords do not match')
        }

        isLogin ?
            signInWithEmailAndPassword(auth, formData.email, formData.password)
                .then((_) => navigate(ConstRoutes.HOME))
                .catch((error) => setErrorMessage(errorMessages[error.code]))
            :
            createUserWithEmailAndPassword(auth, formData.email, formData.password)
                .then((_) => navigate(ConstRoutes.LOGIN))
                .catch((error) => setErrorMessage(errorMessages[error.code]))
    }

    const googleSignIn = () => {
        signInWithPopup(auth, provider)
            .then((_) => navigate(ConstRoutes.HOME))
            .catch((_) => setErrorMessage('Google sign in failed'));
    }

    return (
        <section className="flex h-screen">
            <div className="w-1/2 bg-gray-700 flex flex-col justify-center px-6">
                <h1 className="text-4xl font-semibold mb-4 text-white">O Melhor Espaço Para Se Cuidar</h1>
                <p className="text-sm text-white mb-8">Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>
                <div className="flex">
                    <button className="font-semibold bg-white text-gray-700 px-4 py-2 hover:bg-yellow-500 hover:text-white focus:outline-none focus:ring focus:border-yellow-300 mr-4 transition-all duration-300">Aprenda sobre nós</button>
                    <button className="font-semibold text-white bg-transparent border border-white px-4 py-2 mr-4 hover:text-yellow-500 hover:border-yellow-500 focus:outline-none focus:ring focus:border-yellow-300 transition-all duration-300">Ver agenda</button>
                </div>
            </div>
            <form onSubmit={handleSubmit} className="w-1/2 px-8 flex flex-col justify-center items-start">
                <h1 className="text-3xl font-bold mb-3">Posturalle</h1>
                <p className="text-sm text-gray-600 mb-6">Acesse sua conta para agendar uma consulta</p>

                {!isLogin &&
                    <div className="mb-4 w-full max-w-[700px]">
                        <label htmlFor="username" className="block text-sm font-semibold mb-2">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Type your username"
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-yellow-300"
                            onChange={handleChange}
                            value={formData.username}
                            required={!isLogin}
                        />
                    </div>
                }
                <div className="mb-4 w-full max-w-[700px]">
                    <label htmlFor="email" className="block text-sm font-semibold mb-2">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Type your email"
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-yellow-300"
                        onChange={handleChange}
                        value={formData.email}
                        required
                    />
                </div>
                <div className="mb-4 w-full max-w-[700px]">
                    <label htmlFor="password" className="block text-sm font-semibold mb-2">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Type your password"
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-yellow-300"
                        onChange={handleChange}
                        value={formData.password}
                        required
                    />
                </div>
                {!isLogin &&
                    <div className="mb-2 w-full max-w-[700px]">
                        <label htmlFor="confirmPassword" className="block text-sm font-semibold mb-2">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            placeholder="Type your password confirmation"
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-yellow-300"
                            onChange={handleChange}
                            value={formData.confirmPassword}
                            required={!isLogin}
                        />
                    </div>
                }

                {errorMessage && <p className="text-red-500 mb-2 text-sm">{errorMessage}</p>}

                {isLogin && <Link to={ConstRoutes.FORGOT_PASSWORD} className="text-yellow-500 text-sm mb-4">Forgot you password?</Link>}
                <button type="submit" className="mt-2 bg-yellow-500 text-white font-semibold py-2 px-4 rounded hover:bg-yellow-600 focus:outline-none focus:ring focus:border-yellow-300 max-w-[700px] w-full">{isLogin ? "Login" : "Register"}</button>

                <p className="text-sm mt-2">
                    {isLogin ? "Doesn't have an account yet? " : "Already have an account? "}
                    <Link to={isLogin ? ConstRoutes.REGISTER : ConstRoutes.LOGIN} className="text-yellow-500 font-semibold">{isLogin ? "Sign up here" : "Sign in here"}</Link>
                </p>
                <div className="mt-4 flex items-center cursor-pointer bg-white border rounded-lg p-2" onClick={googleSignIn}>
                    <img className="w-6 h-6 mr-4" src={googleBtn} alt="google login" />
                    <p className="text-gray-700">Sign in with Google</p>
                </div>
            </form>
        </section>
    )
}
