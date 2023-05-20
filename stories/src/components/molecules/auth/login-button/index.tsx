import React from "react"
import { useAuth0 } from "@auth0/auth0-react"
import { Button, buttonClassesHollow } from "../../../atoms/button"

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0()

  return <Button action={() => loginWithRedirect()} label="Continue" className={buttonClassesHollow}></Button>
}

export default LoginButton
