import React, { useEffect, useState } from "react";
import { Col, Badge, Popover } from 'antd';
import { WrapperContentPopup, WrapperHeader, WrapperHeaderAccount, WrapperTextHeader } from './style'
import { UserOutlined, CaretDownOutlined, ShoppingCartOutlined, BellOutlined, MailOutlined } from '@ant-design/icons';
import ButtonSearch from "../ButtonSearch/ButtonSearch";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import *  as userService from '../../services/userService'
import { resetUser } from '../../redux/slides/userSlice'
import { searchProduct } from '../../redux/slides/productSlice'
import { LoadingComponent } from '../../components/LoadingComponent/LoadingComponent'

const HeaderComponent = ({ isHidenSearch = false, isHidenCart = false, isHidenTitle = false, isHidenMT = false }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [openPop, setOpenPop] = useState(false);
    const order = useSelector((state) => state.order);
    const [userName, setUsername] = useState('')
    const [userAvatar, setUserAvatar] = useState('')
    const user = useSelector((state) => state.user);

    const handleLogout = async () => {
        setLoading(true)
        await userService.logOutUser();
        dispatch(resetUser());
        setLoading(false)
        navigate('/')
    };

    const onSearch = async (e) => {
        setSearch(e.target.value);
        dispatch(searchProduct(e.target.value));
    };

    useEffect(() => {
        setLoading(true)
        setUsername(user?.name)
        setUserAvatar(user?.avatar)
        setLoading(false)
    }, [user?.name, user?.avatar])

    const content = (
        <div>
            <WrapperContentPopup onClick={() => handlerOnclickNaviagte('profile')}>Thông tin người dùng</WrapperContentPopup>
            {
                user?.isAdmin && (
                    <WrapperContentPopup onClick={() => handlerOnclickNaviagte('admin')}>Quản lí hệ thống</WrapperContentPopup>
                )
            }
            <WrapperContentPopup onClick={() => handlerOnclickNaviagte('my-order')}>Đơn hàng của tôi</WrapperContentPopup>
            <WrapperContentPopup onClick={() => handlerOnclickNaviagte('logout')}>Đăng xuất</WrapperContentPopup>
        </div>
    )

    const handlerOnclickNaviagte = (type) => {
        switch (type) {
            case 'profile':
                navigate('/profile-user')
                break;
            case 'admin':
                navigate('/system/admin')
                break;
            case 'my-order':
                navigate('/my-order', {
                    state: {
                        id: user?.id,
                        token: user?.access_token
                    }
                })
                break;
            case 'logout':
                handleLogout();
                break;
            default:
                setOpenPop(false)
                break;
        }
    };

    return (
        <div >
            <WrapperHeader style={{ justifyContent: isHidenSearch && isHidenSearch ? "space-between" : "unset" }}>
                <Col span={6}>
                    <WrapperTextHeader to='/'>
                        DEMO
                    </WrapperTextHeader>
                </Col>
                {
                    !isHidenSearch && (
                        <Col span={12}>
                            <ButtonSearch
                                size="large"
                                textbutton="Search"
                                placeholder="input search text"
                                onChange={onSearch}
                            />
                        </Col>
                    )
                }

                {
                    isHidenTitle && (
                        <Col span={6}>
                            <h1 style={{margin:'0'}}>Admin DashBoard</h1>
                        </Col>
                    )
                }

                <Col span={6} style={{ display: "flex", gap: "10px", paddingLeft: "10px" }}>
                    <LoadingComponent isLoading={loading}>
                        <WrapperHeaderAccount>
                            {
                                userAvatar ? (
                                    <img src={userAvatar} alt='avatar' style={{ width: '30px', height: '30px', borderRadius: "50%", objectFit: "cover" }} />
                                ) : (
                                    <UserOutlined style={{ fontSize: '20px' }} />
                                )
                            }
                            {
                                user?.name ? (
                                    <>
                                        <div style={{ clear: 'both', whiteSpace: 'nowrap', cursor: "pointer" }}>
                                            <Popover content={content} open={openPop} trigger="click">
                                                <div onClick={() => setOpenPop((prev) => !prev)}>{userName?.length ? user?.name : user?.email}</div>
                                            </Popover>
                                        </div>
                                    </>
                                ) : (
                                    <div onClick={() => navigate('/sign-in')} style={{ cursor: "pointer" }}>
                                        <span>Đăng Nhập/ Đăng Ký</span>
                                        <div>
                                            <span>Tài Khoản</span>
                                            <CaretDownOutlined />
                                        </div>

                                    </div>
                                )
                            }
                        </WrapperHeaderAccount>
                    </LoadingComponent>

                    {
                        isHidenMT && (
                            <Col span={6}>
                                <BellOutlined style={{fontSize:'25px',padding:'5px',cursor:'pointer'}}/>
                                <MailOutlined style={{fontSize:'25px',padding:'5px',cursor:'pointer'}}/>
                            </Col>
                        )
                    }

                    {
                        !isHidenCart && (
                            <div onClick={() => navigate('/order')} style={{ cursor: "pointer" }}>
                                <Badge count={order?.orderItems?.length} size="small">
                                    <ShoppingCartOutlined style={{ fontSize: '25px', padding: '3px 0 0 0' }} />
                                </Badge>
                                <span style={{ padding: "0 5px" }}>Giỏ Hàng</span>

                            </div>
                        )
                    }

                </Col>
            </WrapperHeader>
        </div>
    )
}

export default HeaderComponent;