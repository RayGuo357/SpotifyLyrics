import React from 'react'
import Button from './Button'
import playButtonIcon from "../icons/play_circle_filled_black_24dp.svg"
import pauseButtonIcon from "../icons/pause_circle_black_24dp.svg"
import nextButtonIcon from "../icons/skip_next_black_24dp.svg"
import prevButtonIcon from "../icons/skip_previous_black_24dp.svg"

const ControlBar = ({ accessToken, updateInfo, isPlaying, duration, progress }) => {

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
                    } else if (data.status_code === 403) {
                        playPauseBtn(e, !playing)
                    } else if (data.status_code === 401) {
                        var newURL = window.location.protocol
                            + "//"
                            + window.location.hostname
                            + process.env.REACT_APP_PORT_0
                            + "/#/"
                        window.history.pushState({ path: newURL }, '', newURL)
                    } else {
                        console.log("Error code: " + data.status_code)
                    }
                }).then(() => {
                    setTimeout(() => { updateInfo() }, 100)
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
                    } else if (data.status_code === 403) {
                        playPauseBtn(e, !playing)
                    } else if (data.status_code === 401) {
                        var newURL = window.location.protocol
                            + "//"
                            + window.location.hostname
                            + process.env.REACT_APP_PORT_0
                            + "/#/"
                        window.history.pushState({ path: newURL }, '', newURL)
                    } else {
                        console.log("Error code: " + data.status_code)
                    }
                }).then(() => {
                    setTimeout(() => { updateInfo() }, 100)
                })
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
                } else if (data.status_code === 401) {
                    var newURL = window.location.protocol
                        + "//"
                        + window.location.hostname
                        + process.env.REACT_APP_PORT_0
                        + "/#/"
                    window.history.pushState({ path: newURL }, '', newURL)
                } else {
                    console.log("Error code: " + data.status_code)
                }
            }).then(() => {
                setTimeout(() => { updateInfo() }, 100)
            })
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
                } else if (data.status_code === 401) {
                    var newURL = window.location.protocol
                        + "//"
                        + window.location.hostname
                        + process.env.REACT_APP_PORT_0
                        + "/#/"
                    window.history.pushState({ path: newURL }, '', newURL)
                } else {
                    console.log("Error code: " + data.status_code)
                }
            }).then(() => {
                setTimeout(() => { updateInfo() }, 100)
            })
    }

    return (
        <div className="ControlBar">
            <div id="inner">
                <Button icon={prevButtonIcon} btnName={"Previous"} onClick={(prevBtn)} />
                <Button className="PlayButton" icon={!isPlaying ? playButtonIcon : pauseButtonIcon} btnName={!isPlaying ? "Play" : "Pause"} onClick={(e) => {
                    playPauseBtn(e, isPlaying)
                    setTimeout(() => { updateInfo() }, 100)
                }} />
                <Button icon={nextButtonIcon} btnName={"Skip"} onClick={() => {
                    skipBtn()
                }} />
            </div>
        </div>
    )
}

export default ControlBar
