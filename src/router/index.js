import Account from '@/container/Account';
import Data from '@/container/Data';
import Detail from '@/container/Deatil';
import Home from '@/container/Home';
import Login from '@/container/login';
import User from '@/container/User';
import UserInfo from '@/container/Userinfo';

const routes = [
    {
        path: "/",
        component: Home
    },
    {
        path: "/data",
        component: Data
    },
    {
        path: "/user",
        component: User
    },
    {
        path: "/detail",
        component: Detail
    },
    {
        path: "/login",
        component: Login
    },
    {
        path: '/userinfo',
        component: UserInfo
    },
    {
        path: '/account',
        component: Account
    }
];

export default routes