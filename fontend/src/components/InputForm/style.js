import styled from "styled-components";
import { Input } from "antd";

export const WrapperInputStyle = styled(Input)`
  border-top: none;
  border-left: none;
  border-right: none;
  box-sizing: border-box;
  // background-color:black;
  // color:#fff;
  // &::placeholder{
  //   color:#fff;
  // }
  &:focus {
    background-color: rbg(232, 240, 254);
    outline:none
  }
`;
