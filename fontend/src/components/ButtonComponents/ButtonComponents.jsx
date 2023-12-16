import { Button } from 'antd'
import React from 'react'

const ButtonComponents = ({ size, styleButton, textbutton, disabled, ...rest }) => {
    return (
        <Button
            disabled={disabled}
            size={size}
            style={{
                ...styleButton,
                background: disabled ? "#ccc" : styleButton.background
            }}
            {...rest}
        >
            <span>{textbutton}</span>
        </Button>
    )
}

export default ButtonComponents