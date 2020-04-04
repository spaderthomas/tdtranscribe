import React, {
    useRef,
    useEffect,
    useState,
    useLayoutEffect
} from 'react'

import { useDispatch, useSelector } from "react-redux"
import { addRegion, setSelectedRegion, addToChildren, addRootRegion, updateRegion } from '../../actions/Actions'

import { randomInt, randomRGBA } from '../../Utils'

import { WaveSurfer } from './wavesurfer'

import Kovo from '../../assets/kovo.wav'

import styles from './styles.css'

export default function Waveform() {
    const [zoom, setZoom] = useState(0)
    const [width, setWidth] = useState(width);
    const [initialized, setInitialized] = useState(false)
    const [wavesurfer, setWavesurfer] = useState()
    const waveformDivRef = useRef()
    const dispatch = useDispatch()
    const selectedRegion = useSelector(state => state.selectedRegion)
    const regions = useSelector(state => state.regions)

    useEffect(() => {
        for (let region of regions) {
            region.updateRender()
        }
    }, [regions])

    useEffect(() => {
        if (!selectedRegion) return

        let seconds = selectedRegion.end - selectedRegion.start
        let center = (selectedRegion.end + selectedRegion.start) / 2
        let floatCenter = center / wavesurfer.getDuration()

        wavesurfer.seekTo(floatCenter)
        setZoom(width / seconds)
        clearWavesurferRegions()
    }, [selectedRegion])

    let onRegionCreated = region => {
        console.log('Region added to Wavesurfer: ', region.id)

        region.children = []

        region.on('update', event => dispatch(updateRegion(region.id, region.start,region.end)))
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

    useEffect(() => {
        setWavesurfer(WaveSurfer.create({
            container: waveformDivRef.current,
            waveColor: 'blue'
        }))
    }, [])

    useEffect(() => {
        if (!wavesurfer) return

        addKeyListeners()
        addScrollListener()
        wavesurfer.load(Kovo)

        wavesurfer.enableDragSelection({})

        wavesurfer.on('play', progress => {
            wavesurfer.drawer.recenter(progress)
        })
        wavesurfer.on('region-created', onRegionCreated)
    }, [wavesurfer])

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

    useEffect(() => {
        if (!wavesurfer) return

        wavesurfer.zoom(zoom)

        for (let region of regions) {
            if (region.root && !(region.id in wavesurfer.regions.list)) {
                wavesurfer.regions.add(region)
            }
        }
    }, [zoom])

    return (
        <div ref={waveformDivRef} className={styles.waveform} />
    )
}
