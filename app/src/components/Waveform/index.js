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
    let [zoom, setZoom] = useState(50)
    let [regions, setRegions] = useState({})
    let [activeRegion, setActiveRegion] = useState({})
    let waveformDivRef = useRef()

    function isEmpty(obj) {
        for(var prop in obj) {
            if(obj.hasOwnProperty(prop))
                return false;
        }
    
        return true;
    }

    let floatProgressToSeconds = (totalDuration, progressAsFloat) => {
        return progressAsFloat * totalDuration
    }

    let clearWavesurferRegions = wavesurfer => {
        for (let [id, region] of Object.entries(wavesurfer.regions.list)) {
            region.remove()
        }
    }

    let addRegion = region => {
        console.log(activeRegion);
        if (isEmpty(activeRegion)) {
            regions[region.id] = region
        } else {
            activeRegion.children[region.id] = region
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
        wavesurfer.on('region-created', region => {
            region.drag = false
            region.children = {}

            region.on('click', () => {
                clearWavesurferRegions(wavesurfer)
                wavesurfer.addRegion(region)

                setActiveRegion(old => {
                    return region
                })
            })

            addRegion(region)

            let regionExists = false
            for (let [id, child] in Object.entries(regions)) {
                if (id === region.id) {
                    regionExists = true
                    break
                }
            }
            if (!regionExists) {
                setRegions(regions => {
                    let newRegions = {
                        ...regions,
                        [region.id]: region
                    }

                    return newRegions
                })
            }

        })
    }

    // Initialization
    useEffect(() => {
        let MyCoolVariableWavesurfer = WaveSurfer.create({
            container: waveformDivRef.current,
            waveColor: 'blue',
        })
        addKeyListeners(MyCoolVariableWavesurfer)
        addScrollListener()
        addRegionAddedListener(MyCoolVariableWavesurfer)
        loadTest(MyCoolVariableWavesurfer)
        MyCoolVariableWavesurfer.enableDragSelection({})

        setWavesurfer(MyCoolVariableWavesurfer)
    }, [])

    useEffect(() => {
        wavesurfer && wavesurfer.zoom(zoom)
    }, [zoom])

    useEffect(() => {
        console.log(regions);
    }, [regions])

    return (
        <div ref={waveformDivRef} className={styles.waveform} />
    )
}