import { Col, Image, InputNumber } from "antd";
import styled from "styled-components";

export const WrapperStyleImageSmall = styled(Image)`
  height: 64px;
  width: 64px;
`;

export const WrapperStyleColImage = styled(Col)`
  flex-basis: unset;
  display: flex;
`;

export const WrapperStyleNameProduct = styled.h1`
  color: rgb(39, 39, 42);
  font-size: 20px;
  font-weight: 500;
  line-height: 150%;
  word-break: break-word;
  white-space: break-spaces;
`;

export const WrapperStyleTextSell = styled.span`
  line-height: 24px;
  font-size: 15px;
  color: rgb(120, 120, 120);
`;

export const WrapperStylePrice = styled.div`
  border-radius: 4px;
  background: rgb(250, 250, 250);
`;

export const WrapperStyleTextPrice = styled.h1`
  font-size: 32px;
  line-height: 40px;
  margin-right: 8px;
  font-weight: 500;
  padding: 10px;
  margin-top: 10px;
`;

export const WrapperStyleAddress = styled.div`
  span.address {
    text-decoration: underline;
    font-size: 15px;
    line-height: 24px;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  span.change-address {
    color: rgb(11, 116, 229);
    font-size: 16px;
    line-height: 24px;
    font-weight: 500;
  }
`;

export const WrapperStyleQuantity = styled.h1`
  display: flex;
  span {
    font-size: 25px;
    padding: 0 5px;
    line-height: 28px;
  }
`;

export const WrapperButtonQuantity = styled.div`
  border-radius: 5px;
  border: 1px solid;
  text-align: center;
  line-height: 2px;
  padding: 5px;
  cursor: pointer;
`;

export const WrapperInputNumber = styled(InputNumber)`
  &.ant-input-number.ant-input-number-sm {
    width: 40px;
  }
  &:where(.css-dev-only-do-not-override-pr0fja).ant-input-number
    .ant-input-number-input {
    text-align: center !important;
    margin: 2px 0 0 0;
    cursor: none;
    border-color: #fff;
  }
  & .ant-input-number-handler-wrap {
    display: none !important;
  }
`;
