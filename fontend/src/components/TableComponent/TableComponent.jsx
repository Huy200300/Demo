import React, { useState } from 'react'
import { Dropdown, Space, Table } from 'antd';
import { LoadingComponent } from '../LoadingComponent/LoadingComponent';
import { DownOutlined } from '@ant-design/icons';
import { Excel } from 'antd-table-saveas-excel';
import { useMemo } from 'react';

const TableComponent = (props) => {
    const { selectionType = 'checkbox', data: dataSource = [], isLoading = false, columns = [], handleDeleteMany } = props
    const [rowSelectedKeys, setRowSelectedKeys] = useState([])
    const columnExport = useMemo(() => {
        const arr = columns?.filter((col) => col.dataIndex !== 'action')
        return arr
    }, [columns]);

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setRowSelectedKeys(selectedRowKeys);
        },
        // getCheckboxProps: (record) => ({
        //     disabled: record.name === 'Disabled User',
        //     name: record.name,
        // }),
    };
    const handleDeleteAll = () => {
        handleDeleteMany(rowSelectedKeys)
    }

    const items = [
        {
            label: (
                <div onClick={handleDeleteAll}>
                    Xoá tất cả
                </div>
            ),
            key: '0',
        },
        {
            label: (
                <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
                    2nd menu item
                </a>
            ),
            key: '1',
        },
    ];

    const handleExportExcel = () => {
        const excel = new Excel();
        excel.addSheet('test')
            .addColumns(columnExport)
            .addDataSource(dataSource, {
                str2Percent: true,
            })
            .saveAs('Excel.xlsx')
    };

    return (
        <LoadingComponent isLoading={isLoading}>
            {rowSelectedKeys.length > 0 && (
                <div>
                    <Dropdown menu={{ items }}>
                        <span onClick={(e) => e.preventDefault()}>
                            <Space>
                                Hover me
                                <DownOutlined />
                            </Space>
                        </span>
                    </Dropdown>
                </div>
            )}
            <button onClick={handleExportExcel}> Export Excel</button>
            <Table
                id='table-xls'
                rowSelection={{
                    type: selectionType,
                    ...rowSelection,
                }}
                columns={columns}
                dataSource={dataSource}
                {...props}
            />
        </LoadingComponent>
    )
}

export default TableComponent