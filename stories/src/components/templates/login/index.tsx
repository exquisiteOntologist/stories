// import { useAuth0 } from '@auth0/auth0-react'
import * as React from 'react'
// import Helmet from 'react-helmet'
import LoginButton from '../../molecules/auth/login-button'

const LoginView: React.FC = () => {
    // const { isLoading } = useAuth0()
    const isLoading = false

    return (
        <>
            {/* <Helmet>
                <title>Login | Semblance</title>
            </Helmet> */}
            {
                !isLoading && (
                    <div className="collection w-full max-w-7xl mx-4 h-min-content text-lg">
                        <h1 className='text-4xl font-semibold mb-24'>you were?</h1>
                        <div className="text-lg">
                            <p className="text-md mb-8">Sorry, we have no clue who you are. Before continuing, first login or sign-up.<br></br> Once we know, we can provide you your collections, search, and narrative.</p>
                            <LoginButton />
                        </div>
                    </div>
                )
            }
        </>
    )
}

/* <div className="my-4">
    <label className="block" htmlFor="username">Username</label>
    <input className="block border rounded-md px-4 py-2" type="text" name="username" id="username" />
</div>
<div className="my-4">
    <label className="block" htmlFor="password">Password</label>
    <input className="block border rounded-md px-4 py-2" type="text" name="password" id="password" />
</div>
<Button label="Login" /> */

/* <div className="mt-12">
    <h3 className="text-xl font-semibold mb-2">No account yet?</h3>
    <Button label="Sign Up" linkTo="/sign-up" />
</div> */

/* <div className="mt-8">
    <p className="text-md mb-8 text-orange-700">You are {isAuthenticated ? '' : 'not '}authenticated</p>
</div> */

export default LoginView
