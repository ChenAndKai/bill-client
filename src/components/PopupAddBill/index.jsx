import { addBill, getBillTypeList, updateBill } from '@/service';
import { typeMap } from '@/utils';
import cx from 'classnames';
import dayjs from 'dayjs';
import React, { forwardRef, useEffect, useRef, useState } from "react";
import { Icon, Input, Keyboard, Popup, Toast } from 'zarm';
import CustomIcon from '../CustomIcon';
import PopupDate from '../PopupDate';
import s from './style.module.less';
import MyIcon from '@/components/CustomIcon/MyIcon';

const PopupAddBill = forwardRef(({ detail = {},onReload }, ref) => {
    const dateRef = useRef();
    const id = detail && detail.id;
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const [amount, setAmount] = useState('');
    const [payType, setPayType] = useState('expense');
    const [currentType, setCurrentType] = useState({});
    const [expense, setExpense] = useState([]);
    const [income, setIncome] = useState([]);
    const [remark, setRemark] = useState('');
    const [showRemark, setShowRemark] = useState(false);

    useEffect(() => {
        if (detail.id) {
            setPayType(detail.pay_type == 1 ? 'expense' : 'income')
            setCurrentType({
                id: detail.type_id,
                name: detail.type_name
            })
            setRemark(detail.remark)
            setAmount(detail.amount)
            setDate(dayjs(Number(detail.date)).$d);
        }
    }, [detail])

    useEffect(() => {
        getList();
    }, [])

    if (ref) {
        ref.current = {
            show: () => setShow(true),
            close: () => setShow(false)
        }
    }

    const getList = async () => {
        const { data: { list } } = await getBillTypeList();
        const _expense = list.filter(i => i.type == 1); //支出类型
        const _income = list.filter(i => i.type == 2); //收入类型
        setExpense(_expense);
        setIncome(_income);
        //没有id,新建账单
        if (!id) {
            setCurrentType(_expense[0]);
        }
    }

    const selectDate = (val) => {
        setDate(val);
    }

    const changeType = (type) => {
        setPayType(type);
    }

    //监听输入框改变值
    const handleMoney = (value) => {
        value = String(value);
        if (value == 'close') return 
        if (value == 'delete') {
            let _amount = amount.slice(0, amount.length - 1)
            setAmount(_amount);
            return;
        }

        //点击确认
        if (value == 'ok') {
            //处理添加账单逻辑
            addNewBill();
            return
        }

        //当输入'.',且已经存在'.'，则不让其继续字符串相加
        if (value == '.' && amount.includes('.')) return;
        //小数点后保留两位，当超过时，不能继续相加
        if (value != '.' && amount.includes('.') && amount && amount.split('.')[1].length >= 2) return;
        setAmount(amount + value);
    }

    const addNewBill = async () => {
        if (!amount) {
            Toast.show('请输入具体金额');
            return
        }

        const params = {
            amount: Number(amount).toFixed(2),
            type_id: currentType.id,
            type_name: currentType.name,
            date: dayjs(date).unix() * 1000,
            pay_type: payType === 'expense' ? 1 : 2,
            remark: remark
        }
        if (id) {
            params.id = id;
            await updateBill(params);
            Toast.show('修改成功');
        } else {
            await addBill(params);
            //重置数据
            setAmount('');
            setPayType('expense');
            setCurrentType(expense[0]);
            setDate(new Date());
            setRemark('');
            Toast.show('添加成功');
        }
        setShow(false);
        if (onReload) onReload();
    }

    return <Popup
        visible={show}
        direction="bottom"
        onMaskClick={() => setShow(false)}
        destroy={false}
        mountContainer={() => document.body}
    >   
        <div className={s.addWrap}>
            {/* 右上角关闭弹窗 */}
            <header className={s.header}>
                <span className={s.close} onClick={() => setShow(false)}><MyIcon className={s.closeIcon} type="icon-close"/></span>
            </header>
            <div className={s.filter}>
                {/* 收入和支出类型切换 */}
                <div className={s.type}>
                    <span onClick={() => changeType('expense')} className={cx({[s.expense]:true, [s.active]: payType==='expense'})}>
                       支出 
                    </span>
                    <span onClick={() => changeType('income')} className={cx({[s.income]:true, [s.active]:payType==='income'})}>
                        收入
                    </span>
                </div>
                {/* 时间选择 */}
                <div className={s.time} onClick={() => dateRef.current && dateRef.current.show()}>
                    {dayjs(date).format('MM-DD')}<MyIcon className={s.arrow } type="icon-xiala"/>
                </div>
                <PopupDate ref={dateRef} onSelect={selectDate} />
            </div>
            <div className={s.money}>
                <span className={s.sufix}>￥</span>
                <span className={cx(s.amount)}>{amount}</span>
            </div>
            <div className={s.typeWrap}>
                <div className={s.typeBody}>
                    {/* 通过payType 判断，展示收入还是支出类型 */}
                    {
                        (payType === 'expense' ? expense : income).map(item => <div onClick={() => setCurrentType(item)} key={item.id} className={s.typeItem}>
                            {/* 收入和支出的字体颜色，以及背景颜色通过 payType 区分，设置高亮 */}
                            <span className={cx({
                                [s.iconfontWrap]: true,
                                [s.expense]: payType === 'expense',
                                [s.income]: payType == 'income',
                                [s.active]: currentType.id == item.id
                            })}>
                                <CustomIcon className={s.iconfont} type={typeMap[item.id].icon} />
                            </span>
                            <span>{ item.name}</span>
                        </div>)
                    }
                </div>
            </div>
            <div className={s.remark}>
                {
                    showRemark ? <Input
                        autoHeight
                        showLength
                        maxLength={50}
                        type="text"
                        rows={3}
                        value={remark}
                        placeholder="请输入备注信息"
                        onChange={(val) => setRemark(val)}
                        onBlur={() => setShowRemark(false)}
                    /> : <span onClick={() => setShowRemark(true)}>{remark || '添加备注'}</span>
                }
            </div>
            <Keyboard type='price' onKeyClick={(value) => handleMoney(value)} />
        </div>
    </Popup>
})

export default PopupAddBill;