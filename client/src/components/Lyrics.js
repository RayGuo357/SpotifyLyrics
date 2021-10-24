import React from 'react'

const checkLyrics = (lyrics) => {
    if(lyrics === undefined || lyrics.trim().length === 0) {
        return "Could not find lyrics."
    } else {
        return lyrics
    }
}

const Lyrics = ({ lyrics }) => {
    return (
        <pre className="Lyrics">
            {checkLyrics(lyrics)}
        </pre>
    )
}

export default Lyrics
