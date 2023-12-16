import React, { useEffect, useRef, useState } from 'react'
import { WrapperHeaders, WrapperImage, WrapperUploadFile } from './style'
import { Button, Form, Select, Space } from 'antd'
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import TableComponent from '../TableComponent/TableComponent'
import InputComponent from '../InputComponent/InputComponent'
import * as productService from '../../services/productService'
import { useMutationHooks } from '../../hooks/useMutationHook';
import { LoadingComponent } from '../../components/LoadingComponent/LoadingComponent'
import { getBase64, renderOptions } from '../../untils'
import * as message from '../../components/Message/Message'
import { useQuery } from '@tanstack/react-query'
import DrawerComponent from '../DrawerComponent/DrawerComponent'
import ModalComponent from '../ModalComponent/ModalComponent'
import { useSelector } from 'react-redux'

const AdminProduct = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rowSelected, setRowSelected] = useState('')
    const [isOpenDrawer, setIsOpenDrawer] = useState(false)
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
    const [isModalDelete, setIsModalDelete] = useState(false)
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const user = useSelector((state) => state?.user)

    const init = () => (
        {
            rating: '',
            name: '',
            type: '',
            price: '',
            countInStock: '',
            description: '',
            image: '',
            newType: '',
            discount: '',
            brand: ''
        }
    )

    const [stateProduct, setStateProduct] = useState(init());

    const [stateProductDetails, setStateProductDetails] = useState(init());

    const [form] = Form.useForm();

    const mutation = useMutationHooks(
        (data) => {
            const { rating, name, type, price, countInStock, description, image, discount,brand } = data;
            const res = productService.createProducts({
                rating,
                name,
                type,
                price,
                countInStock,
                description,
                image,
                discount,
                brand
            })
            return res
        });

    const mutationUpdate = useMutationHooks(
        (data) => {
            const { id, access_token, ...rest } = data;
            const res = productService.updateProduct(
                id,
                { ...rest },
                access_token
            )
            return res
        });

    const mutationDelete = useMutationHooks(
        (data) => {
            const { id, access_token } = data;
            const res = productService.deleteProduct(
                id,
                access_token
            )
            return res
        });

    const mutationDeleteMany = useMutationHooks(
        (data) => {
            const { token, ...ids } = data;
            const res = productService.deleteManyProduct(
                ids,
                token
            )
            return res
        });

    const getAllProducts = async () => {
        const res = await productService.getAllProducts()
        return res
    };

    const fetchGetDetailProduct = async (rowSelected) => {
        const res = await productService.getDetailsProducts(rowSelected)
        if (res?.data) {
            setStateProductDetails({
                rating: res?.data?.rating,
                name: res?.data?.name,
                type: res?.data?.type,
                price: res?.data?.price,
                countInStock: res?.data?.countInStock,
                description: res?.data?.description,
                image: res?.data?.image,
                discount: res?.data?.discount,
                brand : res?.data?.brand
            })
        }
        setIsLoadingUpdate(false)
    };

    useEffect(() => {
        if (!isModalOpen) {

            form.setFieldValue(stateProductDetails)
        }
        else {
            form.setFieldValue(init())
        }
    }, [form, stateProductDetails, isModalOpen])

    useEffect(() => {
        if (rowSelected && isOpenDrawer) {
            setIsLoadingUpdate(true)
            fetchGetDetailProduct(rowSelected);
        }
    }, [rowSelected, isOpenDrawer]);

    const handleDeleteManyProduct = (ids) => {
        mutationDeleteMany.mutate({
            ids: ids, token: user?.access_token
        }, {
            onSettled: () => {
                queryProduct.refetch()
            }
        })
    }

    const AllTypeProduct = async () => {
        const res = await productService.getAllTypeProduct();
        return res
    };

    const { data, isLoading, isSuccess, isError } = mutation
    const { data: dataUpdated, isLoading: isLoadingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate
    const { data: dataDeleted, isLoading: isLoadingDeleted, isSuccess: isSuccessDeleted, isError: isErrordeleted } = mutationDelete
    const { data: dataDeletedMany, isSuccess: isSuccessDeletedMany, isError: isErrordeletedMany } = mutationDeleteMany

    const queryProduct = useQuery({ queryKey: ['products'], queryFn: getAllProducts })
    const typeProducts = useQuery({ queryKey: ['type-products'], queryFn: AllTypeProduct })
    const { isLoading: isLoadingProduct, data: products } = queryProduct

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

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <InputComponent
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        }
    });

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            sorter: (a, b) => a.name.length - b.name.length,
            ...getColumnSearchProps('name')
        },
        {
            title: "Image",

        },
        {
            title: 'Price',
            dataIndex: 'price',
            sorter: (a, b) => a.price - b.name.price,
            filters: [
                {
                    text: '>= 50',
                    value: '>=',
                },
                {
                    text: '<= 50',
                    value: '<=',
                },
            ],
            onFilter: (value, record) => {
                if (value === ">=") {
                    return record.price >= 50
                }
                return record.price <= 50
            },
        },
        {
            title: 'Rating',
            dataIndex: 'rating',
       

            sorter: (a, b) => a.rating - b.name.rating,
            filters: [
                {
                    text: '>= 3',
                    value: '>=',
                },
                {
                    text: '<= 3',
                    value: '<=',
                },
            ],
            onFilter: (value, record) => {
                if (value === ">=") {
                    return record.rating >= 3
                }
                return record.rating <= 3
            },
        },
        {
            title: 'Discount',
            dataIndex: 'discount',
        },
        {
            title: 'Type',
            dataIndex: 'type',
        },
        {
            title: 'Stock',
            dataIndex: 'countInStock',
        },
        {
            title : 'Brand',
            dataIndex: 'brand',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: renderAction
        }
    ];

    const dataTable = products?.data?.length && products?.data?.map((product) => {
        return { ...product, key: product._id, isAdmin: product.isAdmin ? "True" : "False" };
    })

    useEffect(() => {
        if (isSuccess && data?.status === 'success') {
            message.success();
            handleCancelCreate();
        } else if (isError) {
            message.error();
        }
    }, [isSuccess, isError])


    useEffect(() => {
        if (isSuccessUpdated && dataUpdated?.status === 'success') {
            message.success();
            handleClose();
        } else if (isErrorUpdated) {
            message.error();
        }
    }, [isSuccessUpdated,isErrorUpdated])

    useEffect(() => {
        if (isSuccessDeleted && dataDeleted?.status === 'success') {
            message.success();
            handleCancelDelete();
        } else if (isErrordeleted) {
            message.error();
        }
    }, [isSuccessDeleted,isErrordeleted])

    useEffect(() => {
        if (isSuccessDeletedMany && dataDeletedMany?.status === 'success') {
            message.success();
        } else if (isErrordeletedMany) {
            message.error();
        }
    }, [isSuccessDeletedMany,isErrordeletedMany])

    const handleOnChangeAvatar = async ({ fileList }) => {
        const file = fileList[0];
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateProduct({
            ...stateProduct,
            image: file.preview
        })
    };

    const handleOnChangeAvatarDetails = async ({ fileList }) => {
        const file = fileList[0];
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateProductDetails({
            ...stateProductDetails,
            image: file.preview
        })
    };

    const handleClose = () => {
        setIsOpenDrawer(false);
        setStateProductDetails({
            rating: '',
            name: '',
            type: '',
            price: '',
            countInStock: '',
            description: '',
            image: '',
            discount: '',
            brand:''
        })
        form.resetFields();
    };

    const handleOnChange = (e) => {
        setStateProduct({
            ...stateProduct,
            [e.target.name]: e.target.value
        })
    };

    const handleOnChangeDetails = (e) => {
        setStateProductDetails({
            ...stateProductDetails,
            [e.target.name]: e.target.value
        })
    };

    const handleCancelCreate = () => {
        setIsModalOpen(false);
        setStateProduct({
            rating: '',
            name: '',
            type: '',
            price: '',
            countInStock: '',
            description: '',
            image: '',
            discount: '',
            brand:''
        })
        form.resetFields();
    };

    const onUpdateProduct = () => {
        mutationUpdate.mutate({ id: rowSelected, ...stateProductDetails, token: user?.access_token }, {
            onSettled: () => {
                queryProduct.refetch()
            }
        })
    }

    const onFinish = () => {
        const params = {
            rating: stateProduct.rating,
            name: stateProduct.name,
            type: stateProduct.type === "add_type" ? stateProduct.newType : stateProduct.type,
            price: stateProduct.price,
            countInStock: stateProduct.countInStock,
            description: stateProduct.description,
            image: stateProduct.image,
            discount: stateProduct.discount,
            brand : stateProduct.brand
        }
        mutation.mutate(params, {
            onSettled: () => {
                queryProduct.refetch()
            }
        })
    };

    const handleCancelDelete = () => {
        setIsModalDelete(false)
    }

    const handleDeleteProduct = () => {
        mutationDelete.mutate({
            id: rowSelected,
            token: user?.access_token
        }, {
            onSettled: () => {
                queryProduct.refetch()
            }
        })
    };

    const handleOnChangeSelect = (value) => {
        setStateProduct({
            ...stateProduct,
            type: value
        })
    };
    
    return (
        <div>
            <WrapperHeaders>Quản lý sản phẩm</WrapperHeaders>
            {
                user?.isAdmin ? (<>

                    <div>
                        <Button onClick={() => setIsModalOpen(true)}><PlusOutlined /></Button>
                    </div>
                    <div style={{ marginTop: '20px' }}>
                        <TableComponent handleDeleteMany={handleDeleteManyProduct} columns={columns} isLoading={isLoadingProduct} data={dataTable} onRow={(record, index) => {
                            return {
                                onClick: event => {
                                    setRowSelected(record._id)
                                }
                            };
                        }} />
                    </div>

                    <ModalComponent title="Tạo sản phẩm" open={isModalOpen} onCancel={handleCancelCreate} footer={null} >
                        <LoadingComponent isLoading={isLoading}>
                            <Form
                                name="basic"
                                labelCol={{
                                    span: 6,
                                }}
                                wrapperCol={{
                                    span: 18,
                                }}
                                onFinish={onFinish}
                                autoComplete="on"
                                form={form}
                            >
                                <Form.Item
                                    label="Name"
                                    name="name"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your Name!',
                                        },
                                    ]}
                                >
                                    <InputComponent name='name' value={stateProduct.name} onChange={handleOnChange} />
                                </Form.Item>

                                <Form.Item
                                    label="Type"
                                    name="type"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your Type!',
                                        },
                                    ]}
                                >
                                    <Select
                                        name='type'
                                        value={stateProduct.type}
                                        onChange={handleOnChangeSelect}
                                        options={renderOptions(typeProducts?.data?.data)}
                                    />
                                </Form.Item>

                                {
                                    stateProduct.type === "add_type" && (
                                        <Form.Item
                                            label="New Type"
                                            name="newType"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please input your New Type!',
                                                },
                                            ]}
                                        >
                                            <InputComponent name='newType' value={stateProduct.newType} onChange={handleOnChange} />
                                        </Form.Item>
                                    )
                                }

                                <Form.Item
                                    label="Count In Stock"
                                    name="countInStock"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your Count In Stock!',
                                        },
                                    ]}
                                >
                                    <InputComponent name='countInStock' value={stateProduct.countInStock} onChange={handleOnChange} />
                                </Form.Item>

                                <Form.Item
                                    label="Price"
                                    name="price"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your Price!',
                                        },
                                    ]}
                                >
                                    <InputComponent name='price' value={stateProduct.price} onChange={handleOnChange} />
                                </Form.Item>

                                <Form.Item
                                    label="Brand"
                                    name="brand"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your Brand!',
                                        },
                                    ]}
                                >
                                    <InputComponent name='brand' value={stateProduct.brand} onChange={handleOnChange} />
                                </Form.Item>

                                <Form.Item
                                    label="Rating"
                                    name="rating"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your Rating!',
                                        },
                                    ]}
                                >
                                    <InputComponent name='rating' value={stateProduct.rating} onChange={handleOnChange} />
                                </Form.Item>

                                <Form.Item
                                    label="Discount"
                                    name="discount"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your Discount!',
                                        },
                                    ]}
                                >
                                    <InputComponent name='discount' value={stateProduct.discount} onChange={handleOnChange} />
                                </Form.Item>

                                <Form.Item
                                    label="Description"
                                    name="description"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your Description!',
                                        },
                                    ]}
                                >
                                    <InputComponent name='description' value={stateProduct.description} onChange={handleOnChange} />
                                </Form.Item>

                                <Form.Item
                                    label="Image"
                                    name="image"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your Image!',
                                        },
                                    ]}
                                >
                                    <WrapperUploadFile onChange={handleOnChangeAvatar} maxCount={1}>
                                        <Button >Select File</Button>
                                        {
                                            stateProduct?.image && (<img src={stateProduct?.image} alt='avatar' style={{ marginLeft: '10px', width: '70px', height: '70px', borderRadius: "10%", objectFit: "cover" }} />)
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
                                        Submit
                                    </Button>
                                </Form.Item>
                            </Form>
                        </LoadingComponent>
                    </ModalComponent>

                    <DrawerComponent width='40%' title='Chi tiết sản phẩm' isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)}>
                        <LoadingComponent isLoading={isLoadingUpdated || isLoadingUpdate}>
                            <Form
                                name="basic"
                                labelCol={{
                                    span: 5,
                                }}
                                wrapperCol={{
                                    span: 19,
                                }}
                                onFinish={onUpdateProduct}
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
                                    {stateProductDetails?.name && ""}
                                    <InputComponent value={stateProductDetails['name'] && stateProductDetails.name} onChange={handleOnChangeDetails} name='name' />
                                </Form.Item>

                                <Form.Item
                                    label="Type"
                                    name="type"
                                    rules={[
                                        {
                                            required: false,
                                            message: 'Please input your Type!',
                                        },
                                    ]}
                                >
                                    {stateProductDetails?.type && ""}
                                    <InputComponent value={stateProductDetails?.type} onChange={handleOnChangeDetails} name='type' />
                                </Form.Item>

                                <Form.Item
                                    label="Count In Stock"
                                    name="countInStock"
                                    rules={[
                                        {
                                            required: false,
                                            message: 'Please input your Count In Stock!',
                                        },
                                    ]}
                                >
                                    {stateProductDetails?.countInStock === 0 ? "" : ""}
                                    <InputComponent value={stateProductDetails?.countInStock} onChange={handleOnChangeDetails} name='countInStock' />
                                </Form.Item>

                                <Form.Item
                                    label="Price"
                                    name="price"
                                    rules={[
                                        {
                                            required: false,
                                            message: 'Please input your Price!',
                                        },
                                    ]}
                                >
                                    {stateProductDetails.price && ""}
                                    <InputComponent value={stateProductDetails.price} onChange={handleOnChangeDetails} name='price' />
                                </Form.Item>

                                <Form.Item
                                    label="Brand"
                                    name="brand"
                                    rules={[
                                        {
                                            required: false,
                                            message: 'Please input your Brand!',
                                        },
                                    ]}
                                >
                                    {stateProductDetails.brand && ""}
                                    <InputComponent value={stateProductDetails.brand} onChange={handleOnChangeDetails} name='brand' />
                                </Form.Item>

                                <Form.Item
                                    label="Rating"
                                    name="rating"
                                    rules={[
                                        {
                                            required: false,
                                            message: 'Please input your Rating!',
                                        },
                                    ]}
                                >
                                    {stateProductDetails?.rating && ""}
                                    <InputComponent name='rating' value={stateProductDetails.rating} onChange={handleOnChangeDetails} />
                                </Form.Item>

                                <Form.Item
                                    label="Discount"
                                    name="discount"
                                    rules={[
                                        {
                                            required: false,
                                            message: 'Please input your Discount!',
                                        },
                                    ]}
                                >
                                    {stateProductDetails?.discount && ""}
                                    <InputComponent name='discount' value={stateProductDetails.discount} onChange={handleOnChangeDetails} />
                                </Form.Item>

                                <Form.Item
                                    label="Description"
                                    name="description"
                                    rules={[
                                        {
                                            required: false,
                                            message: 'Please input your Description!',
                                        },
                                    ]}
                                >
                                    {stateProductDetails?.description && ""}
                                    <InputComponent name='description' value={stateProductDetails.description} onChange={handleOnChangeDetails} />
                                </Form.Item>

                                <Form.Item
                                    label="Image"
                                    name="image"
                                    rules={[
                                        {
                                            required: false,
                                            message: 'Please input your Image!',
                                        },
                                    ]}
                                >
                                    <WrapperUploadFile onChange={handleOnChangeAvatarDetails} maxCount={1}>
                                        <Button >Select File</Button>
                                        {
                                            stateProductDetails?.image && (<img src={stateProductDetails?.image} alt='avatar' style={{ marginLeft: '10px', width: '70px', height: '70px', borderRadius: "10%", objectFit: "cover" }} />)
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
                </>
                ) : ''
            }

        </div>
    )
}

export default AdminProduct