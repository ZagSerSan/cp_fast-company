import React from 'react'
import PropTypes from 'prop-types'
import { Redirect, Route } from 'react-router-dom/cjs/react-router-dom.min'
import { useAuth } from '../../hooks/useAuth'

const ProtectedRoute = ({component: Component, children, ...rest}) => {
  const {currentUser} = useAuth()

  return (
    <Route {...rest} render={(props) => {
      if (!currentUser) {
        return <Redirect to='/login'/>
      } else {
        return Component ? <Component {...props}/> : children
      }
    }}/>
  )
}

ProtectedRoute.propTypes = {
  component: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
}

export default ProtectedRoute