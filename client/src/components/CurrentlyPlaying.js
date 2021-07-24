import React from 'react'
import { useState } from "react";
import Button from './Button';
import ControlBar from "./ControlBar";

const CurrentlyPlaying = () => {
    const [accessToken, setAccessToken] = useState([]);
    const [currentSong, setCurrentSong] = useState(
        {
            title: "",
            artists: ""
        }
    )

    function updateInfo() {
        // var test = getHashParams().access_token
        // console.log(test)
        var url = new URL("/update"),
            params = { access_token: access_token }
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
        fetch(url)
            .then((res) => res.json())
            .then((data) => setCurrentSong({
                title: data.title,
                artists: data.artists
            })).then(console.log(currentSong))

        // console.log(currentSong)
    }

    function getHashParams() {
        var hashParams = {};
        var e, r = /([^&;=]+)=?([^&;]*)/g,
            q = window.location.hash.substring(1);
        while (e = r.exec(q)) {
            hashParams[e[1]] = decodeURIComponent(e[2]);
        }
        return hashParams;
    }

    var params = getHashParams();

    var access_token = params.access_token,
        refresh_token = params.refresh_token,
        error = params.error;

    const parentToChild = () => {
        setAccessToken(access_token)
    }

    return (
        <div>
            Playing: {currentSong.title} by {currentSong.artists}
            <Button onClick={updateInfo} btnName="Click to Update"/>
            <ControlBar />
        </div>
    )
}

export default CurrentlyPlaying
