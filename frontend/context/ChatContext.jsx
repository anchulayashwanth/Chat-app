import { createContext, useContext, useState, useEffect } from "react"
import { AuthContext } from "./AuthContext"
import toast from "react-hot-toast"

export const ChatContext = createContext(null)

const ChatProvider = ({ children }) => {
    const [messages, setMessages] = useState([])
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [unseenMessages, setUnseenMessages] = useState({})

    const { socket, axios, authUser } = useContext(AuthContext)

    /* ================= GET USERS ================= */
    const getUsers = async () => {
        try {
            const { data } = await axios.get("/api/messages/users")
            if (data.success) {
                setUsers(data.users || [])
                setUnseenMessages(data.unseenMessages || {})
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    /* ================= GET MESSAGES ================= */
    const getMessages = async (userId) => {
        if (!userId) return
        try {
            const { data } = await axios.get(`/api/messages/${userId}`)
            if (data.success) {
                setMessages(data.messages || [])
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    /* ================= SEND MESSAGE ================= */
    const sendMessage = async (messageData) => {
        if (!selectedUser) return

        try {
            const { data } = await axios.post(
                `/api/messages/send/${selectedUser._id}`,
                messageData
            )

            if (data.success) {
                setMessages(prev => [...prev, data.newMessage])
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    /* ================= SOCKET LISTENER ================= */
    useEffect(() => {
        if (!socket || !authUser) return

        const handleNewMessage = (newMessage) => {
            // If chat is open with sender
            if (selectedUser && newMessage.senderId === selectedUser._id) {
                newMessage.seen = true
                setMessages(prev => [...prev, newMessage])
                axios.put(`/api/messages/mark/${newMessage._id}`)
            } else {
                setUnseenMessages(prev => ({
                    ...prev,
                    [newMessage.senderId]: (prev[newMessage.senderId] || 0) + 1
                }))
            }
        }

        socket.on("newMessage", handleNewMessage)

        return () => {
            socket.off("newMessage", handleNewMessage)
        }
    }, [socket, selectedUser, authUser])

    /* ================= CLEAR UNSEEN WHEN OPEN CHAT ================= */
    useEffect(() => {
        if (selectedUser) {
            setUnseenMessages(prev => ({
                ...prev,
                [selectedUser._id]: 0
            }))
        }
    }, [selectedUser])

    return (
        <ChatContext.Provider
            value={{
                messages,
                users,
                selectedUser,
                unseenMessages,
                getUsers,
                getMessages,
                sendMessage,
                setMessages,
                setSelectedUser,
                setUnseenMessages
            }}
        >
            {children}
        </ChatContext.Provider>
    )
}

export default ChatProvider
