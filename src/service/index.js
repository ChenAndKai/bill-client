import { get, post } from '@/utils';

const baseUrl = '/api';

export const register = (data) => {
    const url = `${baseUrl}/user/register`;
    return post(url, data);
}

export const login = (data) => {
    const url = `${baseUrl}/user/login`;
    return post(url, data);
}

export const getBillList = (page, currentTime, type_id) => {
    const url = `${baseUrl}/bill/list?page=${page}&page_size=5&date=${currentTime}&type_id=${type_id}`;
    return get(url);
}

export const getBillTypeList = () => {
    const url = `${baseUrl}/type/list`;
    return get(url);
}

export const addBill = (params) => {
    const url = `${baseUrl}/bill/add`;
    return post(url, params);
}

export const getBillDetail = (id) => {
    const url = `${baseUrl}/bill/detail?id=${id}`;
    return get(url);
}

export const deleteBill = (id) => {
    const url = `${baseUrl}/bill/delete`;
    return post(url, { id });
}

export const updateBill = (params) => {
    const url = `${baseUrl}/bill/update`;
    return post(url, params);
}

export const getDataByMonth = (month) => {
    const url = `${baseUrl}/bill/data?date=${month}`;
    return get(url);
}

export const getUserInfo = () => {
    const url = `${baseUrl}/user/get_userinfo`;
    return get(url);
}

export const editUserInfo = (params) => {
    const url = `${baseUrl}/user/edit_userinfo`;
    return post(url, params)
}

export const modifyPassword = (params) => {
    const url = `${baseUrl}/user/modify_pass`;
    return post(url, params);
}