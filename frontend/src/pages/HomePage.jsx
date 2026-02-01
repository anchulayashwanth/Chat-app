import React, { useContext } from 'react'
import SideBar from '../components/SideBar'
import ChatContainer from '../components/ChatContainer'
import RightSideBar from '../components/RightSideBar'
import { ChatContext } from '../../context/ChatContext'

const HomePage = () => {
    const { selectedUser } = useContext(ChatContext)

    // Grid layout based on user selection
    const gridClass = selectedUser
        ? 'md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]'
        : 'md:grid-cols-2'

    return (
        <div className="w-full h-screen sm:px-[15%] sm:py-[5%]">
            <div
                className={`h-full grid grid-cols-1 ${gridClass}
        backdrop-blur-xl border-2 border-gray-600 rounded-2xl overflow-hidden`}
            >
                {/* LEFT SIDEBAR */}
                <SideBar />

                {/* CHAT AREA */}
                <ChatContainer />

                {/* RIGHT SIDEBAR (opens ONLY when user selected) */}
                <RightSideBar />
            </div>
        </div>
    )
}

export default HomePage
