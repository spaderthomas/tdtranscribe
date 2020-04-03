import React, {
    useRef,
    useEffect,
    useState,
} from 'react'

import { useDispatch, useSelector } from "react-redux"
import { addRegion } from '../../actions/Actions'

import { WaveSurfer } from './wavesurfer'

import Kovo from '../../assets/kovo.wav'

import styles from './styles.css'


export default function Waveform() {
    let [zoom, setZoom] = useState(50)
    let waveformDivRef = useRef()

    const dispatch = useDispatch()
    const regions = useSelector(state => state.regions)

    let floatProgressToSeconds = (totalDuration, progressAsFloat) => {
        return progressAsFloat * totalDuration
    }

    let [wavesurfer, setWavesurfer] = useState(null)
    console.log("wavesurfer is: ")
    console.log(wavesurfer)

    let variable = "valid!"
    let reference = {
        dog: true,
        saucer: true
    }
    let clearWavesurferRegions = () => {
        console.log(wavesurfer)
        console.log(variable)
        console.log(reference)
        // for (let [id, region] of Object.entries(wavesurfer.regions.list)) {
        //     region.remove()
        // }
    }

    let addKeyListeners = wavesurfer => {
        document.addEventListener('keydown', event => {
            if (event.key === ' ') {
                wavesurfer.play(0, wavesurfer.getDuration())
            }
            else if (event.key === 'p') {
                wavesurfer.playPause()
            }
        })
    }

    let addScrollListener = () => {
        waveformDivRef.current.addEventListener('wheel', async (event) => {
            var scaled = event.deltaY / 50
            setZoom(zoom => Math.max(zoom - scaled, 0))
        })
    }

    let loadTest = wavesurfer => {
        wavesurfer.load(Kovo)
    }

    let addRegionAddedListener = wavesurfer => {
    }

    // Initialization
    useEffect(() => {
        setWavesurfer(WaveSurfer.create({
            container: waveformDivRef.current,
            waveColor: 'blue',
        }))
    }, [])

    useEffect(() => {
        if (!wavesurfer) return

        addKeyListeners(wavesurfer)

        addScrollListener()

        loadTest(wavesurfer)
        wavesurfer.enableDragSelection({})

        wavesurfer.on('region-created', region => {
            console.log('Region was created.')

            region.drag = false
            region.children = [{
                start: 10,
                end: 12,
                children: []
            }]

            region.on('click', () => {
                console.log(wavesurfer)
                clearWavesurferRegions()
            })

            dispatch(addRegion(region))

            // for (let [id, child] in Object.entries(regions)) {
            //     if (id === region.id) {
            //         regionExists = true
            //         break
            //     }
            // }
            // if (!regionExists) {
            //     setRegions(regions => {
            //         let newRegions = {
            //             ...regions,
            //             [region.id]: region
            //         }

            //         return newRegions
            //     })
            // }

        })
    }, [wavesurfer])

    useEffect(() => {
        wavesurfer && wavesurfer.zoom(zoom)
    }, [zoom])

    return (
        <div ref={waveformDivRef} className={styles.waveform} />
    )
}