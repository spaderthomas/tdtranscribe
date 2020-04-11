import React, {
    useRef,
    useEffect,
    useState,
    useLayoutEffect
} from 'react'

import {
    useDispatch,
    useSelector
} from 'react-redux'

import {
    addRegion,
    setSelectedRegion,
    moveRegion,
    setRegionVisibility,
    showRootRegions,
    removeRegion,
    initWavesurfer
} from '../../actions/Actions'

import {
    useEventListener,
    useRegionListener,
    snapEpsilon,
    removeWavesurferRegion
} from '../../Utils'


import Kovo from '../../assets/kovo.wav'

import Slider from '@material-ui/core/Slider'

import styles from './styles.css'

export default function Waveform() {
    const [zoom, setZoom] = useState(0)
    const [width, setWidth] = useState(width);
    const [initialized, setInitialized] = useState(false)
    const waveformDivRef = useRef()
    
    const dispatch = useDispatch()
    
    const wavesurfer = useSelector(state => state.wavesurfer)
    const selectedRegion = useSelector(state => state.selectedRegion)
    const regions = useSelector(state => state.regions)

    const [dragging, setDragging] = useState(false)
    const [draggingRegion, setDraggingRegion] = useState()
    const [pxMove, setPxMove] = useState()
    const [slop, setSlop] = useState()
    const [dragStart, setDragStart] = useState()

    let onRegionClick = region => {
        dispatch(setSelectedRegion(region.id))
    }

    let onRegionMove = region => {
        dispatch(moveRegion(region.id, region.start, region.end))
    }

    let setRegionCallbacks = region => {
        region.on('update', event => onRegionMove(region))
        region.on('click', event => onRegionClick(region))
    }

    let onRegionCreated = region => {
        setRegionCallbacks(region)
        dispatch(addRegion(region))
    }

    useEffect(() => {
        if (!wavesurfer) return

        for (let region of regions) {
            if (!region.isVisible) {
                removeWavesurferRegion(wavesurfer, region.id)
            }
            if (region.isVisible && !(region.id in wavesurfer.regions.list)) {
                region.suppressFire = true
                let wsRegion = wavesurfer.regions.add(region)
                setRegionCallbacks(wsRegion)
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
    }, [selectedRegion])

    useEffect(() => {
        if (!wavesurfer) return

        wavesurfer.zoom(zoom)
    }, [zoom])

    // utilities
    let onSpace = event => {
        if (event.key != ' ') return
        wavesurfer.play(0, wavesurfer.getDuration())
    }
    let onP = event => {
        if (event.key != 'p') return
        wavesurfer.playPause()
    }
    let onEscape = event => {
        if (event.key != 'Escape') return
        if (!draggingRegion) return

        dispatch(removeRegion(draggingRegion.id))
        removeWavesurferRegion(wavesurfer, draggingRegion.id)

        setDragging(false)
        setDraggingRegion(null)
        setDragStart(-1)
    }

    useEventListener('keydown', onSpace)
    useEventListener('keydown', onP)
    useEventListener('keydown', onEscape)


    let onWavesurferBeginDrag = event => {
        if (event.touches && event.touches.length > 1) { return }

        // Check whether the click/tap is on the bottom-most DOM element
        // Effectively prevent clicks on the scrollbar from registering as
        // region creation.
        if (event.target.childElementCount > 0) { return }

        setDragStart(wavesurfer.drawer.handleEvent(event, true))
        setDragging(true)
    };
    useRegionListener('mousedown', onWavesurferBeginDrag, wavesurfer)

    let onWavesurferEndDrag = (e) => {
        setDragging(false)
        setPxMove(0)

        if (!draggingRegion) { return }


        // Snap the region to the start/end if it's close enough
        let start = draggingRegion.start
        let end = draggingRegion.end
        if (start <= snapEpsilon) {
            start = 0
        }
        if (wavesurfer.getDuration() - end <= snapEpsilon) {
            end = wavesurfer.getDuration()
        }

        draggingRegion.update({
            start: start,
            end: end
        })
        draggingRegion.fireEvent('update-end', e);
        wavesurfer.fireEvent('region-update-end', draggingRegion, e);

        setDraggingRegion(null)
    };
    useRegionListener('mouseleave', onWavesurferEndDrag, wavesurfer)
    useRegionListener('mouseup', onWavesurferEndDrag, wavesurfer)

    let onMoveMouse = e => {
        if (!dragging) { return; }

        let region = draggingRegion
        if (!region) { 
            region = wavesurfer.regions.add()
            setDraggingRegion(region)
        }

        if (pxMove + 1 <= slop) {
            setPxMove(pxMove + 1)
            return;
        }

        let duration = wavesurfer.getDuration()
        let position = wavesurfer.drawer.handleEvent(e)
        region.update({
            start: Math.min(position * duration, dragStart * duration),
            end: Math.max(position * duration, dragStart * duration)
        });
    };
    useRegionListener('mousemove', onMoveMouse, wavesurfer)

    let addScrollListener = () => {
        waveformDivRef.current.addEventListener('wheel', async (event) => {
            var scaled = event.deltaY / 50
            setZoom(zoom => Math.max(zoom - scaled, 0))

            dispatch(showRootRegions())
            dispatch(setSelectedRegion(-1))
        })
    }

    useEffect(() => {
        dispatch(initWavesurfer(waveformDivRef.current))
    }, [])

    useEffect(() => {
        if (!wavesurfer) return

        addScrollListener()
        wavesurfer.load(Kovo)

        wavesurfer.initRegions()

        wavesurfer.on('play', progress => {
            wavesurfer.drawer.recenter(progress)
        })
        wavesurfer.on('region-created', onRegionCreated)

        setInitialized(true)
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


