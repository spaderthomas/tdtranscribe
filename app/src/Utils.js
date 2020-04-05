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
