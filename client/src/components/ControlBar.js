import React from 'react'
import Button from './Button'

const ControlBar = ({ accessToken, refreshTokens, updateInfo, isPlaying }) => {

    var url, params

    const playPauseBtn = (e) => {
        if (isPlaying) {
            url = new URL(window.location.protocol + window.location.hostname + "pause")
            params = { access_token: accessToken }
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
            fetch(url)
                .then((res) => res.json())
                .then((data) => console.log(data))
                .then(console.log("Pausing"))
                .then(console.log(isPlaying))
                .then(updateInfo())
        } else {
            url = new URL(window.location.protocol + window.location.hostname + "play")
            params = { access_token: accessToken }
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
            fetch(url)
                .then((res) => res.json())
                .then((data) => console.log(data))
                .then(console.log("Playing"))
                .then(console.log(isPlaying))
                .then(updateInfo())
        }
    }

    const skipBtn = () => {
        console.log("Skip");
    }

    return (
        <div style={{ backgroundColor: "black" }}>
            <Button btnName={"Play"} onClick={playPauseBtn} />
            <Button btnName={"Skip"} onClick={skipBtn} />
        </div>
    )
}

export default ControlBar
