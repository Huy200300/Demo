import React, { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query';
import * as orderService from '../../services/orderService'
import { convertPrice } from '../../untils';
import { WrapperItemOrder, WrapperListOrder, WrapperHeaderItem, WrapperFooterItem, WrapperContainer, WrapperStatus } from './style';
import ButtonComponent from '../../components/ButtonComponents/ButtonComponents';
import { LoadingComponent } from '../../components/LoadingComponent/LoadingComponent';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutationHooks } from '../../hooks/useMutationHook';
import * as message from '../../components/Message/Message'
import { useSelector } from 'react-redux';


const MyOrderPage = () => {
  const location = useLocation();
  const { state } = location
  const naviagte = useNavigate()
  const user = useSelector((state) => state.user)
  const fetchMyOrder = async () => {
    const res = await orderService.getOrderByUserId(state?.id, state?.token)
    return res.data
  }

  const queryOrder = useQuery({ queryKey: ['orders'], queryFn: fetchMyOrder }, {
    enabled: state?.id && state?.token
  })
  const { isLoading, data } = queryOrder

  const renderProduct = (data) => {
    return data?.map((item) => {
      return <WrapperHeaderItem key={item._id}>
        <img src={item?.image} alt="anh"
          style={{
            width: "70px",
            height: '70px',
            objectFit: 'cover',
            border: '1px solid',
            padding: '2px'
          }} />
        <div style={{
          width: 260,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          marginLeft: '10px'

        }}>{item?.name}</div>
        <span style={{ fontSize: '13px', color: '#242424', marginLeft: 'auto' }}>{convertPrice(item?.price)}</span>
      </WrapperHeaderItem>
    })
  };

  const handleDetailsOrder = (orderId) => {
    naviagte(`/details-order/${orderId}`, {
      state: {
        token: state?.token
      }
    })
  };

  const mutation = useMutationHooks(
    (data) => {
      const { id, token, orderItems, userId } = data;
      const res = orderService.cancelOrder(id, token, orderItems, userId);
      return res
    }
  );

  const handleCanceOrder = (order) => {
    mutation.mutate({ id: order?._id, token: state?.token, orderItems: order?.orderItems, userId: user?.id }, {
      onSuccess: () => {
        queryOrder.refetch();
      }
    })
  };

  const { isLoading: isLoadingCancel, isSuccess: isSuccessCancel, isError: isErrorCancel, data: dataCancel } = mutation

  useEffect(() => {
    if (isSuccessCancel && dataCancel?.status === 'success') {
      message.success()
    } else if (isSuccessCancel && dataCancel?.status === 'error') {
      message.error(dataCancel?.message)
    } else if (isErrorCancel) {
      message.error()
    }
  }, [isSuccessCancel, isErrorCancel, dataCancel])

  return (
    <LoadingComponent isLoading={isLoading || isLoadingCancel}>
      <WrapperContainer>
        <div style={{ height: '100%', width: '1270px', margin: '0 auto' }} >
          <h4>Đơn hàng của tôi</h4>
          <WrapperListOrder>
            {
              data?.map((order) => {
                return (
                  <WrapperItemOrder key={order?._id}>
                    <WrapperStatus>
                      <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Trạng thái</span>
                      <div>
                        <span style={{ color: 'rgb(255, 66, 78)' }}>Giao hàng: </span>
                        <span style={{ color: 'rgb(90, 32, 193)', fontWeight: 'bold' }}>{`${order.isDelivered ? 'Đã giao hàng' : 'Chưa giao hàng'}`}</span>
                      </div>
                      <div>
                        <span style={{ color: 'rgb(255, 66, 78)' }}>Thanh toán: </span>
                        <span style={{ color: 'rgb(90, 32, 193)', fontWeight: 'bold' }}>{`${order.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}`}</span>
                      </div>
                    </WrapperStatus>
                    {
                      renderProduct(order?.orderItems)
                    }
                    <WrapperFooterItem>
                      <div>
                        <span style={{ color: 'rgb(255, 66, 78)' }}>Tổng tiền: </span>
                        <span
                          style={{ fontSize: '13px', color: 'rgb(56, 56, 61)', fontWeight: 700 }}
                        >{convertPrice(order?.totalPrice)}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <ButtonComponent
                          onClick={() => handleCanceOrder(order)}
                          size={40}
                          styleButton={{
                            height: '36px',
                            border: '1px solid #9255FD',
                            borderRadius: '4px'
                          }}
                          textbutton={'Hủy đơn hàng'}
                        />
                        <ButtonComponent
                          onClick={() => handleDetailsOrder(order?._id)}
                          size={40}
                          styleButton={{
                            height: '36px',
                            border: '1px solid #9255FD',
                            borderRadius: '4px'
                          }}
                          textbutton={'Xem chi tiết'}
                        />
                      </div>
                    </WrapperFooterItem>
                  </WrapperItemOrder>
                )
              })
            }
          </WrapperListOrder>
        </div>
      </WrapperContainer>
    </LoadingComponent>
  )
}

export default MyOrderPage