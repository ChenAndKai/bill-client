import CustomIcon from '@/components/CustomIcon';
import PopupAddBill from '@/components/PopupAddBill';
import { typeMap } from '@/utils';
import cx from 'classnames';
import dayjs from 'dayjs';
import qs from 'query-string';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Modal, Toast } from 'zarm';
import Header from '../../components/Header';
import { deleteBill, getBillDetail } from '../../service';

import s from './style.module.less';

const Detail = () => {
    const location = useLocation();
    const { id } = qs.parse(location.search);
    const [detail, setDetail] = useState({});
    const editRef = useRef();
    const navigateTo = useNavigate();

    useEffect(() => {
        getDetail();
    }, [])

    const getDetail = async () => {
        const { data } = await getBillDetail(id);
        setDetail(data);
    }
    
    const deleteDetail = () => {
        Modal.confirm({
            title: '删除',
            content: '确认删除账单?',
            onOk: async () => {
                await deleteBill(id);
                Toast.show('删除成功');
                navigateTo(-1);
            }
        })
    }

    return <div className={s.detail}>
        <Header title="账单详情" />
        <div className={s.card}>
            <div className={s.type}>
                {/* 通过 pay_type 属性，判断是收入或支出，给不同颜色 */}
                <span className={cx({ [s.expense]: detail.pay_type == 1, [s.income]: detail.pay_type == 2 })}>
                    <CustomIcon className={s.iconfont} type={detail.type_id ? typeMap[detail.type_id].icon : 1} />
                </span>
                <span>{detail.type_name || ''}</span>
            </div>
            {
                detail.pay_type == 1
                    ? <div className={cx(s.amount, s.expense)}>-{detail.amount}</div>
                    : <div className={cx(s.amount, s.icon)}>+{detail.amount}</div>
            }
            <div className={s.info}>
                <div className={s.time}>
                    <span>记录时间</span>
                    <span>{dayjs(Number(detail.date)).format('YYYY-MM-DD HH:mm')}</span>
                </div>
                <div className={s.remark}>
                    <span>备注</span>
                    <span>{detail.remark || '-'}</span>
                </div>
            </div>
            <div className={s.operation}>
                <span onClick={deleteDetail}><CustomIcon type="shanchu" />删除</span>
                <span onClick={() => editRef.current && editRef.current.show()}><CustomIcon type="tianjia" />编辑</span>
            </div>
        </div>
        <PopupAddBill ref={editRef} detail={detail} onReload={getDetail} />
    </div>
}

export default Detail