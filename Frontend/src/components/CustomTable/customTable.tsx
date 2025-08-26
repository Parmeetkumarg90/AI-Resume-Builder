import { useMemo } from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface CustomTableProps<T> {
    data: T[] | null;
    headers: ColumnsType<T>;
    loading?: boolean;
}

function CustomTable<T extends Object>({ data, headers, loading }: CustomTableProps<T>) {
    const processedData = useMemo(() => {
        if (data && data.length > 0) {
            return data.map((elem, index) => {
                return ({
                    key: (elem as any)?.id ?? String(index),
                    rowIndex: index + 1,
                    ...elem
                });
            });
        }
    }, [data]);

    return (
        <>
            <Table
                dataSource={processedData}
                columns={headers}
                loading={loading}
                className="shadow-md rounded-lg p-2 text-center"
                scroll={{ x: 800 }}
            />
        </>
    );
}

export default CustomTable;