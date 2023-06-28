import Header from '@/components/Header';
import { createForm } from 'rc-form';
import React from 'react';
import { Button, Cell, Input, Toast } from 'zarm';
import { modifyPassword } from '../../service';

import s from './style.module.less';

const Account = (props) => {
    // Account 通过 createForm 高阶组件包裹之后，可以在 props 中获取到 form 属性
    const { getFieldProps, getFieldError } = props.form;

    // 提交修改方法
    const submit = async () => {
        // validateFields 获取表单属性元素
        props.form.validateFields(async (error, value) => {
            if (!error) {
                if (value.newpass != value.newpass2) {
                    Toast.show('新密码输入不一致');
                    return;
                }
                await modifyPassword({
                    old_pass: value.oldpass,
                    new_pass: value.newpass
                })
                Toast.show('修改成功');
            }
        })
    }

    return <>
        <Header title="重置密码" />
        <div className={s.account}>
            <div className={s.form}>
                <Cell title="原密码">
                    <Input
                        clearable
                        type="text"
                        placeholder="请输入原密码"
                        {...getFieldProps('oldpass', { rules: [{ required: true }] })}
                    />
                </Cell>
                <Cell title="新密码">
                    <Input
                        clearable
                        type="text"
                        placeholder="请输入新密码"
                        {...getFieldProps('newpass', { rules: [{ required: true }] })}
                    />
                </Cell>
                <Cell title="确认密码">
                    <Input
                        clearable
                        type="text"
                        placeholder="请再此输入新密码确认"
                        {...getFieldProps('newpass2', { rules: [{ required: true }] })}
                    />
                </Cell>
            </div>
            <Button className={s.btn} block theme="primary" onClick={submit}>提交</Button>
        </div>
    </>
}

export default createForm()(Account);