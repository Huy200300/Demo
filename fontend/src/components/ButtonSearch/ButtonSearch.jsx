import { SearchOutlined } from "@ant-design/icons";
import React from "react";

import { Button, Input } from "antd";
import InputComponent from "../InputComponent/InputComponent";
import ButtonComponents from "../ButtonComponents/ButtonComponents";

const ButtonSearch = (props) => {
    const { size, placeholder, bordered, backgroundColorInput, textbutton = "#ffff",
        backgroundColorButton = "rgb(13,92,182)",
        colorButton = "#fff" } = props;
    return (
        <div style={{ display: "flex" }}>
            <InputComponent
                size={size}
                placeholder={placeholder}
                bordered={bordered}
                style={{ backgroundColor: backgroundColorInput }} 
                {...props}
                />
            <ButtonComponents
                size={size}
                styleButton={{ background: backgroundColorButton,color:colorButton, border: !bordered && "none" }}
                icon={<SearchOutlined color={colorButton} />}
                textbutton={textbutton}
            />
                
        </div>
    )
}

export default ButtonSearch;