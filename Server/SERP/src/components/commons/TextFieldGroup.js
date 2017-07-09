import React, { Component } from 'react';
import classnames from 'classnames';

const TextFieldGroup = ({ field, value, label, error, type, onChange, placeholder }) => {
    return (
        <div className={classnames("form-group", {"has-error": error})}>
            <label className="control-label">{label}</label>
                <input 
                    value = {value}
                    onChange = {onChange }
                    type= { type } 
                    name = { field }
                    className = "form-control"
                    placeholder = {placeholder}
                />
            { error && <span className = "help-block">{error}</span> }
        </div>
    );
}

TextFieldGroup.defaultProps = {
    type: 'Text'
}

export default TextFieldGroup;