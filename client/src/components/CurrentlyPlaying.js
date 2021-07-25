import React from 'react'
import { useState } from "react";
import Button from './Button';
import ControlBar from "./ControlBar";

const CurrentlyPlaying = () => {
    const [tokens, setTokens] = useState(
        {
            accessToken: "",
            refreshToken: ""
        }
    );
    const [currentSong, setCurrentSong] = useState(
        {
            title: "",
            artists: "",
            song_href: "",
            is_playing: false,
            duration: 0,
            progress: 0
        }
    )

    var params = getHashParams();

    var access_token = params.access_token,
        refresh_token = params.refresh_token,
        error = params.error;

    const updateInfo = () => {
        // var test = getHashParams().access_token
        // console.log(test)
        updateTokens()
        var url = new URL(window.location.protocol + window.location.hostname + "/update"),
            params = { access_token: tokens.accessToken }
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
        fetch(url)
            .then((res) => res.json())
            .then((data) => setCurrentSong({
                title: data.title,
                artists: data.artists,
                song_href: data.song_href,
                is_playing: data.is_playing,
                duration: data.duration,
                progress: data.progress
            }))

        // console.log(currentSong)
    }

    const updateTokens = () => {
        // console.log("updating tokens")
        var url = new URL(window.location.protocol + window.location.hostname + "/refresh_token"),
            params = { refresh_token: refresh_token }
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
        fetch(url)
            .then((res) => res.json())
            .then((data) => access_token = data.access_token)
            .then(() => {
                var newURL = window.location.protocol 
                        + "//" 
                        + window.location.hostname 
                        + ":3000/#/currently-playing/#access_token=" 
                        + access_token 
                        + "&refresh_token=" 
                        + refresh_token
                window.history.pushState({ path: newURL }, '', newURL)
                // console.log(newURL)

                params = getHashParams()
                access_token = params.access_token
                refresh_token = params.refresh_token
                error = params.error

                setTokens({
                    accessToken: access_token,
                    refreshToken: refresh_token
                })
            })
    }

    function getHashParams() {
        var hashParams = {};
        var e, r = /([^&;=]+)=?([^&;]*)/g,
            q = window.location.hash.substring(21);
        while (e = r.exec(q)) {
            hashParams[e[1]] = decodeURIComponent(e[2]);
        }
        return hashParams;
    }

    const parentToChild = () => {
        setTokens({
            accessToken: access_token,
            refreshToken: refresh_token
        })
    }

    return (
        <div>
            Playing: {currentSong.title} by {currentSong.artists}
            <Button onClick={updateInfo} btnName="Click to Update" />
            <ControlBar accessToken={tokens.accessToken} 
                        updateInfo={updateInfo} 
                        isPlaying={currentSong.is_playing}/>
        </div>
    )
}

export default CurrentlyPlaying
