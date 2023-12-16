import { Upload } from "antd";
import styled from "styled-components";

export const WrapperHeaders = styled.h1`
  color: black;
  font-size: 14px;
`;

export const WrapperUploadFile = styled(Upload)`
  & .ant-uoload.ant-upload-select..ant-upload-select-picture-card {
    width: 60px;
    height: 60px;
    border-radius: 50%;
  }
  & .ant-upload-list-item.ant-upload-list-item-error {
    display: none;
  }
  & .ant-upload-list.ant-upload-list-text {
    display: none;
  }
  & .ant-upload {
    display: flex;
  }
  & .ant-btn {
    align-items: center;
  }
`;

export const WrapperImage = styled.img`
margin-left: 10px;
width: 70px;
height: 70px;
border-radius: 10%;
objectFit: cover;
`;
