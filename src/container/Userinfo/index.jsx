import Header from '@/components/Header'; // 由于是内页，使用到公用头部
import { editUserInfo, getUserInfo } from '@/service';
import axios from 'axios'; // // 由于采用 form-data 传递参数，所以直接只用 axios 进行请求
import { baseUrl } from 'config'; // 由于直接使用 axios 进行请求，统一封装了请求 baseUrl
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { imgUrlTrans } from 'utils';
import { Button, FilePicker, Input, Toast } from 'zarm';
import s from './style.module.less';

const UserInfo = () => {
    const navigateTo = useNavigate(); // 路由实例
    const [user, setUser] = useState({}); // 用户
    const [avatar, setAvatar] = useState(''); // 头像
    const [signature, setSignature] = useState(''); // 个签
    const token = localStorage.getItem('token'); // 登录令牌

    useEffect(() => {
        getInfo(); // 初始化请求
    }, []);

    const getInfo = async () => {
        const { data } = await getUserInfo();
        setUser(data);
        setAvatar(imgUrlTrans(data.avatar));
        setSignature(data.signature);
    }

    const handleSelect = (file) => {
        console.log('file', file)
        if (file && file.file.size > 10 * 1024 * 1024) {
            Toast.show('上传头像不得超过 10 MB！！')
            return
        }
        let formData = new FormData();
        formData.append('file', file.file);
        axios({
            method: 'post',
            url: `${baseUrl}/upload`,
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': token
            }
        }).then(res => {
            setAvatar(imgUrlTrans(res.data));
        })
    }

    const save = async () => {
        await editUserInfo({
            signature,
            avatar
        })
        Toast.show('修改成功');
        navigateTo(-1);
    }



    return <>
        <Header title='用户信息' />
        <div className={s.userInfo}>
            <h1>个人资料</h1>
            <div className={s.item}>
                <div className={s.title}>头像</div>
                <div className={s.avatar}>
                    <img className={s.avatarUrl} src={avatar} alt="" />
                    <div className={s.desc}>
                        <span>支持 jpg、png、jpeg 格式大小 10MB 以内的图片</span>
                        <FilePicker className={s.filePicker} onChange={handleSelect} accept="image/*">
                            <Button className={s.upload} theme='primary' size='xs'>点击上传</Button>
                        </FilePicker>
                    </div>
                </div>
            </div>
            <div className={s.item}>
                <div className={s.title}>个性签名</div>
                <div className={s.signature}>
                    <Input
                        clearable
                        type="text"
                        value={signature}
                        placeholder="请输入个性签名"
                        onChange={(value) => setSignature(value)}
                    />
                </div>
            </div>
            <Button onClick={save} style={{ marginTop: 50 }} block theme='primary'>保存</Button>
        </div>
    </> 
}

export default UserInfo;