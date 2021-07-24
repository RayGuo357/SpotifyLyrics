import React from 'react'
import Button from './Button'

const ControlBar = () => {
    
    const playPauseBtn = (e) => {
        console.log("Play");
        console.log(e)
    }

    const skipBtn = () => {
        console.log("Skip");
    }

    return (
        <div style={{backgroundColor: "black"}}>
            <Button btnName={"Play"} onClick={playPauseBtn} />
            <Button btnName={"Skip"} onClick={skipBtn} />
        </div>
    )
}

export default ControlBar
