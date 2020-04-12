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
    setParentRegion,
    moveRegion,
    setRegionVisibility,
    removeRegion,
    initWavesurfer,
    setRegionSelected
} from '../../actions/Actions'

import {
    useEventListener,
    useRegionListener,
    snapEpsilon,
    removeWavesurferRegion,
    findRegion
} from '../../Utils'


import Kovo from '../../assets/kovo.wav'

import Slider from '@material-ui/core/Slider'

import styles from './styles.css'

export default function Waveform() {
    const [zoom, setZoom] = useState(0)
    const [width, setWidth] = useState(width);
    const waveformDivRef = useRef()

    const dispatch = useDispatch()

    const wavesurfer = useSelector(state => state.wavesurfer)
    const parentRegion = useSelector(state => state.parentRegion)
    const regions = useSelector(state => state.regions)

    const [dragging, setDragging] = useState(false)
    const [draggingRegion, setDraggingRegion] = useState()
    const [pxMove, setPxMove] = useState()
    const [slop, setSlop] = useState()
    const [dragStart, setDragStart] = useState()

    useEffect(() => {
        if (!wavesurfer) return

        console.log('parent region hook:', parentRegion)
        if (!parentRegion) {
            for (let region of regions) {
                if (!region.parent) {
                    dispatch(setRegionVisibility(region.id, true))
                } else {
                    dispatch(setRegionVisibility(region.id, false))
                    dispatch(setRegionSelected(region.id, false))
                }
            }

            wavesurfer.zoom(0)
            setZoom(0)
            return
        }

        // Make everything invisible
        for (let region of regions) {
            dispatch(setRegionVisibility(region.id, false))
            dispatch(setRegionSelected(region.id, false))
        }

        // Make all the children of this region visible
        for (let child of parentRegion.children) {
            dispatch(setRegionVisibility(child.id, true))
        }

        // If it has children, default the first one to be selected
        if (parentRegion.children.length > 0) {
            let firstChild = parentRegion.children[0]
            dispatch(setRegionSelected(firstChild.id, true))
        }

        let newZoom = wavesurfer.zoomOnRegion(parentRegion, width)
        setZoom(newZoom)
    }, [parentRegion])

    let onRegionClick = wsRegion => {
        let region = findRegion(regions, wsRegion.id)

        // Seek to the beginning and zoom in
        let floatStart = region.start / wavesurfer.getDuration()
        wavesurfer.seekTo(floatStart)

        let newZoom = wavesurfer.zoomOnRegion(region, width)
        setZoom(newZoom)

        dispatch(setParentRegion(region.id))
    }

    let onRegionMove = wsRegion => {
        dispatch(moveRegion(wsRegion.id, wsRegion.start, wsRegion.end))
    }

    let setRegionCallbacks = wsRegion => {
        wsRegion.on('update', event => onRegionMove(wsRegion))
        wsRegion.on('click', event => onRegionClick(wsRegion))
    }

    let onRegionCreated = wsRegion => {
        setRegionCallbacks(wsRegion)
        dispatch(addRegion(wsRegion))
    }

    useEffect(() => {
        if (!wavesurfer) return

        for (let region of regions) {
            removeWavesurferRegion(wavesurfer, region.id)

            if (region.isVisible) {
                region.suppressFire = true
                let wsRegion = wavesurfer.regions.add(region)
                setRegionCallbacks(wsRegion)
            }
        }

        for (let region of regions) {
            region.updateRender()
        }

    }, [regions])

    // utilities
    let onSpace = event => {
        if (event.key != ' ') return

        if (parentRegion) {
            wavesurfer.play(parentRegion.start, parentRegion.end)
        } else {
            wavesurfer.play(0, wavesurfer.getDuration())
        }
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
    let onArrowKey = event => {
        switch (event.key) {
            case 'ArrowRight': {

            }
            case 'ArrowLeft': {

            }
            case 'ArrowUp': {
                if (!parentRegion) return
                if (parentRegion.parent) {
                    dispatch(setParentRegion(parentRegion.parent.id))
                    
                } else {
                    dispatch(setParentRegion(null))
                }
            }
            case 'ArrowDown': {
                if (!parentRegion) return
                if (parentRegion.children.length === 0) return

                dispatch(setParentRegion(parentRegion.children[0].id))
                dispatch(setRegionSelected(parentRegion.children[0].id, true))
            }
            default: {
                return 
            }
        }
    }

    useEventListener('keydown', onSpace)
    useEventListener('keydown', onP)
    useEventListener('keydown', onEscape)
    useEventListener('keydown', onArrowKey)

    let onScroll = (event) => {
        let scaled = event.deltaY / 50
        let newZoom = Math.max(zoom - scaled, 0)
        setZoom(newZoom)
        wavesurfer.zoom(newZoom)
    }
    useEventListener('wheel', onScroll, waveformDivRef.current)

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


    useEffect(() => {
        dispatch(initWavesurfer(waveformDivRef.current))
    }, [])

    useEffect(() => {
        if (!wavesurfer) return

        wavesurfer.load(Kovo)

        wavesurfer.initRegions()

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


