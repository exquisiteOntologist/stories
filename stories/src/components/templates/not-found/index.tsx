import * as React from 'react'
import { Redirect } from "@reach/router"

const NotFound = () => (
    <div>
        <h1>Not Found</h1>
        <Redirect to="/app" />
    </div>
)

export default NotFound
