import { Spin } from 'antd'
import React from 'react'

export const LoadingComponent = ({children ,isLoading,delay=200}) => {
  return (
    <Spin  spinning={isLoading} delay={delay} size="large" >
        {children}
    </Spin>
  )
}


