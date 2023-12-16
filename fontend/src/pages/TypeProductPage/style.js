import styled from "styled-components";
import { Row, Col } from "antd";

export const WrapperApp = styled(Row)`
  flex-wrap: nowrap;
  padding-top: 10px;
  height:calc(100%-20px);
`;

export const WrapperProduct = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 20px;
`;

export const WrapperNav = styled(Col)`
  background: #fff;
  margin-right: 10px;
  padding: 10px;
  border-radius: 6px;
  height: fit-content;
  margin-top: 20px;
  width: 200px;
`;
