import React from 'react'

import TreeView from '@material-ui/lab/TreeView'
import TreeItem from '@material-ui/lab/TreeItem'
import TextField from '@material-ui/core/TextField'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import { makeStyles } from '@material-ui/core/styles'

import styles from './styles.css'

import { useState } from 'react'
import { useSelector, useDispatch } from "react-redux"

import { updateDisplayName } from '../../actions/Actions'

const nextId = (() => {
    let id = 0;

    return () => {
        let next = id++;
        return next.toString()
    }
})()

const getUniqueId = (() => {
    let uniqueIdMap = {}

    return region => {
        if (region.id in uniqueIdMap) {
            return uniqueIdMap[region.id]
        }

        let unique = nextId()
        uniqueIdMap[region.id] = unique
        return unique
    }
})()

const Subtree = ({ region }) => {
    let [input, setInput] = useState(false)
    const [value, setValue] = useState(region.displayName)

    const dispatch = useDispatch()

    const onChange = event => setValue(event.target.value)

    let children = []
    for (let child of region.children) {
        children.push(<Subtree region={child} key={getUniqueId(region)} />)
    }

    let label
    if (input) {
        let onSubmit = e => {
            e.preventDefault()
            dispatch(updateDisplayName(region.id, value))
            setInput(false)
        }
        label = (
            <form onSubmit={onSubmit}>
                <TextField autoFocus={true} value={value || ''} onChange={onChange} onBlur={() => setInput(false)}></TextField>
            </form>
        )
    }
    else {
        label = region.displayName === undefined ? "Region " + getUniqueId(region).toString() : region.displayName
    }


    let onClick = event => {
        setInput(true)
    }
    return (
        <TreeItem onDoubleClick={onClick} nodeId={getUniqueId(region)} key={getUniqueId(region)} label={label}>
            {children}
        </TreeItem>
    )
}


export default function RegionViewer() {
    let regions = useSelector(state => state.regions)
    let dispatch = useDispatch()

    let items = []
    for (let region of regions) {
        if (region.root) {
            items.push(<Subtree region={region} key={getUniqueId(region)}></Subtree>)
        }
    }

    return (
        <TreeView
            className={styles.root}
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
        >
            {items}
        </TreeView>
    )
}