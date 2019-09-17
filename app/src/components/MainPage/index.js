import React, {
    useRef,
    useEffect,
    useState,
} from 'react'

import Waveform from '../Waveform/'
import RegionViewer from '../RegionViewer/'

import Button from '@material-ui/core/Button'

import styles from './styles.css'

export default function MainPage() {
    return (
        <div className={styles.container}>
            <RegionViewer />
            <Waveform />
        </div>
    )
}