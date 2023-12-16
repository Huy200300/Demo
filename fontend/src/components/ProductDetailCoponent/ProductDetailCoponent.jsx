import { Col, Image, Rate, Row } from 'antd';
import React, { useState } from 'react';
import anh2 from '../../assets/images/anh2.jpg';
import anh3 from '../../assets/images/anh3.jpg';
import anh4 from '../../assets/images/anh4.jpg';
import anh5 from '../../assets/images/anh5.jpg';
import anh6 from '../../assets/images/anh6.jpg';
import anh7 from '../../assets/images/anh7.jpg';
import {
    WrapperStyleTextPrice, WrapperStyleImageSmall, WrapperButtonQuantity,
    WrapperStyleAddress, WrapperStylePrice, WrapperStyleColImage,
    WrapperStyleTextSell, WrapperStyleQuantity, WrapperStyleNameProduct, WrapperInputNumber
} from './style';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import ButtonComponents from '../ButtonComponents/ButtonComponents';
import * as productService from '../../services/productService'
import { useQuery } from '@tanstack/react-query';
import { LoadingComponent } from '../LoadingComponent/LoadingComponent';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addOrderProduct, resetOrder } from '../../redux/slides/orderSlice';
import { convertPrice, initFacebookSDK } from '../../untils';
import * as message from '../../components/Message/Message'
import { useEffect } from 'react';
import LikeButtonComponent from '../LikeButtonComponent/LikeButtonComponent';
import CommentComponent from '../CommentComponent/CommentComponent';

const ProductDetailCoponent = ({ idProduct }) => {
    const [count, setCount] = useState(1);
    const user = useSelector((state) => state.user)
    const order = useSelector((state) => state.order)
    const [errorLimitOrder, setErrorLimitOrder] = useState(false)
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const onChange = (value) => {
        setCount(Number(value))
    };

    const fetchGetDetailProduct = async (context) => {
        const id = context?.queryKey && context?.queryKey[1]
        const res = await productService.getDetailsProducts(id)
        return res?.data
    };

    useEffect(() => {
        initFacebookSDK()
    }, [])

    useEffect(() => {
        const orderRedux = order?.orderItems?.find((item) => item?.product === productDetails?._id)
        if ((orderRedux?.amount + count) <= orderRedux?.countInStock || (!orderRedux && productDetails?.countInStock > 0)) {
            setErrorLimitOrder(false)
        } else if (productDetails?.countInStock === 0) {
            setErrorLimitOrder(true)
        }

    }, [count])

    useEffect(() => {
        if (order.isSucessOrder) {
            message.success('Đã thêm vào giỏ hàng')
        }
        return () => {
            dispatch(resetOrder())
        }
    }, [order.isSucessOrder])


    const handleChangeCount = (type, max) => {
        if (type === 'increase') {
            if (!max) {
                setCount(count + 1)
            }
        }
        else {
            if (!max) {
                setCount(count - 1)
            }
        }
    }

    const { isLoading, data: productDetails } = useQuery(['product-details', idProduct], fetchGetDetailProduct, { enabled: !!idProduct })

    const handleAddOrderProduct = () => {
        if (!user?.id) {
            navigate('/sign-in', { state: location?.pathname })
        } else {
            const orderRedux = order?.orderItems?.find((item) => item.product === productDetails?._id)
            if ((orderRedux?.amount + count) <= orderRedux?.countInStock || (!orderRedux && productDetails?.countInStock > 0)) {
                dispatch(addOrderProduct({
                    orderItem: {
                        name: productDetails?.name,
                        amount: count,
                        image: productDetails?.image,
                        price: productDetails?.price,
                        product: productDetails?._id,
                        discount: productDetails?.discount,
                        countInStock: productDetails?.countInStock
                    }
                }))
            } else {
                setErrorLimitOrder(true)
            }
        }
    };

    return (
        <LoadingComponent isLoading={isLoading}>
            <Row style={{ padding: '16px', backgroundColor: '#fff' }}>
                <Col span={10}>
                    <Image src={productDetails?.image} alt='Image Product' preview={false} />
                    <Row style={{ padding: '10px', justifyContent: "space-between" }}>
                        <WrapperStyleColImage span={4}>
                            <WrapperStyleImageSmall src={anh2} alt='Image Product' preview={false} />
                        </WrapperStyleColImage>
                        <WrapperStyleColImage span={4}>
                            <WrapperStyleImageSmall src={anh3} alt='Image Product' preview={false} />
                        </WrapperStyleColImage>
                        <WrapperStyleColImage span={4}>
                            <WrapperStyleImageSmall src={anh4} alt='Image Product' preview={false} />
                        </WrapperStyleColImage>
                        <WrapperStyleColImage span={4}>
                            <WrapperStyleImageSmall src={anh5} alt='Image Product' preview={false} />
                        </WrapperStyleColImage>
                        <WrapperStyleColImage span={4}>
                            <WrapperStyleImageSmall src={anh6} alt='Image Product' preview={false} />
                        </WrapperStyleColImage>
                        <WrapperStyleColImage span={4}>
                            <WrapperStyleImageSmall src={anh7} alt='Image Product' preview={false} />
                        </WrapperStyleColImage>
                    </Row>
                </Col>
                <Col style={{ paddingLeft: '10px' }} span={14}>
                    <WrapperStyleNameProduct>{productDetails?.name}</WrapperStyleNameProduct>
                    <div>
                        <Rate allowHalf defaultValue={productDetails?.rating} value={productDetails?.rating} />
                        <WrapperStyleTextSell> | Da ban 1000+</WrapperStyleTextSell>
                    </div>

                    <WrapperStylePrice>
                        <WrapperStyleTextPrice>{convertPrice(productDetails?.price)} <span style={{ textDecoration: 'underline' }}>đ</span> </WrapperStyleTextPrice>

                    </WrapperStylePrice>

                    <WrapperStyleAddress>
                        <span>Giao Đến </span>
                        <span className='address'> {user?.address} </span>-
                        <span className='change-address'> Đổi địa chỉ</span>
                    </WrapperStyleAddress>

                    <LikeButtonComponent dataHref={process.env.REACT_APP_IS_LOCAL ? "https://developers.facebook.com/docs/plugins/" : window.location.href} />

                    <WrapperStyleQuantity>

                        <span>Số lượng</span>
                        <div style={{ display: 'flex', gap: '5px' }}>
                            <WrapperButtonQuantity onClick={() => handleChangeCount('increase', count === productDetails?.countInStock)}>
                                <PlusOutlined style={{ fontSize: '20px' }} />
                            </WrapperButtonQuantity>

                            <WrapperInputNumber size='small' defaultValue={1} min={1} max={productDetails?.countInStock} value={count} onChange={onChange} />
                            <WrapperButtonQuantity onClick={() => handleChangeCount('decrease', count === 1)}>
                                <MinusOutlined style={{ fontSize: '20px' }} />
                            </WrapperButtonQuantity>

                        </div>

                    </WrapperStyleQuantity>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <div>
                            <ButtonComponents size={40} styleButton={
                                { marginRight: '20px', color: '#fff', background: 'rgb(255,57,69)', height: '40px', width: '220px', border: 'none', borderRadius: '5px' }
                            } textbutton='Chọn mua' onClick={handleAddOrderProduct} />
                            {errorLimitOrder && <div style={{ color: 'red', marginTop: '10px', fontSize: "18px", textAlign: 'center' }}>Sản phẩm hết hàng</div>}
                        </div>
                        <ButtonComponents size={40} styleButton={
                            { height: '40px', width: '220px', borderRadius: '5px' }
                        } textbutton='Mua Trả Sau' />
                    </div>
                </Col>

                <CommentComponent dataHref={process.env.REACT_APP_IS_LOCAL ? "https://developers.facebook.com/docs/plugins/comments#configurator" : window.location.href} width='1270' />
            </Row>
        </LoadingComponent>
    )
}

export default ProductDetailCoponent