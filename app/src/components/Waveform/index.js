import React, {
    useRef,
    useEffect,
    useState,
} from 'react'

import { WaveSurfer } from './wavesurfer'

import Kovo from '../../assets/kovo.wav'

import styles from './styles.css'

export default function Waveform() {
    let [wavesurfer, setWavesurfer] = useState()


    // Initialization
    let waveformDivRef = useRef()
    useEffect(() => {
        setWavesurfer(WaveSurfer.create({
            container: waveformDivRef.current,
            waveColor: 'blue',
        }))
    }, [])

    // Attach key listeners
    const [keyListenerAdded, setKeyListenerAdded] = useState(false)
    useEffect(() => {
        if (wavesurfer && !keyListenerAdded) {
            console.log('Attached key listeners to Waveform');
            document.addEventListener('keydown', event => {
                if (event.key === ' ') {
                    console.log("play");
                    wavesurfer.play(0, wavesurfer.getDuration())
                }
                else if (event.key === 'p') {
                    console.log("play[ause");
                    wavesurfer.playPause()
                }
            })

            setKeyListenerAdded(true)
        }
    }, [wavesurfer])

    // Loading up a test file
    useEffect(() => {
        if (wavesurfer) {
            wavesurfer.load(Kovo)
            wavesurfer.enableDragSelection({})
        }
    }, [wavesurfer])





    return (
        <div ref={waveformDivRef} className={styles.waveform} />
    )
}