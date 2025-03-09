// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取当前的用户 GET /api/user/get/login_user */
export async function currentUser(options?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser;
  }>('/api/user/get/login_user', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 退出登录接口 POST /api/user/logout */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/user/logout', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 登录接口 POST /api/user/login */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/api/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function importMemberList(file: File, options?: { [key: string]: any }) {
  const formData = new FormData();
  formData.append('file', file);
  return request<Record<string, any>>('/api/member/import', {
    data: formData,
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    ...(options || {}),
  });
}

export async function downloadTemplate(options?: { [key: string]: any }) {
  return request('/api/member/template', {
    method: 'GET',
    responseType: 'blob',
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取会员信息列表 GET /api/rule */
export async function member(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.MemberList>('/api/member/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.MemberListItem>('/api/rule', {
    method: 'POST',
    data:{
      method: 'update',
      ...(options || {}),
    }
  });
}

/** 新建会员 POST /api/member/add */
export async function addMember(options?: { [key: string]: any }) {
  return request<API.MemberListItem>('/api/member/add', {
    method: 'POST',
    data:{
      method: 'post',
      ...(options || {}),
    }
  });
}

/** 删除规则 DELETE /api/member/delete */
export async function removeMember(options?: { [idList: number]: any }) {
  return request<Record<string, any>>('/api/member/delete', {
    method: 'DELETE',
    data:{
      method: 'delete',
      ...(options || {}),
    }
  });
}

export async function getAllClubName(options?: { [key: string]: any }) {
  return request<API.ClubNameMap>('/api/club/get_all_club_name', {
    method: 'GET',
    ...(options || {}),
  });
}

export async function addClub(options?: { [key: string]: any }) {
  return request<API.ClubListItem>('/api/club/add', {
    method: 'POST',
    data:{
      method: 'post',
      ...(options || {}),
    }
  });
}

/** 删除规则 DELETE /api/member/delete */
export async function removeClub(options?: { [idList: number]: any }) {
  return request<Record<string, any>>('/api/club/delete', {
    method: 'DELETE',
    data:{
      method: 'delete',
      ...(options || {}),
    }
  });
}

export async function clubList(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.ClubList>('/api/club/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}