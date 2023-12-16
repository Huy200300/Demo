import { UserOutlined, AppstoreOutlined, ShoppingCartOutlined, ShoppingOutlined } from '@ant-design/icons'
import { Card, Space, Statistic } from 'antd';

const CustomizedContent = ({title,value,icon}) => {
  return (
    <div>
      <Card>
        <Space direction='horizontal'>
          {icon}
          <Statistic title={title} value={value}/>
        </Space>
      </Card>
    </div>
  );
};

export default CustomizedContent;