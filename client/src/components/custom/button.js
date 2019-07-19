import React from 'react';
import './button.scss';

const Button = (props) => {
    return (
        <div className={`${props.className} custom-button`} onClick={props.onClick}>
            {props.children}
        </div>
    )
}

export default Button;