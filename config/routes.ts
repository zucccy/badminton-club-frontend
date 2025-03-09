export default [
  {
    path: '/user',
    layout: false,
    routes: [{ name: '登录', path: '/user/login', component: './User/Login' }],
  },
  { name: '查询会员信息列表', icon: 'table', path: '/list', component: './TableList' },
  { name: '查询俱乐部信息列表', icon: 'table', path: '/list_club', component: './ClubTableList' },
  { path: '/', redirect: '/list' },
  { path: '*', layout: false, component: './404' },
];
