import Cookies from 'js-cookie'
import { useState } from 'react'
// Redirect component is replace with Navigate component
// useNaviage can be user to replace history.replace
import { Navigate, useNavigate } from 'react-router-dom'


import './index.css'

const URL = "https://apis.ccbp.in/login"

const LoginPage = () => {
    // state for username and password
    const [userName, setUserName] = useState("rahu")
    const [password, setPassword] = useState("rahul@2021")
    const [errorMsg, setErrorMsg] = useState("")

    // for handling onChangevalues of username and password
    const onChangeUserName = (event) => setUserName(event.target.value)
    const onChangePassword = (event) => setPassword(event.target.value)
    
    // handle success login store token for later use
    const navigate = useNavigate()
    const onSubmitSuceess = (jwtToken) => {
        Cookies.set('jwt_token', jwtToken, {
            expires: 30,
            path: '/',
          })
        navigate('/', {replace: true})
    } 
    
    // for onclick login handle

    const onLoginHandle = async (event) => {
        event.preventDefault()

        // object to send user details to verify
        const userDetails = {
            username: userName,
            password: password,
        }

        const options = {
            method: 'POST',
            body: JSON.stringify(userDetails)
        }
        
        const response = await fetch(URL, options)
        const data = await response.json()
        console.log(data)
        if (response.ok){
            onSubmitSuceess(data.jwt_token)
            setUserName("")
            setPassword("")
            setErrorMsg("")
        }else{
            setErrorMsg(data.error_msg)

        }
    } 
    


    // verify user is already logined (authenticated user)
    const jwtToken = Cookies.get('jwt_token')
    
    if (jwtToken !== undefined){
        return <Navigate to ="/" />
    }

    console.log(userName, password)

    return (
        <div className="login-page-background">
            <div className='login-card'>
                <img className='spotify-remix-logo' src = "https://res.cloudinary.com/davv8r8v4/image/upload/v1722322776/spoyifyRemix/encjbygxlrdyup0junkv.png"/>
                <form onSubmit={onLoginHandle}>
                    <label>USERNAME</label>
                    <input type = "text" value={userName} onChange={onChangeUserName}/>
                    <br />
                    <label>PASSWORD</label>
                    <input type = "password" value={password} onChange={onChangePassword}/>
                    <button type = "submit" >Login</button>
                </form>
                <p>{errorMsg}</p>
            </div>
        </div>
    ) 
}


export default LoginPage