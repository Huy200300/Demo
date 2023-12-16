import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CustomCheckbox, WrapperCountOrder, WrapperInfo, WrapperItemOrder, WrapperLeft, WrapperListOrder, WrapperRight, WrapperStyleHeader, WrapperStyleHeaderDilivery, WrapperTotal } from './style';
import { DeleteOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { WrapperInputNumber } from "../../components/ProductDetailCoponent/style";
import ButtonComponents from "../../components/ButtonComponents/ButtonComponents";
import { decreaseAmount, increaseAmount, removeAllOrderProduct, removeOrderProduct, selectedOrder } from "../../redux/slides/orderSlice";
import { convertPrice } from "../../untils";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import { LoadingComponent } from "../../components/LoadingComponent/LoadingComponent";
import { Form } from "antd";
import InputComponent from "../../components/InputComponent/InputComponent";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as userService from '../../services/userService';
import * as message from '../../components/Message/Message';
import { updateUser } from "../../redux/slides/userSlice";
import { useNavigate } from "react-router-dom";
import StepComponent from "../../components/StepComponent/StepComponent";


const OrderPage = () => {
    const order = useSelector((state) => state.order);
    const user = useSelector((state) => state.user);
    const [listChecher, setListChecher] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false);

    const [stateUserDetails, setStateUserDetails] = useState({
        name: '',
        address: '',
        phone: '',
        city: '',
    });
    const [form] = Form.useForm();

    const mutationUpdate = useMutationHooks(
        (data) => {
            const { id, access_token, ...rest } = data;
            const res = userService.updateUsers(
                id,
                { ...rest },
                access_token
            )
            return res
        });

    const { isLoading, data } = mutationUpdate;


    const onChange = (e) => {
        if (listChecher.includes(e.target.value)) {
            const newListChecked = listChecher.filter((item) => item !== e.target.value)
            setListChecher(newListChecked);
        }
        else {
            setListChecher([...listChecher, e.target.value]);
        }
    };

    const handleChangeCount = (type, idProduct, max) => {
        if (type === 'increase') {
            if (!max) {
                dispatch(increaseAmount(idProduct))
            }
        } else if (type === 'decrease') {
            if (!max) {
                dispatch(decreaseAmount(idProduct))
            }
        }
    };

    const handleDeleteOrder = (idProduct) => {
        dispatch(removeOrderProduct(idProduct));
    };

    const handleOnchangeCheckAll = (e) => {
        if (e.target.checked) {
            const newListChecked = []
            order?.orderItems?.forEach((item) => { newListChecked.push(item?.product) })
            setListChecher(newListChecked)
        } else {
            setListChecher([]);
        }
    };

    useEffect(() => {
        dispatch(selectedOrder({ listChecher }))
    }, [listChecher]);



    useEffect(() => {
        if (isOpenModalUpdateInfo) {
            setStateUserDetails({
                name: user?.name,
                phone: user?.phone,
                address: user?.address,
                city: user?.city,
            })
        }
    }, [isOpenModalUpdateInfo]);

    const handleRemoveAllOrder = () => {
        if (listChecher?.length > 0) {
            dispatch(removeAllOrderProduct({ listChecher }))
        }
    };

    const priceMemo = useMemo(() => {
        const result = order?.orderItemsSelected?.reduce((total, cur) => { return total + (cur.price * cur.amount) }, 0)
        return result
    }, [order]);

    const priceDiscountMemo = useMemo(() => {
        const result = order?.orderItemsSelected?.reduce((total, cur) => {
            const totalDiscount = cur.discount ? cur.discount : 0
            
            return total + (priceMemo * (totalDiscount * cur.amount) / 100)
        }, 0)
        if (Number(result)) {
            return result
        }
        return 0
    }, [order]);

    const diliveryPriceMemo = useMemo(() => {
        if (priceMemo >= 200000 && priceMemo <= 500000) {
            return 10000
        } else if (priceMemo >= 500000 || order?.orderItemsSelected?.length === 0) {
            return 0
        }
        else {
            return 20000
        }
    }, [priceMemo]);

    const totalPriceMemo = useMemo(() => {
        return Number(priceMemo) - Number(priceDiscountMemo) + Number(diliveryPriceMemo) 
    }, [priceMemo, priceDiscountMemo, diliveryPriceMemo]);

    const handleAddCard = () => {
        if (!order?.orderItemsSelected?.length) {
            message.error('Vui lòng chọn sản phẩm để thanh toán')
        }else if(!user?.id){
            navigate('/sign-in');
            message.error('bạn cần đăng nhập để mua hàng')
        }  else if (!user?.name || !user?.address || !user?.phone || !user?.city) {
            setIsOpenModalUpdateInfo(true);
        }else {
            navigate('/payment')
        }
    };

    const handleCancleUpdate = () => {
        setStateUserDetails({
            email: '',
            name: '',
            phone: '',
            address: '',
            avatar: "",
            isAdmin: false,
            city: '',
        })
        form.resetFields();
        setIsOpenModalUpdateInfo(false);
    };

    useEffect(() => {
        form.setFieldValue(stateUserDetails)
    }, [form, stateUserDetails]);

    const handleUpdateInforUser = () => {
        const { name, phone, city, address } = stateUserDetails
        if (name && phone && city && address) {
            mutationUpdate.mutate({ id: user?.id, ...stateUserDetails, token: user?.access_token }, {
                onSuccess: () => {
                    dispatch(updateUser({ name, phone, city, address }))
                    setIsOpenModalUpdateInfo(false);
                }
            })
        }
    };

    const handleOnchangeDetails = (e) => {
        setStateUserDetails({
            ...stateUserDetails,
            [e.target.name]: e.target.value
        })
    };

    const handleChangeAddress = () => {
        setIsOpenModalUpdateInfo(true);
    };

    const itemsDelivery = [
        {
            title: '20.000 VND',
            description: 'Dưới 200.000 VND',
        },
        {
            title: '10.000 VND',
            description: 'Từ 200.000 VND đến dưới 500.000 VND',
        },
        {
            title: 'Free ship',
            description: 'Trên 500.000 VND',
        },
    ]

    return (
        <div style={{ background: '#f5f5fa', with: '100%', height: '100vh' }}>
            <div style={{ height: '100%', width: '1270px', margin: '0 auto' }}>
                <h3 style={{ fontWeight: 'bold' }}>Giỏ hàng</h3>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <WrapperLeft>
                        <h4>Phí giao hàng</h4>
                        <WrapperStyleHeaderDilivery>
                            <StepComponent items={itemsDelivery} current={diliveryPriceMemo === 10000
                                ? 2 : diliveryPriceMemo === 20000 ? 1
                                    : order?.orderItemsSelected?.length === 0 ? 0 : 3} />
                        </WrapperStyleHeaderDilivery>
                        <WrapperStyleHeader>
                            <span style={{ display: 'inline-block', width: '390px' }}>
                                <CustomCheckbox onChange={handleOnchangeCheckAll} checked={listChecher?.length === order?.orderItems?.length} ></CustomCheckbox>
                                <span> Tất cả ({order?.orderItems?.length} sản phẩm)</span>
                            </span>
                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span>Đơn giá</span>
                                <span>Số lượng</span>
                                <span>Thành tiền</span>
                                <DeleteOutlined style={{ cursor: 'pointer' }} onClick={handleRemoveAllOrder} />
                            </div>
                        </WrapperStyleHeader>
                        <WrapperListOrder>
                            {order?.orderItems?.map((order) => {
                                return (
                                    <WrapperItemOrder key={order?.product}>
                                        <div style={{ width: '390px', display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <CustomCheckbox onChange={onChange} value={order?.product} checked={listChecher.includes(order?.product)}></CustomCheckbox>
                                            <img src={order?.image} alt="anh" style={{ width: '77px', height: '79px', objectFit: 'cover' }} />
                                            <div style={{
                                                width: 260,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                textAlign: 'center',
                                            }}>{order?.name}</div>
                                        </div>
                                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <span>
                                                <span style={{ fontSize: '13px', color: '#242424' }}>{convertPrice(order?.price)}</span>
                                            </span>
                                            <WrapperCountOrder>
                                                <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('decrease', order?.product, order?.amount === 1)}>
                                                    <MinusOutlined style={{ color: '#000', fontSize: '10px' }} />
                                                </button>
                                                <WrapperInputNumber defaultValue={order?.amount} value={order?.amount} size="small" min={1} max={order?.countInStock} />
                                                <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('increase', order?.product, order?.amount === order?.countInStock)}>
                                                    <PlusOutlined style={{ color: '#000', fontSize: '10px' }} />
                                                </button>
                                            </WrapperCountOrder>
                                            <span style={{ color: 'rgb(255, 66, 78)', fontSize: '13px', fontWeight: 500 }}>{convertPrice(order?.price * order?.amount)}</span>
                                            <DeleteOutlined style={{ cursor: 'pointer' }} onClick={() => handleDeleteOrder(order?.product)} />
                                        </div>
                                    </WrapperItemOrder>
                                )
                            })}
                        </WrapperListOrder>
                    </WrapperLeft>

                    <WrapperRight>
                        <div style={{ width: '100%' }}>
                            <WrapperInfo>
                                <div>
                                    <span>Địa chỉ: </span>
                                    <span style={{ fontWeight: 'bold' }}>{`${user?.address} ${user?.city}`} </span>
                                    <span onClick={handleChangeAddress} style={{ color: '#9255FD', cursor: 'pointer' }}>Thay đổi</span>
                                </div>
                            </WrapperInfo>
                            <WrapperInfo>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <span>Tạm tính</span>
                                    <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }}>{convertPrice(priceMemo)}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <span>Giảm giá</span>
                                    <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }}>{convertPrice(priceDiscountMemo)}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <span>Phí giao hàng</span>
                                    <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }}>{convertPrice(diliveryPriceMemo)}</span>
                                </div>
                            </WrapperInfo>
                            <WrapperTotal>
                                <span>Tổng tiền</span>
                                <span style={{ display: 'flex', flexDirection: 'column' }}>

                                    <span style={{ color: 'rgb(254, 56, 52)', fontSize: '24px', fontWeight: 'bold' }}>{convertPrice(totalPriceMemo)}</span>
                                    <span style={{ color: '#000', fontSize: '11px' }}>(Đã bao gồm VAT nếu có)</span>
                                </span>
                            </WrapperTotal>
                        </div>
                        <ButtonComponents
                            onClick={() => handleAddCard()}
                            size={40}
                            styleButton={{
                                background: 'rgb(255, 57, 69)',
                                height: '48px',
                                width: '320px',
                                border: 'none',
                                borderRadius: '4px',
                                color: '#fff', fontSize: '15px', fontWeight: '700'
                            }}

                            textbutton={'Mua hàng'}
                        ></ButtonComponents>
                    </WrapperRight>
                </div>
            </div>
            <ModalComponent title="Cập nhật thông tin giao hàng" open={isOpenModalUpdateInfo} onCancel={handleCancleUpdate} onOk={handleUpdateInforUser}>
                <LoadingComponent isLoading={isLoading}>
                    <Form
                        name="basic"
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 20 }}
                        autoComplete="on"
                        form={form}
                    >
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[{ required: true, message: 'Please input your name!' }]}
                        >
                            {stateUserDetails?.name && ''}
                            <InputComponent value={stateUserDetails?.name} onChange={handleOnchangeDetails} name="name" />
                        </Form.Item>
                        <Form.Item
                            label="City"
                            name="city"
                            rules={[{ required: true, message: 'Please input your city!' }]}
                        >
                            {stateUserDetails?.city && ''}
                            <InputComponent value={stateUserDetails?.city} onChange={handleOnchangeDetails} name="city" />
                        </Form.Item>
                        <Form.Item
                            label="Phone"
                            name="phone"
                            rules={[{ required: true, message: 'Please input your  phone!' }]}
                        >
                            {stateUserDetails?.phone && ''}
                            <InputComponent value={stateUserDetails?.phone} onChange={handleOnchangeDetails} name="phone" />
                        </Form.Item>

                        <Form.Item
                            label="Address"
                            name="address"
                            rules={[{ required: true, message: 'Please input your  address!' }]}
                        >
                            {setStateUserDetails?.address && ''}
                            <InputComponent value={stateUserDetails?.address} onChange={handleOnchangeDetails} name="address" />
                        </Form.Item>
                    </Form>
                </LoadingComponent>
            </ModalComponent>
        </div>
    )
}

export default OrderPage;