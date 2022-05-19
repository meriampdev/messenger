import { useEffect, useContext } from "react"
import { Navigate } from 'react-router-dom';
import { MessengerContext } from "context/messenger"

export const ProtectedRoute = ({ children }) => {
  const messenger = useContext(MessengerContext)
  let user = localStorage.getItem('loginData')

  useEffect(() => {
    if(!!user) {
      messenger.setCurrentUser(JSON.parse(user))
    }
  // eslint-disable-next-line
  }, [])

  if (!user) {
    return <Navigate to="/" replace />;
  } 

  return children;
};