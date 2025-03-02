// @ts-ignore
/* eslint-disable */

declare namespace API {
  type CurrentUser = {
    username?: string;
    avatar?: string;
    id?: string;
    email?: string;
    signature?: string;
    title?: string;
    group?: string;
    tags?: { key?: string; label?: string }[];
    notifyCount?: number;
    unreadCount?: number;
    country?: string;
    role?: string;
    geographic?: {
      province?: { label?: string; key?: string };
      city?: { label?: string; key?: string };
    };
    address?: string;
    phone?: string;
  };

  type LoginResult = {
    msg?: string;
    code?: number;
    currentAuthority?: string;
  };

  type PageParams = {
    current?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
  };

  type RuleListItem = {
    id?: string;
    name?: string;
    gender?: string;
    age?: number;
    phone?: string;
    current_level?: string;
    disabled?: boolean;
    href?: string;
    avatar?: string;
    desc?: string;
    callNo?: number;
    status?: number;
    create_time?: string;
    update_time?: string;
    progress?: number;
  };

  type RuleList = {
    records?: RuleListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type FakeCaptcha = {
    code?: number;
    status?: string;
  };

  type LoginParams = {
    account?: string;
    password?: string;
  };

  type ErrorResponse = {
    /** 业务约定的错误码 */
    code: string;
    /** 业务上的错误信息 */
    msg?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };

  type NoticeIconList = {
    data?: NoticeIconItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type NoticeIconItemType = 'notification' | 'message' | 'event';

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };
}
