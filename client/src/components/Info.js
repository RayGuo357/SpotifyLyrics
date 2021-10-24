import React from 'react'

const Info = ( {title, artists} ) => {
    return (
        <div className="Title">
            {title} by {artists}
        </div>
    )
}

export default Info
