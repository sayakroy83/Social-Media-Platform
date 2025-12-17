import { Routes, Route, useLocation } from 'react-router-dom' 
import Login from './pages/Login.jsx'
import Feed from "./pages/Feed.jsx"
import Messages from "./pages/Messages.jsx"
import ChatBox from "./pages/ChatBox.jsx"
import Connections from "./pages/Connections.jsx"
import Discover from "./pages/Discover.jsx"
import Profile from "./pages/Profile.jsx"
import CreatePost from "./pages/CreatePost.jsx"
import {useUser, useAuth} from '@clerk/clerk-react'
import Layout from "./pages/Layout.jsx"
import toast, { Toaster } from 'react-hot-toast'
import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { fetchUser } from '../features/user/userSlice.js'
import { fetchConnections } from '../features/connections/connectionSlice.js'
import { addMessage } from '../features/messages/messagesSlice.js'
import Notification from './components/Notification.jsx'

const App = () => {

  const {user} = useUser()
  const {getToken} = useAuth()
  const {pathname} = useLocation()
  const pathnameRef = useRef(pathname)

  const disPatch = useDispatch()

  useEffect(()=> {
    const fetchData = async()=> {
      if(user) {
      const token = await getToken()
      disPatch(fetchUser(token))
      disPatch(fetchConnections(token))
    }
    }
    fetchData()
    
  }, [user, getToken, disPatch])

  useEffect(()=> {
    pathnameRef.current = pathname
  },[pathname])

  useEffect(()=> {
    if(user) {
      const eventSource = new EventSource(import.meta.env.VITE_BASE_URL + '/api/message/' + user.id)

      eventSource.onmessage = (event)=> {
        const message = JSON.parse(event.data)

        if(pathnameRef.current === ('/messages/' + message.from_user_id._id)){
          disPatch(addMessage(message))
        } else {
          toast.custom((t)=> (
            <Notification t={t} message={message}/>
          ), {position: "bottom-right"})
        }
      }

      return ()=> {
        eventSource.close()
      }
    }
  },[user, disPatch])
  
  return (
    <>
    <Toaster/>
    <Routes>
      <Route path='/' element={ !user ? <Login/> : <Layout/>}>
        <Route index element={<Feed/>}/>
        <Route path='messages' element={<Messages/>}/>
        <Route path='messages/:id' element={<ChatBox/>}/>
        <Route path='connections' element={<Connections/>}/>
        <Route path='Discover' element={<Discover/>}/>
        <Route path='profile' element={<Profile/>}/>
        <Route path='profile/:profileId' element={<Profile/>}/>
        <Route path='create-post' element={<CreatePost/>}/>
      </Route>
    </Routes>
    </>
  )
}

export default App