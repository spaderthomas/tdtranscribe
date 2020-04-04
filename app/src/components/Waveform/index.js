import React, {
    useRef,
    useEffect,
    useState,
    useLayoutEffect
} from 'react'

import { useDispatch, useSelector } from "react-redux"
import { addRegion, setSelectedRegion } from '../../actions/Actions'

import { WaveSurfer } from './wavesurfer'

import Kovo from '../../assets/kovo.wav'

import styles from './styles.css'



export default function Waveform() {
    let [zoom, setZoom] = useState(50)
    const [width, setWidth] = useState(width);
    const [initialized, setInitialized] = useState(false)
    let [wavesurfer, setWavesurfer] = useState()
    let waveformDivRef = useRef()
    const dispatch = useDispatch()
    const selectedRegion = useSelector(state => state.selectedRegion)

    useEffect(() => {
        if (!selectedRegion) return
        let seconds = selectedRegion.end - selectedRegion.start
        console.log(selectedRegion)
        let center = (selectedRegion.end + selectedRegion.start) / 2
        let floatCenter = center / wavesurfer.getDuration()

        wavesurfer.seekTo(floatCenter) 
        setZoom(width / seconds)
        clearWavesurferRegions()
    }, [selectedRegion])

    useLayoutEffect(() => {
        if (waveformDivRef.current) {
          setWidth(waveformDivRef.current.offsetWidth);
        }
      }, []);

    let clearWavesurferRegions = () => {
        for (let [id, region] of Object.entries(wavesurfer.regions.list)) {
            region.remove()
        }
    }

    let onRegionCreated = region => {
        console.log('Region was created.')

        region.drag = false
        region.children = []

        region.on('click', event => dispatch(setSelectedRegion(region)))
        dispatch(addRegion(region))
    }

    // utilities
    let addKeyListeners = () => {
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

    let setupWavesurfer = () => {
        if (!wavesurfer) return

        addKeyListeners()
        addScrollListener()
        wavesurfer.load(Kovo)

        wavesurfer.enableDragSelection({})

        wavesurfer.on('seek', progress => {
            wavesurfer.drawer.recenter(progress)
        })

        wavesurfer.on('region-created', onRegionCreated)
    }

    useEffect(() => {
        setWavesurfer(WaveSurfer.create({
            container: waveformDivRef.current,
            waveColor: 'blue'
        }))
    }, [])

    if (!initialized && wavesurfer) {
        console.log('calling the dumb callback')
        setupWavesurfer()
        setInitialized(true)
    }

    useEffect(() => {
        wavesurfer && wavesurfer.zoom(zoom)
    }, [zoom])

    return (
        <div ref={waveformDivRef} className={styles.waveform} />
    )
}

const MyComponent = (props) => {
    [something, setSomething] = useSelector() // Will receive whatever's in the Redux store

    console.log(something) // Prints the new value from the redux store
    let callback = () => {
        console.log(something) // ALWAYS PRINTS THE INITIAL VALUE DEAR GOD WHY
    }

    some_shit.on('click', callback)
}

// ... elsewhere

