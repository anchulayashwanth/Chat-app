import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext'

const ProfilePage = () => {
    const { authUser, updateProfile } = useContext(AuthContext)
    const [selectedImg, setSelectedImg] = useState(null)
    const [name, setName] = useState(authUser?.fullname || '')
    const [bio, setBio] = useState(authUser?.bio || '')
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!selectedImg) {
            await updateProfile({ fullname: name, bio })
            navigate('/')
            return
        }

        const reader = new FileReader()
        reader.readAsDataURL(selectedImg)
        reader.onload = async () => {
            await updateProfile({
                profilepic: reader.result,
                fullname: name,
                bio
            })
            navigate('/')
        }
    }

    // Cleanup object URL
    useEffect(() => {
        return () => {
            if (selectedImg) URL.revokeObjectURL(selectedImg)
        }
    }, [selectedImg])

    return (
        <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center">
            <div className="w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg">

                {/* FORM */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-10 flex-1">
                    <h3 className="text-lg">Profile Details</h3>

                    {/* AVATAR */}
                    <label htmlFor="avatar" className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="file"
                            id="avatar"
                            accept=".png,.jpg,.jpeg"
                            hidden
                            onChange={(e) => setSelectedImg(e.target.files[0])}
                        />
                        <img
                            src={
                                selectedImg
                                    ? URL.createObjectURL(selectedImg)
                                    : authUser?.profilepic || assets.avatar_icon
                            }
                            alt="avatar"
                            className="w-12 h-12 rounded-full"
                        />
                        Upload profile image
                    </label>

                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        required
                        className="p-2 border border-gray-500 rounded-md focus:ring-2 focus:ring-violet-500"
                    />

                    <textarea
                        rows={4}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Write your bio..."
                        required
                        className="p-2 border border-gray-500 rounded-md focus:ring-2 focus:ring-violet-500"
                    />

                    <button
                        type="submit"
                        className="bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full text-lg"
                    >
                        Save
                    </button>
                </form>

                {/* SIDE PREVIEW */}
                <img
                    src={authUser?.profilepic || assets.logo_icon}
                    alt="preview"
                    className="max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10"
                />
            </div>
        </div>
    )
}

export default ProfilePage
