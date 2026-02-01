import React, { useContext, useState, useEffect } from 'react'
import assets from "../assets/assets"
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { ChatContext } from '../../context/ChatContext'

const SideBar = () => {
    const {
        getUsers,
        users,
        selectedUser,
        setSelectedUser,
        unseenMessages,
        setUnseenMessages
    } = useContext(ChatContext)

    const { logout, onlineUsers } = useContext(AuthContext)

    const [input, setInput] = useState('')
    const navigate = useNavigate()

    const filteredUsers = input
        ? users.filter(user =>
            user.fullname.toLowerCase().includes(input.toLowerCase())
        )
        : users

    useEffect(() => {
        getUsers()
    }, [onlineUsers])

    return (
        <div className={`bg-[#8185b2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white
      ${selectedUser ? 'max-md:hidden' : ''}`}>

            {/* HEADER */}
            <div className='pb-5'>
                <div className='flex items-center justify-between'>
                    <img src={assets.logo} className='max-w-40' alt="logo" />

                    <div className='relative py-2 group'>
                        <img src={assets.menu_icon} className='max-h-5 cursor-pointer' alt="menu" />
                        <div className='absolute top-full right-0 z-20 w-32 p-5 rounded-md
              bg-[#282142] border border-gray-600 hidden group-hover:block'>
                            <p onClick={() => navigate('/profile')} className='cursor-pointer text-sm'>
                                Edit Profile
                            </p>
                            <hr className='my-2 border-gray-500' />
                            <p onClick={logout} className='cursor-pointer text-sm'>Logout</p>
                        </div>
                    </div>
                </div>

                {/* SEARCH */}
                <div className='bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5'>
                    <img src={assets.search_icon} className='w-3' alt="search" />
                    <input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        type="text"
                        placeholder="Search Users..."
                        className="bg-transparent outline-none text-white text-xs flex-1"
                    />
                </div>
            </div>

            {/* USERS LIST */}
            <div className='flex flex-col'>
                {filteredUsers.map(user => (
                    <div
                        key={user._id}
                        onClick={() => {
                            setSelectedUser(user)
                            setUnseenMessages(prev => ({ ...prev, [user._id]: 0 }))
                        }}
                        className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer
              ${selectedUser?._id === user._id && 'bg-[#282142]/50'}`}
                    >
                        <img
                            src={user.profilepic || assets.avatar_icon}
                            className='w-[35px] rounded-full'
                            alt="user"
                        />

                        <div className='flex flex-col'>
                            <p>{user.fullname}</p>
                            <span className={`text-xs ${onlineUsers.includes(user._id) ? 'text-green-400' : 'text-neutral-400'
                                }`}>
                                {onlineUsers.includes(user._id) ? 'Online' : 'Offline'}
                            </span>
                        </div>

                        {unseenMessages?.[user._id] > 0 && (
                            <p className="absolute top-4 right-4 text-xs h-5 w-5 flex items-center
                justify-center rounded-full bg-violet-500/50">
                                {unseenMessages[user._id]}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SideBar
