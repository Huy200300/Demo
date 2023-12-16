import React from 'react'
import { WrapperProducts } from './style'
import { useNavigate } from 'react-router-dom'

const TypeProduct = ({ name }) => {
  const navigate = useNavigate()
  const handleTypeProduct = (type) => {
    navigate(`/product/${type.normalize('NFD').replace(/[\u0300-\u036f]/g, '')?.replace(/ /g, '_')}`,{state:type})
  }
  return (
    <WrapperProducts onClick={() => handleTypeProduct(name)} style={{ cursor: "pointer" }}>{name}</WrapperProducts>
  )
}

export default TypeProduct