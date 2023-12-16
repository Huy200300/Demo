
import React from 'react'
import { WrapperInputStyle } from './style';

const InputForm = (props) => {
  const { placeholder = 'nhập text', ...rest } = props;
  const handleOnChangeInput = (e) => {
    props.onChange(e.target.value)
  }
  return (
    <div>
      <WrapperInputStyle placeholder={placeholder} value={props.value}  {...rest} onChange={handleOnChangeInput} />
    </div>

  )
}

export default InputForm