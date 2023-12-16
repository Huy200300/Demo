import React, { useEffect, useState } from 'react'
import { WrapperHeaders } from './style'
import { Button, Form } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import TableComponent from '../TableComponent/TableComponent'
import ModalComponent from '../ModalComponent/ModalComponent'
import { LoadingComponent } from '../LoadingComponent/LoadingComponent'
import DrawerComponent from '../DrawerComponent/DrawerComponent'
import InputComponent from '../InputComponent/InputComponent'
import * as message from '../../components/Message/Message'
import { useQuery } from '@tanstack/react-query'
import { useMutationHooks } from '../../hooks/useMutationHook'
import * as userService from '../../services/userService'
import useSelection from 'antd/es/table/hooks/useSelection'
import { WrapperImage, WrapperUploadFile } from '../AdminProduct/style'
import { getBase64 } from '../../untils'

const Admin = () => {
  const [rowSelected, setRowSelected] = useState('')
  const [isOpenDrawer, setIsOpenDrawer] = useState(false)
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
  const [isModalDelete, setIsModalDelete] = useState(false)
  const user = useSelection((state) => state?.user)
  const [form] = Form.useForm();

  const [stateUserDetails, setStateUserDetails] = useState({
    email: '',
    name: '',
    phone: '',
    address: '',
    avatar: "",
    isAdmin: false,
  });

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

  const mutationDelete = useMutationHooks(
    (data) => {
      const { id, access_token } = data;
      const res = userService.deleteUser(
        id,
        access_token
      )
      return res
    });

  const mutationDeleteMany = useMutationHooks(
    (data) => {
      const { token, ...ids } = data;
      const res = userService.deleteManyUser(
        ids,
        token
      )
      return res
    });

  const getAllUsers = async () => {
    const res = await userService.getAllUsers(user?.access_token)
    return res
  };

  const fetchGetDetailUsers = async (rowSelected) => {
    const res = await userService.getUsersDetail(rowSelected)
    if (res?.data) {
      setStateUserDetails({
        email: res?.data?.email,
        name: res?.data?.name,
        phone: res?.data?.phone,
        address: res?.data?.address,
        avatar: res?.data?.avatar,
        isAdmin: res?.data?.isAdmin,
      })
    }
    setIsLoadingUpdate(false)
  };


  useEffect(() => {
    form.setFieldValue(stateUserDetails)
  }, [form, stateUserDetails])

  useEffect(() => {
    if (rowSelected && isOpenDrawer) {
      setIsLoadingUpdate(true)
      fetchGetDetailUsers(rowSelected);
    }
  }, [rowSelected, isOpenDrawer]);

  const handleDeleteManyUser = (ids) => {
    mutationDeleteMany.mutate({
      ids: ids, token: user?.access_token
    }, {
      onSettled: () => {
        queryUser.refetch()
      }
    })
  }

  const { data: dataUpdated, isLoading: isLoadingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate
  const { data: dataDeleted, isLoading: isLoadingDeleted, isSuccess: isSuccessDeleted, isError: isErrordeleted } = mutationDelete
  const { data: dataDeletedMany, isLoading: isLoadingDeletedMany, isSuccess: isSuccessDeletedMany, isError: isErrordeletedMany } = mutationDeleteMany

  const queryUser = useQuery({ queryKey: ['users'], queryFn: getAllUsers })
  const { isLoading: isLoadingUsers, data: users } = queryUser

  const renderAction = () => {
    return (
      <div style={{ display: "flex", gap: "10px" }}>
        <div>
          <DeleteOutlined onClick={() => setIsModalDelete(true)} style={{ color: "red", fontSize: "30px", cursor: "pointer" }} />
        </div>
        <div>
          <EditOutlined onClick={() => setIsOpenDrawer(true)} style={{ color: "orangered", fontSize: "30px", cursor: "pointer" }} />
        </div>
      </div>
    )
  }
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: (a, b) => a.name.length - b.name.length
    },
    {
      title: 'Email',
      dataIndex: 'email',
      sorter: (a, b) => a.email.length - b.name.email.length
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      sorter: (a, b) => a.phone - b.name.phone
    },
    {
      title: 'Address',
      dataIndex: 'address',
    },
    {
      title: 'Admin',
      dataIndex: 'isAdmin',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: renderAction
    }
  ];

  const dataTable = users?.data?.length && users?.data?.map((user) => {
    return { ...user, key: user._id, isAdmin: user.isAdmin ? "True" : "False" };
  })


  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === 'success') {
      message.success();
      handleClose();
    } else if (isErrorUpdated) {
      message.error();
    }
  }, [isSuccessUpdated])

  useEffect(() => {
    if (isSuccessDeleted && dataDeleted?.status === 'success') {
      message.success();
      handleCancelDelete();
    } else if (isErrordeleted) {
      message.error();
    }
  }, [isSuccessDeleted])

  useEffect(() => {
    if (isSuccessDeletedMany && dataDeletedMany?.status === 'success') {
      message.success();
    } else if (isErrordeletedMany) {
      message.error();
    }
  }, [isSuccessDeletedMany])

  const handleOnChangeAvatarDetails = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateUserDetails({
      ...stateUserDetails,
      avatar: file.preview
    })
  };

  const handleClose = () => {
    setIsOpenDrawer(false);
    setStateUserDetails({
      email: '',
      name: '',
      phone: '',
      address: '',
      avatar: "",
      isAdmin: false,
    })
    form.resetFields();
  };

  const handleOnChangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value
    })
  };

  const onUpdateUser = () => {
    mutationUpdate.mutate({ id: rowSelected, ...stateUserDetails, token: user?.access_token }, {
      onSettled: () => {
        queryUser.refetch()
      }
    })
  }

  const handleCancelDelete = () => {
    setIsModalDelete(false)
  }

  const handleDeleteProduct = () => {
    mutationDelete.mutate({
      id: rowSelected,
      token: user?.access_token
    }, {
      onSettled: () => {
        queryUser.refetch()
      }
    })
  };
  return (
    <div>
      <WrapperHeaders>Quản lý người dùng</WrapperHeaders>
      <div style={{ marginTop: '20px' }}>
        <TableComponent handleDeleteMany={handleDeleteManyUser} columns={columns} isLoading={isLoadingUsers} data={dataTable} onRow={(record, index) => {
          return {
            onClick: event => {
              setRowSelected(record._id)
            }
          };
        }} />
      </div>

      <DrawerComponent width='40%' title='Chi tiết người dùng' isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)}>
        <LoadingComponent isLoading={isLoadingUpdated || isLoadingUpdate}>
          <Form
            name="basic"
            labelCol={{
              span: 5,
            }}
            wrapperCol={{
              span: 19,
            }}
            onFinish={onUpdateUser}
            autoComplete="on"
            form={form}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[
                {
                  required: false,
                  message: 'Please input your Name!',
                },
              ]}
            >
              {stateUserDetails?.name && ""}
              <InputComponent value={stateUserDetails['name'] && stateUserDetails.name} onChange={handleOnChangeDetails} name='name' />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: false,
                  message: 'Please input your Email!',
                },
              ]}
            >
              {stateUserDetails?.email && ""}
              <InputComponent value={stateUserDetails.email} onChange={handleOnChangeDetails} name='email' />
            </Form.Item>

            <Form.Item
              label="Address"
              name="address"
              rules={[
                {
                  required: false,
                  message: 'Please input your Count In Address!',
                },
              ]}
            >
              {stateUserDetails?.address && ""}
              <InputComponent value={stateUserDetails.address} onChange={handleOnChangeDetails} name='address' />
            </Form.Item>

            <Form.Item
              label="Phone"
              name="phone"
              rules={[
                {
                  required: false,
                  message: 'Please input your Phone!',
                },
              ]}
            >
              {stateUserDetails?.phone && ""}
              <InputComponent value={stateUserDetails.phone} onChange={handleOnChangeDetails} name='phone' />
            </Form.Item>

            <Form.Item
              label="Admin"
              name="isAdmin"
              rules={[
                {
                  required: false,
                  message: 'Please input your Admin!',
                },
              ]}
            >
              <input type="radio" value={false} name="isAdmin" id="false" checked onChange={handleOnChangeDetails} />
              <label htmlFor="false">False</label>
              <input type="radio" value={true} name="isAdmin" id="true" onChange={handleOnChangeDetails} />
              <label htmlFor="true">True</label>
            </Form.Item>

            <Form.Item
              label="Avatar"
              name="avatar"
              rules={[
                {
                  required: false,
                  message: 'Please input your Avatar!',
                },
              ]}
            >
              <WrapperUploadFile onChange={handleOnChangeAvatarDetails} maxCount={1}>
                <Button >Select File</Button>
                {
                  stateUserDetails?.avatar && (<WrapperImage src={stateUserDetails?.avatar} alt='avatar' />)
                }
              </WrapperUploadFile>

            </Form.Item>

            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <Button type="primary" htmlType="submit">
                Apply
              </Button>
            </Form.Item>
          </Form>
        </LoadingComponent>
      </DrawerComponent>

      <ModalComponent forceRender onOk={handleDeleteProduct} title='Xóa người dùng' open={isModalDelete} onCancel={handleCancelDelete} okText='Delete'>
        <LoadingComponent isLoading={isLoadingDeleted}>
          <div>Bạn có chắc muốn xóa tài khoản này không ?</div>
        </LoadingComponent>
      </ModalComponent>

    </div>
  )
}

export default Admin