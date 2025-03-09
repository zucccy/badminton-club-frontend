import { addClub, removeClub, clubList, updateRule } from '@/services/ant-design-pro/api';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProDescriptions,
  ProFormText,
  ProFormGroup,
  ProTable,

} from '@ant-design/pro-components';
import '@umijs/max';
import { Button, Drawer, message, Upload, Spin } from 'antd';
import React, { useRef, useState } from 'react';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
const ExportJsonExcel = require('js-export-excel');


/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */
const handleAdd = async (fields: API.ClubListItem) => {
  const hide = message.loading('正在添加');
  try {
    const response = await addClub({
      ...fields,
    });
    hide();
    if (response?.code === 200) {
        message.success('添加成功，俱乐部ID为' + response?.data);
        return true;
    } else {
      message.error('添加失败，请重试！原因是：' + response?.msg);
      return false;
    }
  } catch (error) {
    hide();
    message.error('添加失败，请重试！');
    return false;
  }
};

/**
 * @en-US Update node
 * @zh-CN 更新节点
 *
 * @param fields
 */
// const handleUpdate = async (fields: FormValueType) => {
//   const hide = message.loading('Configuring');
//   try {
//     await updateRule({
//       name: fields.name,
//       desc: fields.desc,
//       key: fields.id,
//     });
//     hide();
//     message.success('Configuration is successful');
//     return true;
//   } catch (error) {
//     hide();
//     message.error('Configuration failed, please try again!');
//     return false;
//   }
// };

/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.ClubListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    const response = await removeClub({
      idList: selectedRows.map((row) => parseInt(row.id)),
    });
    hide();
    if (response?.code === 200) {
        message.success('删除成功，共计删除俱乐部' + response?.data + "个");
        return true;
    } else {
        message.error('删除失败，请重试！原因是：' + response?.msg)
    }
  } catch (error) {
    hide();
    message.error('删除失败，请重试！');
    return false;
  }
};
const TableList: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.ClubListItem>();
  const [selectedRowsState, setSelectedRows] = useState<API.ClubListItem[]>([]);

  const columns: ProColumns<API.ClubListItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      tip: 'The id is the unique key',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '俱乐部名称',
      dataIndex: 'club_name',
    },
    {
      title: '创建时间',
      sorter: true,
      search: false,
      dataIndex: 'create_time',
      valueType: 'dateTime',
    },
    {
      title: '修改时间',
      sorter: true,
      search: false,
      dataIndex: 'update_time',
      valueType: 'dateTime',
    },
  ];
  return (
    <PageContainer>
      <ProTable<API.ClubListItem, API.PageParams>
        headerTitle={'俱乐部信息'}
        actionRef={actionRef}
        rowKey="id"
        pagination={{
          showQuickJumper: true
        }}
        search={{
          labelWidth: 120
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalOpen(true);
            }}
          >
            <PlusOutlined /> 新增俱乐部
          </Button>
        ]}
        request={async (params: any, sort: Record<string, SortOrder>, filter: Record<string, (string | number)[] | null>) => {
          const response = await clubList({
            ...params,
            sort
          });
        if (response?.data) {
          return  {
            data: response?.data.records || [],
            success: true,
            total: response.total,
          }
        }
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择{' '}
              <a
                style={{
                  fontWeight: 600,
                }}
              >
                {selectedRowsState.length}
              </a>{' '}
              项 &nbsp;&nbsp;
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            批量删除
          </Button>
          {/* <Button type="primary">批量审批</Button> */}
        </FooterToolbar>
      )}
      <ModalForm
        title={'添加俱乐部'}
        width="600px"
        open={createModalOpen}
        onOpenChange={handleModalOpen}
        onFinish={async (value) => {
          const success = await handleAdd(value as API.ClubListItem);
          if (success) {
            handleModalOpen(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
      <ProFormGroup>
        <ProFormText
        label="俱乐部名称"
          rules={[
            {
              required: true,
              message: '俱乐部名称为必填项',
            },
          ]}
          placeholder="请输入俱乐部名称"
          width="sm"
          name="club_name"
        />
      </ProFormGroup>
      </ModalForm>
      <UpdateForm
        onSubmit={async (value) => {
          const success = await handleUpdate(value);
          if (success) {
            handleUpdateModalOpen(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalOpen(false);
          if (!showDetail) {
            setCurrentRow(undefined);
          }
        }}
        updateModalOpen={updateModalOpen}
        values={currentRow || {}}
      />

      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<API.MemberListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<API.MemberListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};
export default TableList;
