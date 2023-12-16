import { Image } from 'antd';
import React from 'react';
import { WrapperSliderStyles } from './style';

const SliderComponent = ({ arrImages }) => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 1000,
    };
    return (
        <div>
            <h2> Single Item</h2>
            <WrapperSliderStyles {...settings}>
                {arrImages.map((image) => {
                    return (
                        <Image key={image} src={image} alt="silder" preview={false} width='100%' />
                    )
                })}
            </WrapperSliderStyles>
        </div>
    )
};

export default SliderComponent;