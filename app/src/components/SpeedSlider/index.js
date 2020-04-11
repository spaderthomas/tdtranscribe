import Slider from '@material-ui/core/Slider'

import React, {
    useState
} from 'react'

import { useSelector } from 'react-redux'

import styles from './styles.css'

export default function SpeedSlider() {
    const [value, setValue] = useState(100)
    const wavesurfer = useSelector(state => state.wavesurfer)

    let onChange = (event, next) => {
        setValue(next)
        wavesurfer.setPlaybackRate(next / 100)
    }

    return (
        <div className={styles.slider}>
            <Slider value={value} onChange={onChange} className={styles.slider}></Slider>
        </div>
    )
}