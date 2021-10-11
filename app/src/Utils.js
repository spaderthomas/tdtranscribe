export const isEmptyObject = (obj) => {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop))
            return false;
    }

    return true;
}

export const pureArrayPush = (array, element) => {
    return [...array, element]
}

export const back = (array) => {
    return array[array.length - 1]
}

export const randomInt = (min, max) => {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min
}

const distinctColors = [
	'rgba(0, 0, 0, .5)',
	'rgba(1, 0, 103, .5)',
	'rgba(213, 255, 0, .5)',
	'rgba(255, 0, 86, .5)',
	'rgba(158, 0, 142, .5)',
	'rgba(14, 76, 161, .5)',
	'rgba(255, 229, 2, .5)',
	'rgba(0, 95, 57, .5)',
	'rgba(0, 255, 0, .5)',
	'rgba(149, 0, 58, .5)',
	'rgba(255, 147, 126, .5)',
	'rgba(164, 36, 0, .5)',
	'rgba(0, 21, 68, .5)',
	'rgba(145, 208, 203, .5)',
	'rgba(98, 14, 0, .5)',
	'rgba(107, 104, 130, .5)',
	'rgba(0, 0, 255, .5)',
	'rgba(0, 125, 181, .5)',
	'rgba(106, 130, 108, .5)',
	'rgba(0, 174, 126, .5)',
	'rgba(194, 140, 159, .5)',
	'rgba(190, 153, 112, .5)',
	'rgba(0, 143, 156, .5)',
	'rgba(95, 173, 78, .5)',
	'rgba(255, 0, 0, .5)',
	'rgba(255, 0, 246, .5)',
	'rgba(255, 2, 157, .5)',
	'rgba(104, 61, 59, .5)',
	'rgba(255, 116, 163, .5)',
	'rgba(150, 138, 232, .5)',
	'rgba(152, 255, 82, .5)',
	'rgba(167, 87, 64, .5)',
	'rgba(1, 255, 254, .5)',
	'rgba(255, 238, 232, .5)',
	'rgba(254, 137, 0, .5)',
	'rgba(189, 198, 255, .5)',
	'rgba(1, 208, 255, .5)',
	'rgba(187, 136, 0, .5)',
	'rgba(117, 68, 177, .5)',
	'rgba(165, 255, 210, .5)',
	'rgba(255, 166, 254, .5)',
	'rgba(119, 77, 0, .5)',
	'rgba(122, 71, 130, .5)',
	'rgba(38, 52, 0, .5)',
	'rgba(0, 71, 84, .5)',
	'rgba(67, 0, 44, .5)',
	'rgba(181, 0, 255, .5)',
	'rgba(255, 177, 103, .5)',
	'rgba(255, 219, 102, .5)',
	'rgba(144, 251, 146, .5)',
	'rgba(126, 45, 210, .5)',
	'rgba(189, 211, 147, .5)',
	'rgba(229, 111, 254, .5)',
	'rgba(222, 255, 116, .5)',
	'rgba(0, 255, 120, .5)',
	'rgba(0, 155, 255, .5)',
	'rgba(0, 100, 1, .5)',
	'rgba(0, 118, 255, .5)',
	'rgba(133, 169, 0, .5)',
	'rgba(0, 185, 23, .5)',
	'rgba(120, 130, 49, .5)',
	'rgba(0, 255, 198, .5)',
	'rgba(255, 110, 65, .5)',
	'rgba(232, 94, 190, .5)',
]
export const randomRGBA = () => {
	let index = randomInt(0, distinctColors.length)
	return distinctColors[index]
}

export const findRegion = (regions, id) => {
    for (let region of regions) {
        if (region.id === id) {
            return region
        } 
    }

    return null
}

export const snapEpsilon = 1

import { useRef, useEffect } from 'react'

export const useEventListener = (eventName, handler, element = document) => {
	const saved = useRef()

	useEffect(() => {
		saved.current = handler
	}, [handler])

	useEffect(() => {
		if (!element) return () => {}

		let eventHandler = event => saved.current(event)

		element.addEventListener(eventName, eventHandler)

		let cleanup = () => {
			element.removeEventListener(eventName, eventHandler)
		}
		return cleanup
	}, [element])
}

export const useRegionListener = (eventType, listener, wavesurfer) => {
	if (!wavesurfer || !wavesurfer.regions) {
		useEventListener(eventType, listener, null)
		return
	}

	useEventListener(eventType, listener, wavesurfer.regions.wrapper)
}

export const useWavesurferHandler = (eventName, handler, wavesurfer) => {
	const saved = useRef()

	useEffect(() => {
		saved.current = handler

		if (!wavesurfer) return () => {}

		let eventHandler = event => saved.current(event)

		wavesurfer.on(eventName, eventHandler)

		let cleanup = () => {
			wavesurfer.un(eventName, eventHandler)
		}
		return cleanup

	}, [handler, wavesurfer])
}
export const removeWavesurferRegion = (wavesurfer, id) => {
	let region = wavesurfer.regions.list[id]
	if (region) region.remove()
}

export const sortRegionIds = (regions, ids) => {
	return ids.sort((idA, idB) => {
		let a = findRegion(regions, idA)
		let b = findRegion(regions, idB)
		return a.start > b.start ? 1 : -1 
	})
}

export const getNextRegion = (regions, highlighted, children) => {
	if (!highlighted.length) {
		return children.length ? children[0] : null
	}

	let last = highlighted[highlighted.length - 1]
	let index = children.findIndex(element => element === last)
	if (index === -1 || index === children.length - 1) {
		return last
	} else {
		return children[index + 1]
	}
}

export const addChild = (regions, parent, childId) => {
	parent.children.push(childId)
	sortRegionIds(regions, parent.children)
}

export const getPreviousRegion = (regions, highlighted, children) => {
	if (!highlighted.length) {
		return null
	}

	let first = highlighted[0]
	let index = children.findIndex(element => element === first)
	if (index <= 0) {
		return first
	} else {
		return children[index - 1]
	}
}

export const modifiers = {
	'Control': false,
	'Alt': false,
	'Shift': false
}

export const listenForModifierKeys = () => {
	for (let [key, _] of Object.entries(modifiers)) {
		document.addEventListener('keydown', event => {
			if (event.key === key) {
				modifiers[key] = true
			}
		})
		document.addEventListener('keyup', event => {
			if (event.key === key) {
				modifiers[key] = false
			}
		})
	}
}

function getCurvePoints(pts, tension, isClosed, numOfSegments) {

    // use input value if provided, or use a default value   
    tension = (typeof tension != 'undefined') ? tension : 0.5;
    isClosed = isClosed ? isClosed : false;
    numOfSegments = numOfSegments ? numOfSegments : 16;

    var _pts = [], res = [],    // clone array
        x, y,           // our x,y coords
        t1x, t2x, t1y, t2y, // tension vectors
        c1, c2, c3, c4,     // cardinal points
        st, t, i;       // steps based on num. of segments

    // clone array so we don't change the original
    //
    _pts = pts.slice(0);

    // The algorithm require a previous and next point to the actual point array.
    // Check if we will draw closed or open curve.
    // If closed, copy end points to beginning and first points to end
    // If open, duplicate first points to befinning, end points to end
    if (isClosed) {
        _pts.unshift(pts[pts.length - 1]);
        _pts.unshift(pts[pts.length - 2]);
        _pts.unshift(pts[pts.length - 1]);
        _pts.unshift(pts[pts.length - 2]);
        _pts.push(pts[0]);
        _pts.push(pts[1]);
    }
    else {
        _pts.unshift(pts[1]);   //copy 1. point and insert at beginning
        _pts.unshift(pts[0]);
        _pts.push(pts[pts.length - 2]); //copy last point and append
        _pts.push(pts[pts.length - 1]);
    }

    // ok, lets start..

    // 1. loop goes through point array
    // 2. loop goes through each segment between the 2 pts + 1e point before and after
    for (let i = 2; i < (_pts.length - 4); i+=2) {
        for (t=0; t <= numOfSegments; t++) {

            // calc tension vectors
            t1x = (_pts[i+2] - _pts[i-2]) * tension;
            t2x = (_pts[i+4] - _pts[i]) * tension;

            t1y = (_pts[i+3] - _pts[i-1]) * tension;
            t2y = (_pts[i+5] - _pts[i+1]) * tension;

            // calc step
            st = t / numOfSegments;

            // calc cardinals
            c1 =   2 * Math.pow(st, 3)  - 3 * Math.pow(st, 2) + 1; 
            c2 = -(2 * Math.pow(st, 3)) + 3 * Math.pow(st, 2); 
            c3 =       Math.pow(st, 3)  - 2 * Math.pow(st, 2) + st; 
            c4 =       Math.pow(st, 3)  -     Math.pow(st, 2);

            // calc x and y cords with common control vectors
            x = c1 * _pts[i]    + c2 * _pts[i+2] + c3 * t1x + c4 * t2x;
            y = c1 * _pts[i+1]  + c2 * _pts[i+3] + c3 * t1y + c4 * t2y;

            //store points in array
            res.push(x);
            res.push(y);

        }
    }

    return res;
}

function drawLines(ctx, pts) {
    ctx.moveTo(pts[0], pts[1]);

    for(let i = 2; i < pts.length - 1; i+=2) {
        ctx.lineTo(pts[i], pts[i+1]);
    }
}

export function drawCurve(ctx, ptsa, tension, isClosed, numOfSegments) {
    ctx.beginPath();

    drawLines(ctx, getCurvePoints(ptsa, tension, isClosed, numOfSegments));

    //ctx.stroke();
    ctx.fill();
}