import React from 'react'
import Button from './Button'

const ControlBar = ({ accessToken, refreshTokens, updateInfo, isPlaying }) => {

    var url, params

    const playPauseBtn = (playing) => {
        if (playing) {
            url = new URL(window.location.protocol + window.location.hostname + process.env.REACT_APP_PORT_1 + "/pause")
            params = { access_token: accessToken }
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
            fetch(url)
                .then((res) => res.json())
                .then((data) => {
                    if (data.status_code === 204) {
                        console.log("Pausing")
                    } else if (data.status_code === 403) {
                        playPauseBtn(!playing)
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
                    } else if (data.status_code === 403) {
                        playPauseBtn(!playing)
                    } else {
                        console.log("Error code: " + data.status_code)
                    }
                })
        }
    }

    const skipBtn = () => {
        console.log("Skip");
    }

    return (
        <div style={{ backgroundColor: "black" }}>
            <Button btnName={"Play"} onClick={() => {
                playPauseBtn(isPlaying)
                updateInfo()
            }} />
            <Button btnName={"Skip"} onClick={skipBtn} />
        </div>
    )
}

export default ControlBar
