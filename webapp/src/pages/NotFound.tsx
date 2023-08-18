import { Link } from 'react-router-dom'
import { ConstRoutes } from '../constants/Routes'

const NotFound = () => {
    return (
        <section className="h-screen w-full flex flex-col justify-center items-center dark:bg-black">
            <h1 className="text-9xl font-extrabold dark:text-white tracking-widest">404</h1>
            <div className="bg-yellow-500 px-2 text-sm rounded rotate-12 absolute">
                Page not found
            </div>
            <button className="mt-8">
                <p
                    className="relative inline-block text-sm font-medium text-yellow-500 group active:text-yellow-500 focus:outline-none focus:ring"
                >
                    <span
                        className="absolute inset-0 transition-transform translate-x-0.5 translate-y-0.5 bg-yellow-500 group-hover:translate-y-0 group-hover:translate-x-0"
                    ></span>

                    <Link className="relative block px-8 py-3 bg-black border border-current" to={ConstRoutes.HOME}>
                        <span className='font-semibold'>
                            Back to home
                        </span>
                    </Link>
                </p>
            </button>
        </section>
    )
}

export default NotFound