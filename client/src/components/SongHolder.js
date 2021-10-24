import React from 'react'
import Lyrics from './Lyrics'
import Info from './Info'

const SongHolder = ( {title, artists, lyrics} ) => {
    return (
        <div>
            <Info 
                title={title}
                artists={artists} />
            <Lyrics lyrics={lyrics} />
        </div>
    )
}

export default SongHolder
