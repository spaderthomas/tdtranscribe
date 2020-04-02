import React, {
    Component,
    useRef,
    useEffect,
    useState,
} from 'react'

import { Provider } from 'react-redux'
import { store } from './Store'

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
        <Provider store={store}>
            <div className="main">
                <div className="header">
                    {logosRender}
                </div>
                <MainPage />
            </div>
        </Provider>
    )
}
