import React from 'react'
import ProductDetailComponent from '../../components/ProductDetailCoponent/ProductDetailCoponent'
import { useParams } from 'react-router-dom'

const ProductDetailPage = () => {
  const { id,type,name } = useParams()
  return (
    <div style={{ padding: '0 120px' }}>
      <h5 style={{ margin: '0' }}> <a href="/">Trang Chủ</a> - Chi tiết sản phẩm {'>'} {type} {'>'} {name}</h5>

      <ProductDetailComponent idProduct={id} />

    </div>
  )
}

export default ProductDetailPage