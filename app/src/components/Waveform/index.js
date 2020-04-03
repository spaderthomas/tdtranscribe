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
    let [wavesurfer, setWavesurfer] = useState()
    let [zoom, setZoom] = useState(50)
    let waveformDivRef = useRef()
    const dispatch = useDispatch()
    const regions = useSelector(state => state.regions)
    console.log(regions)



    let floatProgressToSeconds = (totalDuration, progressAsFloat) => {
        return progressAsFloat * totalDuration
    }

    let clearWavesurferRegions = wavesurfer => {
        for (let [id, region] of Object.entries(wavesurfer.regions.list)) {
            region.remove()
        }
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
        let MyCoolVariableWavesurfer = WaveSurfer.create({
            container: waveformDivRef.current,
            waveColor: 'blue',
        })
        addKeyListeners(MyCoolVariableWavesurfer)
        addScrollListener()
        MyCoolVariableWavesurfer.on('region-created', region => {
            console.log('Region was created.')

            region.drag = false
            region.children = {}

            region.on('click', () => {
                clearWavesurferRegions(wavesurfer)
                //wavesurfer.addRegion(region)

            })

            dispatch(addRegion(region))

            let regionExists = false
            for (const region of regions) {
                console.log('hello')
            }

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
        loadTest(MyCoolVariableWavesurfer)
        MyCoolVariableWavesurfer.enableDragSelection({})

        setWavesurfer(MyCoolVariableWavesurfer)
    }, [])

    useEffect(() => {
        wavesurfer && wavesurfer.zoom(zoom)
    }, [zoom])

    return (
        <div ref={waveformDivRef} className={styles.waveform} />
    )
}