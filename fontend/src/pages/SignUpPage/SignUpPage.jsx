import React, { useEffect, useState } from 'react'
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './style'
import InputForm from '../../components/InputForm/InputForm'
import ButtonComponents from '../../components/ButtonComponents/ButtonComponents'
import { Image } from 'antd'
import logo from '../../assets/images/logo-login.png'
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import * as userService from '../../services/userService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import { LoadingComponent } from '../../components/LoadingComponent/LoadingComponent'
import * as message from '../../components/Message/Message'

const SignUpPage = () => {
  const [isShowPassword, setIsShowPassword] = useState(false)
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const navigate = useNavigate();

  const mutitation = useMutationHooks(
    data => userService.SignUpUser(data)
  )

  const { isLoading, data, isSuccess , isError } = mutitation;

  useEffect(()=>{
     if (isSuccess) {
      message.success();
      handleLogin();
     }else if(isError) {
      message.error()
     }
  },[isSuccess , isError])

  const handleOnChangeEmail = (value) => {
    setEmail(value)
  };

  const handleOnChangeName = (value) => {
    setName(value)
  };

  const handleOnChangePhone = (value) => {
    setPhone(value)
  };

  const handleOnChangePassword = (value) => {
    setPassword(value)
  };

  const handleOnChangeConfirmPassword = (value) => {
    setConfirmPassword(value)
  };

  const handleLogin = () => {
    navigate('/sign-in');
  };

  const handleLogout = () => {
    mutitation.mutate({
      name,
      email,
      password,
      confirmPassword,
      phone
    })
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#787878', height: '91.5vh' }}>
      <div style={{ width: '800px', height: "520px", borderRadius: '6px', background: '#fff', display: 'flex' }}>
        <WrapperContainerLeft>
          <h1 style={{ marginBottom: '0' }}>Xin Chào</h1>
          <p style={{ marginTop: '5px' }}>Đăng nhập hoặc Tạo Tài Khoản</p>
          <InputForm style={{ marginBottom: "20px" }} placeholder='name:abc' value={name} onChange={handleOnChangeName} />
          <InputForm style={{ marginBottom: "20px" }} placeholder='abc@gmail.com' value={email} onChange={handleOnChangeEmail} />
          <InputForm style={{ marginBottom: "20px" }} placeholder='phone:0987654321' value={phone} onChange={handleOnChangePhone} />
          <div style={{ position: 'relative' }}>
            <span
              onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
              style={{ zIndex: '10', position: 'absolute', top: '4px', right: '15px',fontSize:"medium" }}>
              {isShowConfirmPassword ? (<EyeFilled />) : (<EyeInvisibleFilled />)}
            </span>
            <InputForm type={isShowConfirmPassword ? "text" : "password"} placeholder='password' value={password} onChange={handleOnChangePassword} style={{ marginBottom: "20px" }} />
          </div>
          <div style={{ position: 'relative' }}>
            <span
              onClick={() => setIsShowPassword(!isShowPassword)}
              style={{ zIndex: '10', position: 'absolute', top: '4px', right: '15px',fontSize:"medium" }}>
              {isShowPassword ? (<EyeFilled />) : (<EyeInvisibleFilled />)}
            </span>
            <InputForm type={isShowPassword ? "text" : "password"} placeholder='Xác nhận mật khẩu' value={confirmPassword} onChange={handleOnChangeConfirmPassword} />
          </div>
          {
            data?.status === 'error' && <span style={{ color: "red",marginTop:"10px" }}>{data.message}</span>
          }
          <LoadingComponent isLoading={isLoading}>
            <ButtonComponents
              disabled={!email.length || !password.length || !confirmPassword.length}
              onClick={handleLogout}
              size={40} styleButton={
                { margin: '26px 0 10px', color: '#fff', background: 'rgb(255,57,69)', height: '40px', width: '100%', border: 'none', borderRadius: '5px' }
              } textbutton='Đăng Ký' />
          </LoadingComponent>
          <p>Bạn đã có tài khoản ? <WrapperTextLight onClick={handleLogin}>Đăng nhập</WrapperTextLight></p>
          <p></p>
        </WrapperContainerLeft>
        <WrapperContainerRight>
          <div>
            <Image src={logo} alt='logo-login' preview={false} width='204px' height='204px' />
          </div>
        </WrapperContainerRight>
      </div>
    </div>
  )
}

export default SignUpPage