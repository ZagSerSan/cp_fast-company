import React, { useContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import userService from '../service/users.service'
import axios from 'axios'
import {setTokens} from '../service/localStorage.service'

const httpAuth = axios.create()
const AuthContext = React.createContext()
export const useAuth = () => {
  return useContext(AuthContext)
}

const AuthProvider = ({children}) => {
  const [currentUser, setCurrentUser] = useState({})
  const [error, setError] = useState(null)

  async function signIn({email, password}) {
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.REACT_APP_FIREBASE_KEY}`
    try {
      const {data} = await httpAuth.post(url, {email, password, returnSecureToken: true})
      setTokens(data)
      toast.info('Logging is successful!')
      console.log(data)
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }
  async function signUp({email, password, ...rest}) {
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.REACT_APP_FIREBASE_KEY}`

    try {
      const {data} = await httpAuth.post(url, {email, password, returnSecureToken: true})
      setTokens(data)
      await createUser({_id: data.localId, email, ...rest})
      console.log(data)
    } catch (error) {
      errorCatcher(error)
      const {code, message} = error.response.data.error
      if (code === 400) {
        if (message === 'EMAIL_EXISTS') {
          const errorObject = {
            email: 'Пользователь с таким email уже существует.'
          }
          throw errorObject
        }
      }
    }
  }
  async function createUser(data) {
    try {
      const {content} = userService.create(data)
      setCurrentUser(content)
    } catch (error) {
      errorCatcher(error)
    }
  }
  useEffect(() => {
    if (error !== null) {
      toast.error(error)
      setError(null)
    }
  }, [error])
  const errorCatcher = (error) => {
    const { message } = error.response.data
    setError(message)
  }

  return (
    <AuthContext.Provider value={{signUp, signIn, currentUser}}>
      {children}
    </AuthContext.Provider>
  )
}

AuthProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
}

export default AuthProvider
