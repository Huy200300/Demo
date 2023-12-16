import styled from "styled-components";
import ButtonComponents from "../../components/ButtonComponents/ButtonComponents";

export const WrapperPadding = styled.div`
  padding: 0 120px;
`;

export const WrapperTypeProduct = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  justify-content: flex-start;
  border-bottom: 1px solid;
  height: 44px;
`;

export const WrapperButtonMore = styled(ButtonComponents)`
  &:hover {
    color: #fff;
    background: rgb(13, 93, 182);
    span {
      color: #fff;
      font-bold: 500;
    }
  }
  width: 100%;
  text-align: center;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
`;

export const WrapperProductList = styled.div`
  display: flex;
  gap: 10px;
  margin: 10px 0 0 0;
  position: relative;
  overflow: hidden;
  justify-content: space-around;
`;

export const WrapperProductListLo = styled.div`
  display: grid;
  grid-template-columns: auto auto auto auto auto;
  gap: 10px;
  margin: 10px 0 20px 0;
  position: relative; 
`;

export const WrapperButtonMoreDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px 0 0 0;
  width: 100%;
`;

export const WrapperSilder = styled.div`
  background: #e7e9eb;
  box-shadow: 1px 1px 10px 1px #888888;
  width: 100%;
`;

export const WrapperBrand = styled.div`
  &:hover {
    background: blue;
    color: #fff;
  }
  cursor: pointer;
  border: 1px solid ;
  padding: 5px;
  border-radius: 9px
`;
