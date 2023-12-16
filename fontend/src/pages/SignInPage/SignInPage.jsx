import React, { useEffect, useState } from 'react'
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './style'
import InputForm from '../../components/InputForm/InputForm'
import ButtonComponents from '../../components/ButtonComponents/ButtonComponents'
import { Image} from 'antd'
import logo from '../../assets/images/logo-login.png'
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMutationHooks } from '../../hooks/useMutationHook'
import * as userService from '../../services/userService'
import { LoadingComponent } from '../../components/LoadingComponent/LoadingComponent'
import jwt_decode from "jwt-decode"
import { useDispatch } from 'react-redux'
import { updateUser } from '../../redux/slides/userSlice'

const SignInPage = () => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const mutitation = useMutationHooks(
    data => userService.loginUser(data)
  )

  const { isLoading, data, isSuccess } = mutitation;
  console.log(data)

  useEffect(() => {
    if (isSuccess) {
      if (location?.state) {
        navigate(location?.state);
      } else {
        navigate('/');
      }
      localStorage.setItem('access_token', JSON.stringify(data?.access_token))
      if (data?.access_token) {
        const decoded = jwt_decode(data?.access_token)
        if (decoded?.id) {
          handleGetDetailsUser(decoded?.id, data?.access_token)
        }
      }
    }

  }, [isSuccess]);

  const handleGetDetailsUser = async (id, token) => {
    const res = await userService.getUsersDetail(id, token)
    dispatch(updateUser({ ...res?.data, access_token: token }))
  }
  const handleOnChangeEmail = (value) => {
    setEmail(value)
  };

  const handleOnChangePassword = (value) => {
    setPassword(value)
  };

  const handleSignin = () => {
    mutitation.mutate({
      email,
      password
    })
  };

  const handleSignup = () => {
    navigate('/sign-up');
  }
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#787878', height: '91.5vh' }}>
      <div style={{ width: '800px', height: "445px", borderRadius: '6px', background: '#fff', display: 'flex' }}>
        <WrapperContainerLeft>
          <h1 style={{ marginBottom: '0' }}>Xin Chào</h1>
          <p style={{ marginTop: '5px' }}>Đăng nhập hoặc Tạo Tài Khoản</p>
          <InputForm style={{ marginBottom: "20px" }} placeholder='abc@gmail.com' value={email} onChange={handleOnChangeEmail} />
          <div style={{ position: 'relative' }}>
            <span
              onClick={() => setIsShowPassword(!isShowPassword)}
              style={{ zIndex: 20, position: "absolute", top: "4px", right: "15px", fontWeight: "bold", fontSize: "17px", userSelect: 'none', cursor: 'pointer', }}>
              {isShowPassword ? (<EyeFilled />) : (<EyeInvisibleFilled />)}
            </span>
            <InputForm type={isShowPassword ? "text" : "password"} placeholder='password' value={password} onChange={handleOnChangePassword} />
          </div>
          {
            data?.status === 'error' && <span style={{ color: "red" }}>{data.message}</span>
          }
          <LoadingComponent isLoading={isLoading}>
            <ButtonComponents
              // disabled
              disabled={!email.length || !password.length}
              onClick={handleSignin}
              size={40} styleButton={
                { margin: '26px 0 10px', color: '#fff', background: 'rgb(255,57,69)', height: '40px', width: '100%', border: 'none', borderRadius: '5px' }
              } textbutton='Đăng Nhập' />
          </LoadingComponent>
          <p><WrapperTextLight>Quên mật khẩu</WrapperTextLight></p>
          <p>Chưa có tài khoản ? <WrapperTextLight onClick={handleSignup}>Tạo tài khoản</WrapperTextLight></p>
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

export default SignInPage