import React from 'react'
import { useState } from "react";
import Button from './Button';
import ControlBar from "./ControlBar";

class CurrentlyPlaying extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            accessToken: "",
            refreshToken: "",

            title: "",
            artists: "",
            song_href: "",
            is_playing: false,
            duration: 0,
            progress: 0
        }
    }

    getHashParams() {
        var hashParams = {};
        var e, r = /([^&;=]+)=?([^&;]*)/g,
            q = window.location.hash.substring(21);
        while (e = r.exec(q)) {
            hashParams[e[1]] = decodeURIComponent(e[2]);
        }
        return hashParams;
    }

    render() {

        window.onload = () => updateInfo()

        const updateStateTokens = async () => {
            var params = this.getHashParams();
            var access_token = params.access_token,
                refresh_token = params.refresh_token

            this.setState({
                accessToken: access_token,
                refreshToken: refresh_token,

                title: this.state.title,
                artists: this.state.artists,
                song_href: this.state.song_href,
                is_playing: this.state.is_playing,
                duration: this.state.duration,
                progress: this.state.progress
            })
        }

        const testFunc = async () => {
            this.setState({
                accessToken: this.state.accessToken,
                refreshToken: this.state.refreshToken,

                title: this.state.title,
                artists: this.state.artists,
                song_href: this.state.song_href,
                is_playing: this.state.is_playing,
                duration: this.state.duration,
                progress: this.state.progress
            })
        }


        const updateInfo = async () => {
            // var test = getHashParams().access_token
            // console.log(test)
            await updateTokens()
            var url = new URL(window.location.protocol + window.location.hostname + process.env.REACT_APP_PORT_1 + "/update"),
                params = { access_token: this.state.accessToken }
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
            fetch(url)
                .then((res) => res.json())
                .then((data) => {
                    if (data.status_code === 200) {
                        this.setState({
                            accessToken: this.state.accessToken,
                            refreshToken: this.state.refreshToken,

                            title: data.title,
                            artists: data.artists,
                            song_href: data.song_href,
                            is_playing: data.is_playing,
                            duration: data.duration,
                            progress: data.progress
                        })
                    } else {
                        console.log("Update info failed with code: " + data.status_code)
                    }
                })
            console.log("Update Info State:")
            console.log(this.state)
        }

        const updateTokens = async () => {
            // console.log("updating tokens")
            await updateStateTokens()
            var url = new URL(window.location.protocol + window.location.hostname + process.env.REACT_APP_PORT_1 + "/refresh_token"),
                params = { refresh_token: this.state.refreshToken }
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
            fetch(url)
                .then((res) => res.json())
                .then((data) => {
                    if (data.status_code === 200) {
                        // access_token = data.access_token
                        var newURL = window.location.protocol
                            + "//"
                            + window.location.hostname
                            + process.env.REACT_APP_PORT_0
                            + "/#/currently-playing/#access_token="
                            + this.state.accessToken
                            + "&refresh_token="
                            + this.state.refreshToken
                        window.history.pushState({ path: newURL }, '', newURL)
                        // console.log(newURL)
                    } else {
                        console.log("Update tokens failed with: " + data.status_code)
                    }
                })
        }

        return (
            <div className="CurrentlyPlaying">
                Playing: {this.state.title} by {this.state.artists}
                <Button onClick={updateInfo} btnName={"Update"} />
                <Button onClick={() => {
                    testFunc()
                    console.log(this.state)
                }} btnName={"Test"} />
                <ControlBar
                    accessToken={this.state.accessToken}
                    updateInfo={updateInfo}
                    isPlaying={this.state.is_playing} />
            </div>
        )
    }
}

export default CurrentlyPlaying
