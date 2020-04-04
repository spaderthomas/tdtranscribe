import React, {
    useRef,
    useEffect,
    useState,
    useLayoutEffect
} from 'react'

import { useDispatch, useSelector } from "react-redux"
import { addRegion, setSelectedRegion, addToChildren, addRootRegion, moveRegion, setRegionVisibility } from '../../actions/Actions'

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
        if (!wavesurfer) return

        for (let [id, region] of Object.entries(wavesurfer.regions.list)) {
            region.remove()
        }

        for (let region of regions) {
            if (region.isVisible && !(region.id in wavesurfer.regions.list)) {
                region.suppressFire = true
                wavesurfer.regions.add(region)
            }
        }

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

        for (let [id, region] of Object.entries(wavesurfer.regions.list)) {
            region.remove()
            dispatch(setRegionVisibility(id, false))
        }
    }, [selectedRegion])

    useEffect(() => {
        if (!wavesurfer) return

        wavesurfer.zoom(zoom)

        for (let region of regions) {
            if (region.root) {
                dispatch(setRegionVisibility(region.id, true))
            }
        }

    }, [zoom])

    let onRegionCreated = region => {
        console.log('Region added to Wavesurfer: ', region.id)

        region.on('update', event => dispatch(moveRegion(region.id, region.start, region.end)))
        region.on('click', event => dispatch(setSelectedRegion(region)))
        dispatch(addRegion(region))
    }

    // utilities
    let addKeyListeners = () => {
        document.addEventListener('keydown', event => {
            switch (event.key) {
                case ' ':
                    wavesurfer.play(0, wavesurfer.getDuration())
                case 'p':
                    wavesurfer.playPause()
                case '':
                    console.log('gi')
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

    return (
        <div ref={waveformDivRef} className={styles.waveform}></div>
    )
}
