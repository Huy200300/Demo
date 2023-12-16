import { Card, Rate } from 'antd';
import React from 'react'
import { StyleNameProduct, WrapperReporterText, WrapperPriceText, WrapperDisCountText } from './style';
import { useNavigate } from 'react-router-dom';
import { convertPrice } from '../../untils';

const CartComponent = (props) => {
  const { name, image, price, rating, selled, discount, id,type } = props
  const navigate = useNavigate()
  const handleDetailsProduct = (id,type,name) => {
    navigate(`/product-details/${type}/${name}/${id}`)
  }
  return (
    <Card
      hoverable
      bodyStyle={{ padding: "10px" }}
      headStyle={{ width: "200px", height: "200px" }}
      style={{ width: '240px !important' }}
      cover={<img alt="example" src={image} height='230' />}
      onClick={() => handleDetailsProduct(id,type,name)}
    >
      <StyleNameProduct>{name}</StyleNameProduct>
      <WrapperReporterText>
        <Rate allowHalf defaultValue={rating} value={rating} style={{ fontSize: '15px' }} />
        <span> | Đã Bán {selled || 1000}+</span>
      </WrapperReporterText>
      <WrapperPriceText>
        <span>{convertPrice(price)}</span>
        <WrapperDisCountText>{discount || -16}%</WrapperDisCountText>
      </WrapperPriceText>
    </Card>
  )
};

export default CartComponent