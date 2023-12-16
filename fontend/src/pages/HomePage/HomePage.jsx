import React, { useState } from "react";
import TypeProduct from "../../components/TypeProduct/TypeProduct";
import {
    WrapperButtonMore, WrapperTypeProduct,
    WrapperProductList, WrapperButtonMoreDiv, WrapperSilder, WrapperPadding, WrapperBrand, WrapperProductListLo
} from "../HomePage/style"
import SliderComponent from "../../components/SliderComponent/SliderComponent";
import CartComponent from "../../components/CartComponent/CartComponent";
import Slider1 from "../../assets/images/silder1.jpg";
import Slider2 from "../../assets/images/silder2.jpg";
import Slider3 from "../../assets/images/silder3.jpg";
import Slider4 from "../../assets/images/silder4.jpg";
import Slider5 from "../../assets/images/silder5.jpg";
import { useQuery } from '@tanstack/react-query'
import * as productService from '../../services/productService'
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { LoadingComponent } from '../../components/LoadingComponent/LoadingComponent'
import { useDebounce } from "../../hooks/useDebounce";
import NavBarComponent from "../../components/NavBarComponent/NavBarComponent";
import { RightCircleOutlined } from "@ant-design/icons";
import ButtonComponents from "../../components/ButtonComponents/ButtonComponents";
import InputComponent from "../../components/InputComponent/InputComponent";


const HomePage = () => {
    const searchProduct = useSelector((state) => state?.product?.search);
    const searchDebounce = useDebounce(searchProduct, 500)
    const [loading, setIsLoading] = useState(false)
    const [limit, setLimit] = useState(5);
    const [limits, setLimits] = useState(5)
    const [typeProduct, setTypeProduct] = useState([]);
    const [brandProduct, setBrandProduct] = useState([]);
    const [productBrand, setProductBrand] = useState([]);
    const [productByBrand, setProductByBrand] = useState([]);
    const productAll = async (context) => {
        setIsLoading(false)
        const limit = context?.queryKey && context?.queryKey[1]
        const search = context?.queryKey && context?.queryKey[2]
        const res = await productService.getAllProducts(search, limit)
        return res
    };

    const AllTypeProduct = async () => {
        const res = await productService.getAllTypeProduct();
        if (res?.status === 'success') {
            setTypeProduct(res?.data)
        }
    };

    const { isLoading, data: products } = useQuery(['products', limits, searchDebounce], productAll, { retry: 3, retryDelay: 1000, keepPreviousData: true })

    const getProductBrand = async (brand, limit) => {
        const res = await productService.getAllProductByBrand(brand, limit)
        if (res?.status === 'success') {
            setProductBrand(res?.data)
        }
    }

    useEffect(() => {
        const brand = 'Panasonic';
        getProductBrand(brand, limit)
        AllTypeProduct()
        // AllBrandProduct()
    }, []);

    // const handleBrandProduct = (brand, limit) => {
    //     if (brand) {
    //         getProductBrand(brand, limit)
    //         setLimit(5)
    //     }
    // };

    return (
        <LoadingComponent isLoading={isLoading || loading}>
            <WrapperPadding>
                <WrapperTypeProduct>
                    {
                        typeProduct?.map((item, index) => {
                            return <TypeProduct key={index} name={item} />
                        })
                    }

                </WrapperTypeProduct>
            </WrapperPadding>

            <WrapperPadding id="container">
                <WrapperSilder>
                    <SliderComponent arrImages={[Slider1, Slider2, Slider3, Slider4, Slider5]} />
                </WrapperSilder>
                <div>
                    <div>
                        <h2 style={{ marginBottom: '0px' }}>Hàng bán chạy</h2>
                        {/* <WrapperTypeProduct>
                            <InputComponent style={{ width: '100px', padding: '5px', borderRadius: '15px' }} onClick={handleBrandProduct('Panasonic',limit)} type='button' value='Panasonic' />
                            <InputComponent style={{ width: '100px', padding: '5px', borderRadius: '15px' }} onClick={handleBrandProduct('SamSung',limit)} type='button' value='SamSung' />
                            <InputComponent style={{ width: '100px', padding: '5px', borderRadius: '15px' }} onClick={handleBrandProduct('TV',limit)} type='button' value='TV' />

                        </WrapperTypeProduct> */}

                        <h3 style={{ textAlign: 'right', cursor: 'pointer', marginBottom: 0 }}>xem thêm</h3>
                        {/* <WrapperProductListLo>
                            <RightCircleOutlined onClick={() => setLimit((prev) => console.log(prev +1))
                            } style={{ zIndex: 10, position: 'absolute', transform: 'translateX(29px)', fontSize: 30, right: 0, top: '50%' }} />
                            {
                                productBrand?.map((item) => {
                                    return (
                                        <div
                                            style={{ display: 'flex', gap: 13, flexWrap: 'wrap' }}
                                        >
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
                        </WrapperProductListLo> */}
                    </div>
                    <div>
                        <h2 style={{ marginBottom: '0px' }}>Bạn có thể thích</h2>
                        <h3 style={{ textAlign: 'right', cursor: 'pointer', marginBottom: 0 }}>xem thêm</h3>
                        <WrapperProductListLo>
                            {
                                products?.data?.map((item, index) => {
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

                        </WrapperProductListLo>
                        <WrapperButtonMoreDiv>
                            <WrapperButtonMore textbutton='Xem thêm' type='outline' styleButton={{
                                border: '1px solid rgb(11,116,229)', color: `${products?.total === products?.data?.length} ? "#cc" : 'rgb(11,116,229)'`,
                                width: "240px", height: "38px", borderRadius: '5px',
                            }}
                                disabled={products?.total === products?.data?.length || products?.totalPages === 1}
                                onClick={() => setLimits((prev) => prev + 5)}
                            />
                        </WrapperButtonMoreDiv>
                    </div>
                </div>
            </WrapperPadding>

            {/* <WrapperPadding>
                <NavBarComponent />
            </WrapperPadding> */}


        </LoadingComponent>
    )
}

export default HomePage;