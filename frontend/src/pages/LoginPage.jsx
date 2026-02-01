import React, { useState, useContext } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext.jsx'

const LoginPage = () => {
    const [currstate, setCurrstate] = useState('Sign Up')
    const [fullname, setFullname] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [bio, setBio] = useState('')
    const [isDataSubmitted, setIsDataSubmitted] = useState(false)
    const [agree, setAgree] = useState(false)

    const { login } = useContext(AuthContext)

    const onSubmitHandler = (e) => {
        e.preventDefault()

        // Step 1 of signup
        if (currstate === 'Sign Up' && !isDataSubmitted) {
            setIsDataSubmitted(true)
            return
        }

        // Payload control
        const payload =
            currstate === 'Sign Up'
                ? { fullname, email, password, bio }
                : { email, password }

        login(currstate === 'Sign Up' ? 'signup' : 'login', payload)
    }

    return (
        <div className="min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl">

            {/* LEFT */}
            <img
                src={assets.logo_big}
                alt="logo"
                className="w-[min(30vw,250px)]"
            />

            {/* RIGHT */}
            <form
                onSubmit={onSubmitHandler}
                className="border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg"
            >
                <h2 className="font-medium text-2xl flex justify-between items-center">
                    {currstate}
                    {isDataSubmitted && (
                        <img
                            onClick={() => setIsDataSubmitted(false)}
                            src={assets.arrow_icon}
                            alt="back"
                            className="w-5 cursor-pointer"
                        />
                    )}
                </h2>

                {/* SIGNUP STEP 1 */}
                {currstate === 'Sign Up' && !isDataSubmitted && (
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={fullname}
                        onChange={(e) => setFullname(e.target.value)}
                        className="p-2 border border-gray-500 rounded-md"
                        required
                    />
                )}

                {/* EMAIL + PASSWORD */}
                {!isDataSubmitted && (
                    <>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="p-2 border border-gray-500 rounded-md"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="p-2 border border-gray-500 rounded-md"
                            required
                        />
                    </>
                )}

                {/* SIGNUP STEP 2 */}
                {currstate === 'Sign Up' && isDataSubmitted && (
                    <textarea
                        rows={4}
                        placeholder="Provide a short bio..."
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="p-2 border border-gray-500 rounded-md"
                        required
                    />
                )}

                <button
                    type="submit"
                    disabled={!agree}
                    className={`py-3 rounded-md ${agree
                            ? 'bg-gradient-to-r from-purple-500 to-violet-500'
                            : 'bg-gray-600 cursor-not-allowed'
                        }`}
                >
                    {currstate === 'Sign Up' ? 'Create Account' : 'Login Now'}
                </button>

                {/* TERMS */}
                <div className="flex items-center gap-2 text-sm text-gray-400">
                    <input
                        type="checkbox"
                        checked={agree}
                        onChange={() => setAgree(!agree)}
                    />
                    <p>Agree to terms of use & privacy policy</p>
                </div>

                {/* SWITCH */}
                <div className="text-sm text-gray-500">
                    {currstate === 'Sign Up' ? (
                        <p>
                            Already have an account?{' '}
                            <span
                                onClick={() => {
                                    setCurrstate('Login')
                                    setIsDataSubmitted(false)
                                }}
                                className="text-violet-500 cursor-pointer"
                            >
                                Login here
                            </span>
                        </p>
                    ) : (
                        <p>
                            Create an account?{' '}
                            <span
                                onClick={() => setCurrstate('Sign Up')}
                                className="text-violet-500 cursor-pointer"
                            >
                                Click here
                            </span>
                        </p>
                    )}
                </div>
            </form>
        </div>
    )
}

export default LoginPage
