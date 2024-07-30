import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'

// pages

import Home from './components/Home'
import LoginPage from './components/loginPage'

// css import 
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes>
      <Route exact path = "/login" element = {<LoginPage/>}/>
      <Route exact path = "/" element = {<Home />} />
    </Routes>
  )
}

export default App
