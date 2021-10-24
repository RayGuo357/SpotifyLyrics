import React from 'react'
import { useState } from "react";
import Button from './Button';
import ControlBar from "./ControlBar";
import SongHolder from './SongHolder';

class CurrentlyPlaying extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            accessToken: "",
            refreshToken: "",

            title: "",
            artists: "",
            main_artist: "",
            song_href: "",
            is_playing: false,
            duration: 0,
            progress: 0,
            lyrics: "",
            seekIncrement: 0,
            seekTimer: 0
        }
    }

    componentDidMount() {
        this.updateInfo()
        this.timerID = setInterval(
            () => this.seekTick(),
            1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID)
    }

    seekTick() {
        if (this.state.is_playing) {
            this.setState({
                accessToken: this.state.accessToken,
                refreshToken: this.state.refreshToken,

                title: this.state.title,
                artists: this.state.artists,
                main_artist: this.state.main_artist,
                song_href: this.state.song_href,
                is_playing: this.state.is_playing,
                duration: this.state.duration,
                progress: this.state.progress,
                lyrics: this.state.lyrics,
                seekIncrement: this.state.seekIncrement + 1000,
                seekTimer: this.state.progress + this.state.seekIncrement
            })
            if (this.state.duration - this.state.seekTimer < 2000) {
                this.updateInfo()
                console.log("Updating...")
            }
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


    updateStateTokens = async () => {
        var params = this.getHashParams();
        var access_token = params.access_token,
            refresh_token = params.refresh_token

        this.setState({
            accessToken: access_token,
            refreshToken: refresh_token,

            title: this.state.title,
            artists: this.state.artists,
            main_artist: this.state.main_artist,
            song_href: this.state.song_href,
            is_playing: this.state.is_playing,
            duration: this.state.duration,
            progress: this.state.progress,
            lyrics: this.state.lyrics,
            seekIncrement: this.state.seekIncrement,
            seekTimer: this.state.seekTimer
        })
    }


    updateInfo = async () => {
        await this.updateTokens()
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
                        lyrics: this.state.lyrics,

                        title: data.title,
                        artists: data.artists,
                        main_artist: data.main_artist,
                        song_href: data.song_href,
                        is_playing: data.is_playing,
                        duration: data.duration,
                        progress: data.progress,
                        seekIncrement: 0,
                        seekTimer: 0
                    })
                    this.getLyrics()
                } else if (data.status_code === 401) {
                    var newURL = window.location.protocol
                        + "//"
                        + window.location.hostname
                        + process.env.REACT_APP_PORT_0
                        + "/#/"
                    window.history.pushState({ path: newURL }, '', newURL)
                } else {
                    console.log("Update info failed with code: " + data.status_code)
                }
            })
    }

    updateTokens = async () => {
        await this.updateStateTokens()
        var url = new URL(window.location.protocol + window.location.hostname + process.env.REACT_APP_PORT_1 + "/refresh_token"),
            params = { refresh_token: this.state.refreshToken }
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                if (data.status_code === 200) {
                    var newURL = window.location.protocol
                        + "//"
                        + window.location.hostname
                        + process.env.REACT_APP_PORT_0
                        + "/#/currently-playing/#access_token="
                        + this.state.accessToken
                        + "&refresh_token="
                        + this.state.refreshToken
                    window.history.pushState({ path: newURL }, '', newURL)
                } else if (data.status_code === 401) {
                    var newURL = window.location.protocol
                        + "//"
                        + window.location.hostname
                        + process.env.REACT_APP_PORT_0
                        + "/#/"
                    window.history.pushState({ path: newURL }, '', newURL)
                } else {
                    console.log("Update tokens failed with: " + data.status_code)
                }
            })
    }

    getLyrics = () => {
        var url = new URL(window.location.protocol + window.location.hostname + process.env.REACT_APP_PORT_1 + "/lyrics"),
            params = {
                title: this.state.title,
                artist: this.state.main_artist
            }
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                this.setState({
                    accessToken: this.state.accessToken,
                    refreshToken: this.state.refreshToken,

                    title: this.state.title,
                    artists: this.state.artists,
                    main_artist: this.state.main_artist,
                    song_href: this.state.song_href,
                    is_playing: this.state.is_playing,
                    duration: this.state.duration,
                    progress: this.state.progress,
                    lyrics: data.lyrics,
                    seekIncrement: this.state.seekIncrement,
                    seekTimer: this.state.seekTimer
                })
            })
    }

    render() {
        return (
            <div className="CurrentlyPlaying">
                <SongHolder
                    title={this.state.title}
                    artists={this.state.artists}
                    lyrics={this.state.lyrics} />
                <ControlBar
                    accessToken={this.state.accessToken}
                    updateInfo={this.updateInfo}
                    isPlaying={this.state.is_playing} />
            </div>
        )
    }
}

export default CurrentlyPlaying
