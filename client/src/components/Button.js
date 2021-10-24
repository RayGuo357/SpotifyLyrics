import React from 'react'
import PropTypes from 'prop-types'

const Button = ({ btnName, onClick, icon }) => {
    return (
        <div className="btnContainer">
            <button className="btn" onClick={onClick}>
            <img src={icon} alt={btnName} />
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
