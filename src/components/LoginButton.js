import React from 'react'
import { useAuth0 } from '@auth0/auth0-react';

const LoginButton = () => {
    const { loginWithRedirect } = useAuth0();

    const handleLogin = () => {
      loginWithRedirect({
        redirect_uri: 'http://localhost:3000/callback',
        connection: 'facebook' // Specify the Facebook connection
      });
    };

  return (
    <button onClick={handleLogin}>
      Continue with Facebook
    </button>
  )
}

export default LoginButton
