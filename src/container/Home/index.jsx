import BillItem from '@/components/BillItem';
import CustomIcon from '@/components/CustomIcon';
import { LOAD_STATE, REFRESH_STATE } from '@/utils';
import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from "react";
import { Icon, Pull } from 'zarm';
import PopupAddBill from '../../components/PopupAddBill';
import PopupDate from '../../components/PopupDate';
import PopupType from '../../components/PopupType';
import { getBillList } from '../../service';
import MyIcon from '@/components/CustomIcon/MyIcon';

import s from './style.module.less';

const Home = () => {
    const typeRef = useRef();
    const monthRef = useRef();
    const addRef = useRef();
    const [totalExpense, setTotalExpense] = useState(0); // 总支出
    const [totalIncome, setTotalIncome] = useState(0); // 总收入
    const [currentSelect, setCurrentSelect] = useState({});
    const [currentTime, setCurrentTime] = useState(dayjs().format('YYYY-MM'));
    const [page, setPage] = useState(1);
    const [list, setList] = useState([])
    const [totalPage, setTotalPage] = useState(0);
    const [refreshing, setRefreshing] = useState(REFRESH_STATE.normal);
    const [loading, setLoading] = useState(LOAD_STATE.normal);

    useEffect(() => {
        getList()
    }, [page, currentSelect, currentTime])

    const getList = async () => {
        const { data } = await getBillList(page, currentTime, currentSelect.id || 'all');
        //下拉刷新,重置数据
        if (page == 1) {
            setList(data.list);
        } else {
            setList(list.concat(data.list));
        }
        setTotalExpense(data.totalExpense.toFixed(2));
        setTotalIncome(data.totalIncome.toFixed(2));
        setTotalPage(data.totalPage);
        //上滑加载
        setLoading(LOAD_STATE.success);
        setRefreshing(REFRESH_STATE.success);
    }

    const refreshData = () => {
        setRefreshing(REFRESH_STATE.loading);
        if (page != 1) {
            setPage(1);
        } else {
            getList();
        };
    };

    const loadData = () => {
        if (page < totalPage) {
            setLoading(LOAD_STATE.loading);
            setPage(page + 1);
        }
    }
    
    //账单弹窗
    const toggle = () => {
        typeRef.current && typeRef.current.show();
    }

    //月份弹窗
    const monthToggle = () => {
        monthRef.current && monthRef.current.show()
    }

    //选择类别
    const select = (item) => {
        setRefreshing(REFRESH_STATE.loading);
        //触发刷新列表，将分页重置为1
        setPage(1);
        setCurrentSelect(item);
    }

    //筛选月份
    const selectMonth = (item) => {
        setRefreshing(REFRESH_STATE.loading);
        setPage(1);
        setCurrentTime(item);
    }

    const addToggle = () => {
        addRef.current && addRef.current.show();
    }

    return <div className={s.home}>
        <div className={s.header}>
            <div className={s.dataWrap}>
                <span className={s.expense}>总支出: <b>￥ {totalExpense}</b></span>
                <span className={s.income}>总收入: <b>￥ {totalIncome}</b></span>
            </div>
            <div className={s.typeWrap}>
                <div className={s.left} onClick={toggle}>
                    <span className={s.title}>{currentSelect.name || '全部类型' }<MyIcon className={s.arrow} type="icon-xiala" /></span>
                </div>
                <div className={s.right}>
                    <span className={s.time} onClick={monthToggle}>{currentTime}<MyIcon className={s.arrow} type="icon-xiala" /></span>
                </div>
            </div>
        </div>
        <div className={s.contentWrap}>
            {
                list.length ? <Pull
                    animationDuration={200}
                    stayTime={400}
                    refresh={{
                        state: refreshing,
                        handler: refreshData
                    }}
                    load={{
                        state: loading,
                        distance: 200,
                        handler: loadData
                    }}
                >
                    {
                        list.map((item, index) => <BillItem bill={item} key={index} />)
                    }
                </Pull> : null
            }
        </div>
        <div className={s.add} onClick={addToggle}><CustomIcon type="tianjia" /></div>
        <PopupAddBill ref={addRef} onReload={refreshData} />
        <PopupType ref={typeRef} onSelect={select} />
        <PopupDate ref={monthRef} mode="month" onSelect={selectMonth} />
    </div>
}

export default Home