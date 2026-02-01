import React, { useContext, useRef, useState, useEffect } from 'react'
import assets from '../assets/assets'
import { formatMessageTime } from '../lib/utils'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const ChatContainer = () => {
    const { messages, selectedUser, setSelectedUser, sendMessage, getMessages } = useContext(ChatContext)
    const { authUser, onlineUsers } = useContext(AuthContext)

    const [input, setInput] = useState('')
    const scrollEnd = useRef(null)

    // handle send text message
    const handleSendMessage = async (e) => {
        e.preventDefault()
        if (input.trim() === '') return
        await sendMessage({ text: input.trim() })
        setInput('')
    }

    // handle image send
    const handleSendImage = async (e) => {
        const file = e.target.files[0]
        if (!file || !file.type.startsWith('image/')) {
            toast.error('Please select an image')
            return
        }

        const reader = new FileReader()
        reader.onloadend = async () => {
            await sendMessage({ image: reader.result })
            e.target.value = ''
        }
        reader.readAsDataURL(file)
    }

    // get messages when selected user changes
    useEffect(() => {
        if (selectedUser) {
            getMessages(selectedUser._id)
        }
    }, [selectedUser])

    // scroll to bottom on new message
    useEffect(() => {
        if (scrollEnd.current && messages) {
            scrollEnd.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages])

    return selectedUser ? (
        <div className='h-full overflow-scroll relative backdrop-blur-lg'>

            {/* HEADER */}
            <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-500'>
                <img
                    src={selectedUser.profilepic || assets.avatar_icon}
                    className='w-8 rounded-full'
                    alt="user"
                />

                <div className='flex-1'>
                    <p className='text-lg text-white'>{selectedUser.fullname}</p>
                    <p className='text-xs text-stone-400'>
                        {onlineUsers.includes(selectedUser._id) ? 'Online' : 'Offline'}
                    </p>
                </div>

                <img
                    onClick={() => setSelectedUser(null)}
                    src={assets.arrow_icon}
                    className='md:hidden max-w-7 cursor-pointer'
                    alt="back"
                />

                <img
                    src={assets.help_icon}
                    className='max-md:hidden max-w-5'
                    alt="help"
                />
            </div>

            {/* CHAT AREA */}
            <div className='flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6'>
                {messages?.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex items-end gap-2 ${msg.senderId === authUser?._id
                                ? 'justify-end'
                                : 'flex-row-reverse justify-end'
                            }`}
                    >
                        {msg.image ? (
                            <img
                                src={msg.image}
                                alt="message"
                                className='max-w-[230px] border border-gray-700 rounded-lg mb-8'
                            />
                        ) : (
                            <p
                                className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white ${msg.senderId === authUser?._id
                                        ? 'rounded-bl-none'
                                        : 'rounded-br-none'
                                    }`}
                            >
                                {msg.text}
                            </p>
                        )}

                        <div className='text-center text-xs'>
                            <img
                                src={
                                    msg.senderId === authUser?._id
                                        ? authUser?.profilepic || assets.avatar_icon
                                        : selectedUser?.profilepic || assets.avatar_icon
                                }
                                className='w-7 rounded-full'
                                alt="avatar"
                            />
                            <p className='text-gray-500'>
                                {formatMessageTime(msg.createdAt)}
                            </p>
                        </div>
                    </div>
                ))}
                <div ref={scrollEnd}></div>
            </div>

            {/* INPUT AREA */}
            <div className='absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3'>
                <div className='flex-1 flex items-center bg-gray-100/12 px-3 rounded-full'>
                    <input
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(e)}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        type='text'
                        placeholder='Send a message'
                        className='flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder:text-gray-400'
                    />

                    <input
                        onChange={handleSendImage}
                        type='file'
                        id='image'
                        accept='image/png, image/jpeg'
                        hidden
                    />
                    <label htmlFor='image'>
                        <img
                            src={assets.gallery_icon}
                            className='w-5 mr-2 cursor-pointer'
                            alt='attach'
                        />
                    </label>
                </div>

                <img
                    onClick={handleSendMessage}
                    src={assets.send_button}
                    className='w-7 cursor-pointer'
                    alt='send'
                />
            </div>
        </div>
    ) : (
        <div className='flex flex-col items-center justify-center gap-2 text-gray-500 h-full'>
            <img
                src={assets.logo_icon}
                className='max-md:hidden max-w-20'
                alt='logo'
            />
            <p className='text-lg font-medium text-white'>
                Chat anytime, anywhere
            </p>
        </div>
    )
}

export default ChatContainer
