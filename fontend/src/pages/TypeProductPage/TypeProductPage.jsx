import React from 'react'
import NavBarComponent from '../../components/NavBarComponent/NavBarComponent';
import CartComponent from '../../components/CartComponent/CartComponent';
import { WrapperApp, WrapperNav, WrapperProduct } from './style';
import { Pagination, Col } from 'antd';
import { useLocation } from 'react-router-dom';
import * as productService from '../../services/productService';
import { useEffect } from 'react';
import { useState } from 'react';
import { LoadingComponent } from '../../components/LoadingComponent/LoadingComponent';
import { useSelector } from 'react-redux';
import { useDebounce } from '../../hooks/useDebounce';

const TypeProductPage = () => {
    const { state } = useLocation();
    const searchProduct = useSelector((state) => state?.product?.search);
    const searchDebounce = useDebounce(searchProduct, 500)
    const [product, setProduct] = useState([])
    const [loading, setLoading] = useState(false)
    const [pagination,setPagination] = useState({
        page:0,
        limit:10,
        total:1
    })

    const getProductType = async (type,total,limit) => {
        setLoading(true)
        const res = await productService.getAllProductByBrand(type,total,limit)
        if (res?.status === 'success') {
            setLoading(false)
            setProduct(res?.data)
            setPagination({...pagination, total:res?.total})
        } else {
            setLoading(false)
        }
    };

    useEffect(() => {
        if (state) {
            getProductType(state,pagination.page,pagination.limit);
        }
    }, [state,pagination.page,pagination.limit])
    const onChange = (current,pageSize) => { 
        setPagination({...pagination,page:current -1,limit:pageSize})
    };

    return (
        <LoadingComponent isLoading={loading}>
            <div style={{ width: "100%", background: "#efefef",height:"calc(100vh-64px)" }}>
                <div style={{ width: "1270px", margin: "0 auto",height:'100%' }}>
                    <WrapperApp>
                        <WrapperNav span={4} >
                            <NavBarComponent />
                        </WrapperNav>
                        <Col span={20}>
                            <WrapperProduct >
                                {
                                    product?.filter((pro) => {
                                        if (searchDebounce === '') {
                                            return pro
                                        }else if(pro?.name.toLowerCase()?.includes(searchDebounce?.toLowerCase())){
                                            return pro
                                        }
                                    })?.map((item, index) => {
                                        return (
                                            <div key={index}>
                                                <CartComponent
                                                    name={item.name}
                                                    image={item.image}
                                                    type={item.type}
                                                    price={item.price}
                                                    countInStock={item.countInStock}
                                                    rating={item.rating}
                                                    description={item.description}
                                                    discount={item.discount}
                                                    selled={item.selled}
                                                    id={item._id}
                                                />
                                            </div>
                                        )
                                    })
                                }
                            </WrapperProduct>
                            <Pagination defaultCurrent={pagination?.page + 1} total={pagination?.total} onChange={onChange} style={{ textAlign: 'center', margin: '10px 0 0 0' }} />
                        </Col>
                    </WrapperApp>

                </div>
            </div>
        </LoadingComponent>
    )
}

export default TypeProductPage