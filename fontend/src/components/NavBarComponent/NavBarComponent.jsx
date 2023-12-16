import React from 'react'
import { WrapperLableText, WrapperTextValue, WrapperContent,WrapperTextPrice } from './style'
import { Checkbox, Rate } from 'antd'

const NavBarComponent = () => {
    const onChange = () => { };
    const renderContent = (type, option) => {
        switch (type) {
            case 'text':
                return option.map(option => {

                    return <WrapperTextValue key={option}>{option}</WrapperTextValue>


                })
            case 'checkbox':
                return (
                    <Checkbox.Group style={{ width: '100%', display: 'flex', flexDirection: "column", gap: '12px' }} onChange={onChange}>
                        {
                            option.map(option => {
                                return <Checkbox key={option} value={option.value}>{option.text}</Checkbox>
                            })
                        }

                    </Checkbox.Group>
                )
            case 'star':
                return option.map((option)=>{
                    return(
                        <div style={{display:"flex",gap:"10px"}}>
                        <Rate key={option} style={{fontSize:'12px'}} disabled defaultValue={option}/>
                        <span>{`tu ${option} sao`}</span>
                        </div>
                    )
                })
            case 'price':
                return option.map((option)=>{
                    return(
                        <WrapperTextPrice key={option}>
                        <span>{option}</span>
                        <span>đ</span>
                        </WrapperTextPrice>
                    )
                })
            default:
                return {}
        }
    }
    return (
        <div>
            <WrapperLableText>lable</WrapperLableText>
            <WrapperContent>
                {
                    renderContent('text', ['Tu Lanh', 'Tv', 'May Giat'])
                }

                {/* {
                    renderContent('checkbox', [
                        { value: 'a', text: "A" },
                        { value: 'b', text: "B" }
                    ])
                }

                {
                    renderContent('star', [1, 2, 3, 4, 5])
                }


                {
                    renderContent('price', ['duoi 40','tren 50.000'])
                } */}
            </WrapperContent>
        </div>
    )
}

export default NavBarComponent