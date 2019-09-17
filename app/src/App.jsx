import React, {
    Component,
    useRef,
    useEffect,
    useState,
} from 'react'

import Logo from './components/Logo/'
import MainPage from './components/MainPage/'

// Assets
import VoidstarLogo from './assets/voidstar-logo.png'
const logos = [
    VoidstarLogo
]


export default function App() {

    const logosRender = logos.map((logo, index) => {
        return <Logo key={index} src={logo} />
    })

    return (
        <div className="main">
            <div className="header">
                {logosRender}
            </div>
            <MainPage />
        </div>
    )
}
