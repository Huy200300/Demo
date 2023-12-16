import React, { useEffect, useState } from 'react'
import { WrapperContentProfile, WrapperHeader, WrapperLabel, WrapperInput, WrapperUploadFile } from './style'
import InputForm from '../../components/InputForm/InputForm'
import ButtonComponents from '../../components/ButtonComponents/ButtonComponents';
import { LoadingComponent } from '../../components/LoadingComponent/LoadingComponent'
import { useDispatch, useSelector } from 'react-redux';
import * as userService from '../../services/userService'
import { useMutationHooks } from '../../hooks/useMutationHook';
import * as message from '../../components/Message/Message'
import { updateUser } from '../../redux/slides/userSlice';
import { Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { getBase64 } from '../../untils';

const ProfilePage = () => {
    const user = useSelector((state) => state.user);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [avatar, setAvatar] = useState('');


    const mutation = useMutationHooks(
        (data) => {
            const { id, access_token, ...rests } = data;
            userService.updateUsers(id, rests, access_token)
        }
    )
    const dispatch = useDispatch();
    const { data, isLoading, isSuccess, isError } = mutation;

    useEffect(() => {
        setEmail(user?.email)
        setName(user?.name)
        setPhone(user?.phone)
        setAddress(user?.address)
        setAvatar(user?.avatar)
    }, [user])

    useEffect(() => {
        if (isSuccess) {
            message.success();
            handleUpdateUser(user?.id, user?.access_token)
        } else if (isError) {
            message.error();
        }
    }, [isSuccess, isError])

    const handleUpdateUser = async (id, token) => {
        const res = await userService.getUsersDetail(id, token)
        dispatch(updateUser({ ...res?.data, access_token: token }))
    }

    const handleOnChangeEmail = (value) => {
        setEmail(value);
    };
    const handleOnChangeName = (value) => {
        setName(value);
    };
    const handleOnChangePhone = (value) => {
        setPhone(value);
    };
    const handleOnChangeAvatar = async ({ fileList }) => {
        const file = fileList[0];
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setAvatar(file.preview)
    };
    const handleOnChangeAddress = (value) => {
        setAddress(value);
    };
    const handleUpdate = () => {
        mutation.mutate({ id: user?.id, email, name, phone, avatar, address, access_token: user?.access_token });
    };
    return (
        <div style={{ width: "1270px", margin: "0 auto", height: "500px" }}>
            <WrapperHeader>Thông tin người dùng</WrapperHeader>
            <LoadingComponent isLoading={isLoading}>
                <WrapperContentProfile>
                    <WrapperInput>
                        <WrapperLabel htmlFor='name'>Name</WrapperLabel>
                        <InputForm id='name' value={name} onChange={handleOnChangeName} />
                        <ButtonComponents

                            onClick={handleUpdate}
                            size={40} styleButton={
                                { color: '#fff', background: 'rgb(26,148,255)', height: '30px', width: 'fit-content', border: 'none', borderRadius: '5px' }
                            } textbutton='Cập Nhật' />
                    </WrapperInput>

                    <WrapperInput>
                        <WrapperLabel htmlFor='email'>Email</WrapperLabel>
                        <InputForm id='email' value={email} onChange={handleOnChangeEmail} />
                        <ButtonComponents

                            onClick={handleUpdate}
                            size={40} styleButton={
                                { color: '#fff', background: 'rgb(26,148,255)', height: '30px', width: 'fit-content', border: 'none', borderRadius: '5px' }
                            } textbutton='Cập Nhật' />
                    </WrapperInput>

                    <WrapperInput>
                        <WrapperLabel htmlFor='address'>Address</WrapperLabel>
                        <InputForm id='address' value={address} onChange={handleOnChangeAddress} />
                        <ButtonComponents

                            onClick={handleUpdate}
                            size={40} styleButton={
                                { color: '#fff', background: 'rgb(26,148,255)', height: '30px', width: 'fit-content', border: 'none', borderRadius: '5px' }
                            } textbutton='Cập Nhật' />
                    </WrapperInput>

                    <WrapperInput>
                        <WrapperLabel htmlFor='phone'>Phone</WrapperLabel>
                        <InputForm id='phone' value={phone} onChange={handleOnChangePhone} />
                        <ButtonComponents

                            onClick={handleUpdate}
                            size={40} styleButton={
                                { color: '#fff', background: 'rgb(26,148,255)', height: '30px', width: 'fit-content', border: 'none', borderRadius: '5px' }
                            } textbutton='Cập Nhật' />
                    </WrapperInput>

                    <WrapperInput>
                        <WrapperLabel >Avatar</WrapperLabel>
                        <WrapperUploadFile onChange={handleOnChangeAvatar} maxCount={1}>
                            <Button icon={<UploadOutlined />}>Select File</Button>
                        </WrapperUploadFile>
                        {
                            avatar && (<img src={avatar} alt='avatar' style={{ width: '100px', height: '100px', borderRadius: "50%", objectFit: "cover" }} />)
                        }
                        <ButtonComponents

                            onClick={handleUpdate}
                            size={40} styleButton={
                                { color: '#fff', background: 'rgb(26,148,255)', height: '30px', width: 'fit-content', border: 'none', borderRadius: '5px' }
                            } textbutton='Cập Nhật' />
                    </WrapperInput>

                </WrapperContentProfile>
            </LoadingComponent>
        </div>
    )
}

export default ProfilePage