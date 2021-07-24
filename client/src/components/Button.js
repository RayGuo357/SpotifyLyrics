import React from 'react'
import PropTypes from 'prop-types'

const Button = ({btnName, onClick}) => {
    return (
        <div>
            <button onClick={onClick}>
                {btnName}
            </button>
        </div>
    )
}

Button.defaultProps = {
    btnName: "Button",
}

Button.propTypes = {
    text: PropTypes.string
}

export default Button
