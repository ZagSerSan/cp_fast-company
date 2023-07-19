import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import userService from '../service/users.service'
import IconSVG from '../components/common/iconSVG'

const UserContext = React.createContext()

export const useUsers = () => {
  return useContext(UserContext)
}

const UserProvider = ({children}) => {
  const [users, setUsers] = useState([])
  const [isLoading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // вызов getUsers() при монтировании компонента
  useEffect(() => {
    getUsers()
  }, [])
  // обработка/показ ошибки пользователю
  useEffect(() => {
    if (error !== null) {
      toast.error(error)
      setError(null)
    }
  }, [error])
  async function getUsers() {
    try {
      const {content} = await userService.get()
      setUsers(content)
      setLoading(false)
    } catch (error) {
      errorCatcher(error)
    }
  }
  async function getUser() {
    try {
      const {content} = await userService.getUserById()
      console.log(content)
      return content
    } catch (error) {
      console.log(error)
      // errorCatcher(error)
    }
  }
  const errorCatcher = (error) => {
    const {message} = error.response.data
    setError(message)
  }

  return (
    <UserContext.Provider value={{users}}>
      {!isLoading ? children : <IconSVG id='loader'/>}
    </UserContext.Provider>
  )
}

UserProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
}

export default UserProvider
