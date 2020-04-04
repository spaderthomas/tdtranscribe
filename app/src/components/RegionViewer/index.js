import React from 'react'

import TreeView from '@material-ui/lab/TreeView'
import TreeItem from '@material-ui/lab/TreeItem'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import { makeStyles } from '@material-ui/core/styles'

import styles from './styles.css'

import { useState } from 'react'
import { useSelector } from "react-redux"

const getUniqueNodeId = (() => {
    let id = 0;

    return () => {
        let next = id++;
        return next.toString()
    }
})()


const RegionViewerItem = (props) => {
    let children = []
    for (let child of props.region.children) {
        children.push(<RegionViewerItem region={child} key={getUniqueNodeId()}></RegionViewerItem>)
    }

    let timeString = props.region.start.toFixed() + ", " + props.region.end.toFixed()
    return (
        <TreeItem nodeId={getUniqueNodeId()} label={timeString}>
            {children}
        </TreeItem>
    )
}
export default function RegionViewer() {
    let regions = useSelector(state => state.regions)

    let items = []
    for (let region of regions) {
        if (region.root) {
            items.push(<RegionViewerItem region={region} key={getUniqueNodeId()}></RegionViewerItem>)
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