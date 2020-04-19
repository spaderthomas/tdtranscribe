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
    removeRegion,
    initWavesurfer,
} from '../../actions/Actions'

import {
    useEventListener,
    useRegionListener,
    snapEpsilon,
    removeWavesurferRegion,
    findRegion,
    useWavesurferHandler,
    sortRegionIds,
    getNextRegion,
    getPreviousRegion,
    modifiers
} from '../../Utils'


import Kovo from '../../assets/kovo.wav'

import styles from './styles.css'

export default function Waveform() {
    const [zoom, setZoom] = useState(0)
    const [width, setWidth] = useState(width);
    const waveformDivRef = useRef()

    const dispatch = useDispatch()

    const wavesurfer = useSelector(state => state.wavesurfer)
    const parentId = useSelector(state => state.parent)
    const regions = useSelector(state => state.regions)

    const [visible, setVisible] = useState([]) 
    const [highlighted, setHighlighted] = useState([])

    const [dragging, setDragging] = useState(false)
    const [draggingRegion, setDraggingRegion] = useState()
    const [pxMove, setPxMove] = useState()
    const [dragStart, setDragStart] = useState()

    const isWavesurferReady = () => {
        return wavesurfer && wavesurfer.ready
    }

    const onRegionClick = wsRegion => {
        console.log('UNIMPLEMENTED: onRegionClick()')
        // dispatch(setParentRegion(wsRegion.id))
    }
    
    const onRegionMove = wsRegion => {
        console.log('UNIMPLEMENTED: onRegionMove()')
        //dispatch(moveRegion(wsRegion.id, wsRegion.start, wsRegion.end))
    }
    
    const setRegionCallbacks = wsRegion => {
        wsRegion.on('update', event => onRegionMove(wsRegion))
        wsRegion.on('click', event => onRegionClick(wsRegion))
    }

    let onSpace = event => {
        if (event.key != ' ') return

        console.log(highlighted)
        let parent = findRegion(regions, parentId)
        let firstHighlighted = findRegion(regions, highlighted[0])
        let lastHighlighted = findRegion(regions, highlighted[highlighted.length - 1])
        wavesurfer.loop(firstHighlighted.start, lastHighlighted.end)
        
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
    }

    let onArrowKey = event => {
        if (event.key === 'ArrowRight') {
            event.preventDefault()
            if (modifiers['Control']) {
                let parent = findRegion(regions, parentId)

                let nextRegionId = getNextRegion(regions, highlighted, parent.children)
                if (!nextRegionId) return

                let nextHighlighted = [...highlighted]
                nextHighlighted.push(nextRegionId)
                setHighlighted(nextHighlighted)
            } else {
                let parent = findRegion(regions, parentId)

                let nextHighlighted = getNextRegion(regions, highlighted, parent.children)
                nextHighlighted ?  setHighlighted([nextHighlighted]) : setHighlighted([])
            }
        }
        else if (event.key === 'ArrowLeft') {
            event.preventDefault()

            if (modifiers['Control']) {
                let parent = findRegion(regions, parentId)

                let prevRegionId = getPreviousRegion(regions, highlighted, parent.children)
                if (!prevRegionId) return

                let nextHighlighted = [...highlighted]
                nextHighlighted.push(prevRegionId)
                setHighlighted(nextHighlighted)
            } else {
                let parent = findRegion(regions, parentId)

                let nextHighlighted = getPreviousRegion(regions, highlighted, parent.children)
                nextHighlighted ?  setHighlighted([nextHighlighted]) : setHighlighted([])
            }
        }
        else if (event.key === 'ArrowUp') {
            event.preventDefault()

            let parent = findRegion(regions, parentId)
            let nextParent = findRegion(regions, parent.parent)
            nextParent && dispatch(setParentRegion(nextParent.id))
        }
        else if (event.key === 'ArrowDown') {
            event.preventDefault()
            if (highlighted.length != 1) return

            let nextParentId = highlighted[0]
            dispatch(setParentRegion(nextParentId))
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
        //wavesurfer.fireEvent('region-update-end', draggingRegion, e);

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
            dispatch(addRegion(region))

            let nextVisible = [...visible]
            nextVisible.push(region.id)
            setVisible(nextVisible)
        }

        let slop = 0
        if (pxMove + 1 <= slop) {
            setPxMove(pxMove + 1)
            return;
        }

        // Snap
        let duration = wavesurfer.getDuration()
        let position = wavesurfer.drawer.handleEvent(e)
        let start = Math.min(position * duration, dragStart * duration)
        let end = Math.max(position * duration, dragStart * duration)

        for (let other of regions) {
            if (other.id === region.id) { continue }

            if (Math.abs(other.start - end) < snapEpsilon) {
                end = other.start
            }
            if (Math.abs(start - other.end) < snapEpsilon) {
                start = other.end
            }
        }

        dispatch(moveRegion(region.id, start, end))
    };
    useRegionListener('mousemove', onMoveMouse, wavesurfer)

    useEffect(() => {
        dispatch(initWavesurfer(waveformDivRef.current))
    }, [])

    useEffect(() => {
        if (!isWavesurferReady()) return
        if (!parentId) return

        for (let region of regions) {
            removeWavesurferRegion(wavesurfer, region.id)
        }

        for (let id of visible) {
            let region = findRegion(regions, id)
            setRegionCallbacks(wavesurfer.regions.add({
                ...region,
                highlighted: highlighted.includes(id)
            }))
        }

        for (let region of regions) {
            region.updateRender()
        }
    }, [visible])

    useEffect(() => {
        if (!isWavesurferReady()) return

        for (let id of visible) {
            let wsRegion = wavesurfer.regions.list[id]
            wsRegion.highlighted = highlighted.includes(id)
            wsRegion.updateRender()
        }
    }, [highlighted])


    useEffect(() => {
        if (!isWavesurferReady()) return

        for (let id of visible) {
            let region = findRegion(regions, id)
            let wsRegion = wavesurfer.regions.list[id]
            wsRegion.start = region.start
            wsRegion.end = region.end
            wsRegion.updateRender()
        }

        let parent = findRegion(regions, parentId)
        parent && sortRegionIds(regions, parent.children)
        sortRegionIds(regions, highlighted)
        sortRegionIds(regions, visible)
    }, [regions])

    useEffect(() => {
        if (!wavesurfer) return
        if (!parentId) return

        // @hack
        for (let region of regions) {
            let wsRegion = wavesurfer.regions.list[region.id] 
            wsRegion && wsRegion.remove()           
        }

        // When the parent region changes, we only want to display its direct children. 
        let parent = findRegion(regions, parentId)
        setVisible([...parent.children])
        setHighlighted([])

        let newZoom = wavesurfer.zoomOnRegion(parent.start, parent.end, width)
        setZoom(newZoom)
    }, [parentId])

    const onWavesurferReady = () => {
        wavesurfer.ready = true
        let root = wavesurfer.regions.add()
        root.remove()
        root.id = 'root'
        root.start = 0
        root.end = wavesurfer.getDuration()
        dispatch(addRegion(root))
        dispatch(setParentRegion(root.id))
    }
    useWavesurferHandler('ready', onWavesurferReady, wavesurfer)

    useEffect(() => {
        if (!wavesurfer) return

        wavesurfer.load(Kovo)
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


