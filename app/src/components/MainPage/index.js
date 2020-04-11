import React, {
    useRef,
    useEffect,
    useState,
} from 'react'

import Waveform from '../Waveform/'
import RegionViewer from '../RegionViewer/'
import SpeedSlider from '../SpeedSlider/'

import styles from './styles.css'

export default function MainPage() {
    return (
        <div className={styles.content}>
            <div className={styles.waveformAndSlider}>
                <div className={styles.waveformContainer}>
                    <Waveform />
                </div>
                <div className={styles.sliderContainer}>
                    <SpeedSlider />
                </div>
            </div>

            <RegionViewer />
        </div>
    )
}