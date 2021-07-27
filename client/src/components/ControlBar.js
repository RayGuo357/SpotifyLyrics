import React from 'react'
import Button from './Button'

const ControlBar = ({ accessToken, updateInfo, isPlaying }) => {

    const playPauseBtn = (e, playing) => {
        var url, params
        if (playing) {
            url = new URL(window.location.protocol + window.location.hostname + process.env.REACT_APP_PORT_1 + "/pause")
            params = { access_token: accessToken }
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
            fetch(url)
                .then((res) => res.json())
                .then((data) => {
                    if (data.status_code === 204) {
                        console.log("Pausing")
                        e.target.innerHTML = "Play"
                        updateInfo()
                    } else if (data.status_code === 403) {
                        playPauseBtn(e, !playing)
                    } else {
                        console.log("Error code: " + data.status_code)
                    }
                })
        } else {
            url = new URL(window.location.protocol + window.location.hostname + process.env.REACT_APP_PORT_1 + "/play")
            params = { access_token: accessToken }
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
            fetch(url)
                .then((res) => res.json())
                .then((data) => {
                    if (data.status_code === 204) {
                        console.log("Playing")
                        e.target.innerHTML = "Pause"
                        updateInfo()
                    } else if (data.status_code === 403) {
                        playPauseBtn(e, !playing)
                    } else {
                        console.log("Error code: " + data.status_code)
                    }
                }).then(() => updateInfo())
        }
    }

    const skipBtn = () => {
        var url = new URL(window.location.protocol + window.location.hostname + process.env.REACT_APP_PORT_1 + "/next"),
            params = { access_token: accessToken }
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
            fetch(url)
                .then((res) => res.json())
                .then((data) => {
                    if (data.status_code === 204) {
                        console.log("Skipping")
                    } else {
                        console.log("Error code: " + data.status_code)
                    }
                }).then(() => updateInfo())
    }

    const prevBtn = () => {
        var url = new URL(window.location.protocol + window.location.hostname + process.env.REACT_APP_PORT_1 + "/previous"),
            params = { access_token: accessToken }
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
            fetch(url)
                .then((res) => res.json())
                .then((data) => {
                    if (data.status_code === 204) {
                        console.log("Previous")
                    } else {
                        console.log("Error code: " + data.status_code)
                    }
                }).then(() => updateInfo())
    }

    return (
        <div className="ControlBar" style={{ backgroundColor: "black" }}>
            <Button btnName={"Previous"} onClick={(prevBtn)} />
            <Button btnName={!isPlaying ? "Play" : "Pause"} onClick={(e) => {
                playPauseBtn(e, isPlaying)
                updateInfo()
            }} />
            <Button btnName={"Skip"} onClick={() => {
                skipBtn()
            }} />
            <Button btnName={"Test2"} onClick={updateInfo}/>
        </div>
    )
}

export default ControlBar
