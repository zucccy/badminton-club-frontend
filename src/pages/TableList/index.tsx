import { addRule, removeRule, member, updateRule, importMemberList, downloadTemplate } from '@/services/ant-design-pro/api';
import { PlusOutlined, UploadOutlined, ExportOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProDescriptions,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import '@umijs/max';
import { Button, Drawer, Input, message, Upload, Spin } from 'antd';
import React, { useRef, useState } from 'react';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import { v4 as uuidv4 } from 'uuid';
const ExportJsonExcel = require('js-export-excel');

/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */
const handleAdd = async (fields: API.MemberListItem) => {
  const hide = message.loading('正在添加');
  try {
    await addRule({
      ...fields,
    });
    hide();
    message.success('Added successfully');
    return true;
  } catch (error) {
    hide();
    message.error('Adding failed, please try again!');
    return false;
  }
};

/**
 * @en-US Update node
 * @zh-CN 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('Configuring');
  try {
    await updateRule({
      name: fields.name,
      desc: fields.desc,
      key: fields.id,
    });
    hide();
    message.success('Configuration is successful');
    return true;
  } catch (error) {
    hide();
    message.error('Configuration failed, please try again!');
    return false;
  }
};

/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.MemberListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removeRule({
      key: selectedRows.map((row) => row.id),
    });
    hide();
    message.success('Deleted successfully and will refresh soon');
    return true;
  } catch (error) {
    hide();
    message.error('Delete failed, please try again');
    return false;
  }
};
const TableList: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [importModalOpen, handleImportModalOpen] = useState<boolean>(false);
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.MemberListItem>();
  const [selectedRowsState, setSelectedRows] = useState<API.MemberListItem[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [exportExcelLoading, setExportExcelLoading] = useState(false); //导出loading
  const [tableData, setTableData] = useState<API.MemberListItem[]>([]);


  const downloadMemberTemplate = async() => {
    try {
      const response = await downloadTemplate();
      const urlObj = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = urlObj;
      // 设置下载的文件名，这里假设服务器响应头中指定的文件名是 member_import_template.xlsx
      link.download = 'member_import_template.xlsx';
      link.click();
      // 释放 URL 对象
      window.URL.revokeObjectURL(urlObj);
    } catch (error) {
      console.error('导入会员信息模板下载失败', error);
    }
  };

  // 定义一个函数来格式化时间
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0')
    return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
  }

  const exportExcel = () => {
    setExportExcelLoading(true);
    let sheetFilter = ['id', 'name', 'gender', 'age', 'phone', 'nation', 'origin_address', 'home_address', 'work_unit', 'occupation', 'political_party',
       'club_duty', 'is_civil_servant', 'is_cadre', 'is_veteran', 'athlete_level', 'referee_level', 'honour_info', 'height', 'weight', 'uniform_size', 
       'residence_area', 'current_club_name', 'current_level'];
    // 遍历选中的行数据
    // tableData.forEach((item) => {
    //   if (item.gender === 'male') {
    //     item.gender = '男'
    //   } else {
    //     item.gender = '女'
    //   }
    // });
    let option: any = {};
    option.fileName = '会员信息表_' + `${formatDate(new Date())}`;
    option.datas = [
      {
        sheetData: tableData,      //根据需求请求过来的json数据
        sheetName: '会员信息表',
        sheetFilter: sheetFilter,   //表数据对应sheetData中的数据
        sheetHeader: [             //表头，与sheetFilter 中各字段对应
          '唯一编号',
          '姓名',
          '性别（男/女）',
          '年龄',
          '手机号',
          '民族',
          '籍贯',
          '家庭住址',
          '工作单位',
          '职业',
          '党派',
          '俱乐部职务',
          '是否公务员（是/否）',
          '是否科局级及以上（是/否）',
          '是否退役军人（是/否）',
          '专业运动员等级（国家级/省级/市级/县级）',
          '裁判员等级（国家级/一级/二级/三级）',
          '荣誉信息',
          '身高（cm）',
          '体重（kg）',
          '服装尺寸',
          '人员归属地（龙港、苍南、平阳、温州市内、浙江省内、浙江省外）',
          '当前所属俱乐部名',
          '组别（甲组/乙组/丙组）'
        ],
      },
    ];
    let toExcel = new ExportJsonExcel(option);
    toExcel.saveExcel();
    setExportExcelLoading(false);
  };

const handleUploadChange = (info: any) => {
  if (info.file.status === 'done') {
    setUploadedFile(info.file.originFileObj);
  } else if (info.file.status === 'error') {
    message.error('文件上传失败');
  }
};

// 处理文件上传的函数
const handleUpload = async (file: File) => {
  if (uploadedFile) {
    try {
      // 发送 POST 请求到后端 /api/member/import 接口
      const response = await importMemberList(file);
      if (response.code === 200 && response.data.errorInfoList?.length === 0) {
        message.success('会员信息导入成功');
        // 上传成功后可以选择关闭 Modal
        handleImportModalOpen(false);
        setCurrentRow(undefined);
        if (actionRef.current) {
          actionRef.current.reload();
        }
      } else {
        message.error('会员信息导入失败');
        let arrays = [];
        response.data.errorInfoList.forEach((item) => {
          arrays.push("未导入行号: " + item.rowNum + ", " + "原因: " + item.message + "。")
        });
        message.error(arrays.join(" "));
      }
    } catch (error) {
      console.error('会员信息导入失败', error);
    }
    setUploadedFile(null);
  }
};

  const columns: ProColumns<API.MemberListItem>[] = [
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
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '性别',
      dataIndex: 'gender',
      valueEnum: {
        'male': {
          text: '男'
        },
        'female': {
          text: '女'
        }
      },
    },
    {
      title: '年龄',
      dataIndex: 'age',
      search: false,
      sorter: true,
      // renderText: (val: string) => `${val}${'万'}`,
    },
    {
      title: '开始年龄',
      hideInTable: true,//在列表中不显示
      dataIndex: 'start_age',
      valueType: 'digit',
    },
    {
      title: '结束年龄',
      hideInTable: true,//在列表中不显示
      dataIndex: 'end_age',
      valueType: 'digit',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
    },
    {
      title: '当前组别',
      dataIndex: 'current_level',
      valueEnum: {
        0: {
          text: '甲组'
        },
        1: {
          text: '乙组'
        },
        2: {
          text: '丙组'
        },
      },
    },
    {
      title: '民族',
      dataIndex: 'nation',
      search: false,
    },
    {
      title: '籍贯',
      dataIndex: 'origin_address',
      search: false,
    },
    {
      title: '家庭住址',
      dataIndex: 'home_address',
      search: false,
    },
    {
      title: '工作单位',
      dataIndex: 'work_unit',
      search: false,
    },
    {
      title: '职业',
      dataIndex: 'occupation',
      search: false,
    },
    {
      title: '党派',
      dataIndex: 'political_party',
      search: false,
    },
    {
      title: '俱乐部职务',
      dataIndex: 'club_duty',
      search: false,
    },
    {
      title: '是否公务员',
      dataIndex: 'is_civil_servant',
      valueEnum: {
        false: {
          text: '否'
        },
        true: {
          text: '是'
        },
      },
    },
    {
      title: '是否科局级及以上',
      dataIndex: 'is_cadre',
      valueEnum: {
        false: {
          text: '否'
        },
        true: {
          text: '是'
        },
      },
    },
    {
      title: '是否退役军人',
      dataIndex: 'is_veteran',
      valueEnum: {
        false: {
          text: '否'
        },
        true: {
          text: '是'
        },
      },
    },
    {
      title: '专业运动员等级',
      dataIndex: 'athlete_level',
      valueEnum: {
        'national': {
          text: '国家级'
        },
        'provincial': {
          text: '省级'
        },
        'city': {
          text: '市级'
        },
        'county': {
          text: '县级'
        },
      },
    },
    {
      title: '裁判员等级',
      dataIndex: 'referee_level',
      valueEnum: {
        'national': {
          text: '国家级'
        },
        'first': {
          text: '一级'
        },
        'second': {
          text: '二级'
        },
        'third': {
          text: '三级'
        },
      },
    },
    {
      title: '荣誉信息',
      dataIndex: 'honour_info',
      search: false,
    },
    {
      title: '身高',
      dataIndex: 'height',
      renderText: (val: string) => `${val}${'cm'}`,
      search: false,
    },
    {
      title: '体重',
      dataIndex: 'weight',
      renderText: (val: string) => `${val}${'kg'}`,
      search: false,
    },
    {
      title: '服装尺寸',
      dataIndex: 'uniform_size',
      search: false,
    },
    {
      title: '人员归属地',
      dataIndex: 'residence_area',
      valueEnum: {
        'long_gang': {
          text: '龙港'
        },
        'cang_nan': {
          text: '苍南'
        },
        'ping_yang': {
          text: '平阳'
        },
        'wen_zhou': {
          text: '温州市内'
        },
        'zhe_jiang': {
          text: '浙江省内'
        },
        'other': {
          text: '浙江省外'
        },
      },
    },
    {
      title: '当前所属俱乐部ID',
      dataIndex: 'current_club_id',
    },
    {
      title: '当前所属俱乐部名',
      dataIndex: 'current_club_name',
      search: false,
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
    // {
    //   title: '操作',
    //   dataIndex: 'option',
    //   valueType: 'option',
    //   render: (_, record) => [
    //     <a
    //       key="config"
    //       onClick={() => {
    //         handleUpdateModalOpen(true);
    //         setCurrentRow(record);
    //       }}
    //     >
    //       配置
    //     </a>,
    //     <a key="subscribeAlert" href="https://procomponents.ant.design/">
    //       订阅警报
    //     </a>,
    //   ],
    // },
  ];
  return (
    <Spin spinning={exportExcelLoading} tip="数据导出中...">
    <PageContainer>
      <ProTable<API.MemberListItem, API.PageParams>
        headerTitle={'会员信息'}
        actionRef={actionRef}
        rowKey="id"
        pagination={{
          showQuickJumper: true
        }}
        search={{
          labelWidth: 120
        }}
        toolBarRender={() => [
          // <Button
          //   type="primary"
          //   key="primary"
          //   onClick={() => {
          //     handleModalOpen(true);
          //   }}
          // >
          //   <PlusOutlined /> 新建
          // </Button>,
          <Button
          type="primary"
          key="primary"
          onClick={() => {
            handleImportModalOpen(true);
          }}
        >
          <UploadOutlined /> 导入
        </Button>,
        <Button
        type="default"
        key="export"
        loading={exportExcelLoading}
        onClick={() => {
          exportExcel();
        }}
      >
        <ExportOutlined /> 导出数据
      </Button>,
        <Button
        type="default"
        key="primary"
        onClick={() => {
          downloadMemberTemplate();
        }}
      >
        <ExportOutlined /> 导入模板下载
      </Button>
        ]}
        request={async (params: any, sort: Record<string, SortOrder>, filter: Record<string, (string | number)[] | null>) => {
          const response = await member({
            ...params,
            sort
          });
        if (response?.data) {
          setTableData(response?.data.records);
          return  {
            data: response?.data.records || [],
            success: true,
            total: response.total,
          }
        }
        }}
        columns={columns}
        // rowSelection={{
        //   onChange: (_, selectedRows) => {
        //     setSelectedRows(selectedRows);
        //   },
        // }}
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
              <span>
                服务调用次数总计 {selectedRowsState.reduce((pre, item) => pre + item.callNo!, 0)} 万
              </span>
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
          <Button type="primary">批量审批</Button>
        </FooterToolbar>
      )}
      <ModalForm
        title={'创建规则'}
        width="400px"
        open={createModalOpen}
        onOpenChange={handleModalOpen}
        onFinish={async (value) => {
          const success = await handleAdd(value as API.MemberListItem);
          if (success) {
            handleModalOpen(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >  
        <ProFormText
          rules={[
            {
              required: true,
              message: '规则名称为必填项',
            },
          ]}
          width="md"
          name="name"
        />
        <ProFormTextArea width="md" name="desc" />
      </ModalForm>
      <ModalForm
        title={'导入会员信息'}
        width="400px"
        open={importModalOpen}
        onOpenChange={handleImportModalOpen}
        onFinish={(value) => handleUpload(uploadedFile)}
        onCancel={() => {
          handleImportModalOpen(false);
          setUploadedFile(null);
          if (!showDetail) {
            setCurrentRow(undefined);
          }
        }}
      >
        <Upload
          name="file"
          onChange={handleUploadChange}
          showUploadList={false}
        >
          <Button><UploadOutlined />选择文件</Button>
        </Upload>
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
    </Spin>
  );
};
export default TableList;
