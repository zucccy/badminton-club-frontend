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

  type ClubListItem = {
    id?: string;
    club_name?: string;
    create_time?: string;
    update_time?: string;
  }

  type ClubList = {
    records?: ClubListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type MemberListItem = {
    id?: string;
    name?: string;
    gender?: string;
    birth_date?: string;
    age?: number;
    phone?: string;
    nation?: string;
    origin_address?: string;
    home_address?: string;
    work_unit?: string;
    occupation?: string;
    political_party?: string;
    club_duty?: string;
    is_civil_servant?: string;
    is_cadre?: string;
    is_veteran?: string;
    athlete_level?: string;
    referee_level?: string;
    honour_info?: string;
    height?: number;
    weight?: number;
    uniform_size?: string;
    residence_area?: string;
    current_club_id?: number;
    current_club_name?: string;
    current_level?: string;
    create_time?: string;
    update_time?: string;
  };

  type MemberList = {
    records?: MemberListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type ClubNameMap = {
      obj?: Map;
  }

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
