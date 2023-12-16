import { Menu } from 'antd'
import { AppstoreOutlined, DollarCircleOutlined, ShopOutlined, ShoppingCartOutlined, ShoppingOutlined, UserOutlined } from '@ant-design/icons';
import React, { useState } from 'react'
import { getItem } from '../../untils';
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent';
import Admin from '../../components/AdminUser/Admin';
import AdminProduct from '../../components/AdminProduct/AdminProduct';
import OrderAdmin from '../../components/OrderAdmin/OrderAdmin';
import * as OrderService from '../../services/orderService'
import * as ProductService from '../../services/productService'
import * as UserService from '../../services/userService'
import CustomizedContent from './components/CustomizedContent';
import { useSelector } from 'react-redux';
import { useQueries } from '@tanstack/react-query';
import { useMemo } from 'react';
import * as Loading from '../../components/LoadingComponent/LoadingComponent';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const user = useSelector((state) => state?.user)
  const navigate = useNavigate()

  const items = [
    getItem('DashBoard', 'dashboard', <AppstoreOutlined />),
    getItem('Người dùng', 'user', <UserOutlined />),
    getItem('Sản phẩm', 'product', <ShopOutlined />),
    getItem('Đơn hàng', 'order', <ShoppingCartOutlined />),

  ];
  const [keySelected, setKeySelected] = useState('')

  const getAllOrder = async () => {
    const res = await OrderService.getAllOrder(user?.access_token)
    return { data: res?.data, key: 'orders' }
  }

  const getAllProducts = async () => {
    const res = await ProductService.getAllProducts()
    return { data: res?.data, key: 'products' }
  }

  const getAllUsers = async () => {
    const res = await UserService.getAllUsers(user?.access_token)
    return { data: res?.data, key: 'users' }
  }

  const queries = useQueries({
    queries: [
      { queryKey: ['products'], queryFn: getAllProducts, staleTime: 1000 * 60 },
      { queryKey: ['users'], queryFn: getAllUsers, staleTime: 1000 * 60 },
      { queryKey: ['orders'], queryFn: getAllOrder, staleTime: 1000 * 60 },
    ]
  })
  const memoCount = useMemo(() => {
    const result = {}
    try {
      if (queries) {
        queries.forEach((query) => {
          result[query?.data?.key] = query?.data?.data?.length
        })
      }
      return result
    } catch (error) {
      return result
    }
  }, [queries])

  const COLORS = {
    users: ['#e66465', '#9198e5'],
    products: ['#a8c0ff', '#3f2b96'],
    orders: ['#11998e', '#38ef7d'],
  };

  const renderPage = (key) => {
    switch (key) {
      case 'dashboard':
        return <CustomizedContent />
      case 'user':
        return <Admin />
      case 'product':
        return <AdminProduct />
      case 'order':
        return <OrderAdmin />
      default:
        return null;
    }
  }


  const handleOnClick = ({ key }) => {
    setKeySelected(key)
  }

  return (
    <>
      <HeaderComponent isHidenCart isHidenSearch isHidenTitle={true} isHidenMT={true} />
      <div style={{ display: "flex" }}>
        <Menu
          mode="inline"
          style={{
            width: 256,
            height: "100vh",
            boxShadow: "1px 1px 2px #ccc"
          }}
          items={items}
          onClick={handleOnClick}
        />

        <div style={{ display: 'flex', gap: '20px', padding: "15px",flexWrap:'wrap' }}>
          <CustomizedContent icon={<ShoppingCartOutlined style={{
            color: 'green',
            backgroundColor: 'rgba(0,255,0,0.25)',
            borderRadius:20,
            fontSize:24,
            padding:8
          }} />} title={'Đơn Hàng'} value={1234} />
          <CustomizedContent icon={<ShoppingOutlined style={{
            color: 'blue',
            backgroundColor: 'rgba(0,0,255,0.25)',
            borderRadius:20,
            fontSize:24,
            padding:8
          }}/>} title={'Sản Phẩm'} value={1234} />
          <CustomizedContent icon={<UserOutlined style={{
            color: 'purple',
            backgroundColor: 'rgba(0,255,255,0.25)',
            borderRadius:20,
            fontSize:24,
            padding:8
          }}/>} title={'Người Dùng'} value={1234} />
          <CustomizedContent icon={<DollarCircleOutlined style={{
            color: 'red',
            backgroundColor: 'rgba(255,0,0,0.25)',
            borderRadius:20,
            fontSize:24,
            padding:8
          }}/>} title={'Doanh Thu'} value={1234} />

          {renderPage(keySelected)}
        </div>

      </div>
    </>
  )
}

export default AdminPage