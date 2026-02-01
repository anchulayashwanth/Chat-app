import React, { useContext, useEffect, useState } from 'react'
import assets from '../assets/assets'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'

const RightSideBar = () => {
    const { selectedUser, messages } = useContext(ChatContext)
    const { logout, onlineUsers } = useContext(AuthContext)
    const [messageImg, setMessageImg] = useState([])

    // extract images from messages
    useEffect(() => {
        if (!messages?.length) {
            setMessageImg([])
            return
        }

        const imgs = messages
            .filter(msg => msg.image)
            .map(msg => msg.image)

        setMessageImg(imgs)
    }, [messages])

    if (!selectedUser) return null

    return (
        <div className={`bg-[#8185b2]/10 text-white w-full relative overflow-y-scroll max-md:hidden`}>
            {/* PROFILE */}
            <div className='pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto'>
                <img
                    src={selectedUser.profilepic || assets.avatar_icon}
                    className='w-24 rounded-full'
                    alt='avatar'
                />

                <div className='flex flex-col items-center gap-1 px-10'>
                    <h1 className='text-xl font-medium'>{selectedUser.fullname}</h1>

                    <div className='flex items-center gap-1'>
                        <span
                            className={`w-2 h-2 rounded-full ${onlineUsers.includes(selectedUser._id)
                                    ? 'bg-green-500'
                                    : 'bg-gray-500'
                                }`}
                        ></span>
                        <p className='text-[10px] text-stone-400 uppercase tracking-wider'>
                            {onlineUsers.includes(selectedUser._id) ? 'Online' : 'Offline'}
                        </p>
                    </div>
                </div>

                {selectedUser.bio && (
                    <p className='px-10 mx-auto text-center'>{selectedUser.bio}</p>
                )}
            </div>

            <hr className='border-[#ffffff50]' />

            {/* MEDIA */}
            <div className='px-5 text-xs'>
                <p className='mb-2'>Media</p>

                {messageImg.length === 0 ? (
                    <p className='text-stone-400 text-[11px]'>No media shared yet</p>
                ) : (
                    <div className='max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80'>
                        {messageImg.map((url, index) => (
                            <div
                                key={index}
                                onClick={() => window.open(url, '_blank')}
                                className='cursor-pointer rounded hover:opacity-100'
                            >
                                <img
                                    src={url}
                                    alt='media'
                                    className='h-full rounded-md'
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* LOGOUT */}
            <button
                onClick={logout}
                className='absolute bottom-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-400 to-violet-600 text-white text-sm font-light py-2 px-20 rounded-full cursor-pointer'
            >
                Logout
            </button>
        </div>
    )
}

export default RightSideBar
