import { getBillTypeList } from '@/service'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { forwardRef, useEffect, useState } from 'react'
import { Icon, Popup } from 'zarm'
import MyIcon from '@/components/CustomIcon/MyIcon';

import s from './style.module.less'

const PopupType = forwardRef(({ onSelect }, ref) => {
    const [show, setShow] = useState(false);
    const [active, setActive] = useState('all');    //激活的tab
    const [expense, setExpense] = useState([]);     //支出类型标签
    const [income, setIncome] = useState([]);       //收入类型标签 

    useEffect(() => {
        (async () => {
            const { data: { list } } = await getBillTypeList();
            setExpense(list.filter(i => i.type == 1));
            setIncome(list.filter(i => i.type == 2))
        })()
    }, [])

    if (ref) {
        ref.current = {
            show: () => setShow(true),
            close: () => setShow(false)
        }
    }

    const choseType = (item) => {
        setActive(item.id)
        setShow(false)
        onSelect(item)
    }

    return <Popup
        visible={show}
        direction="bottom"
        onMaskClick={() => setShow(false)}
        destroy={false}
        mountContainer={() => document.body}
    >
        <div className={s.popupType}>
            <div className={s.header}>
                请选择类型
                <MyIcon type='icon-close' className={s.cross} onClick={() => setShow(false) } />
            </div>
            <div className={s.content}>
                <div onClick={() => choseType({ id: 'all' })} className={cx({ [s.all]: true, [s.active]: active == "all" })}>全部类型</div>
                <div className={s.title}>支出</div>
                <div className={s.expenseWrap}>
                    {
                        expense.map((item, index) => <p key={index} onClick={() => choseType(item)} className={cx({ [s.active]: active == item.id })}>{ item.name}</p>)
                    }
                </div>
                <div className={s.title}>收入</div>
                <div className={s.incomeWrap}>
                    {
                        income.map((item, index) => <p key={index} onClick={() => choseType(item)} className={cx({ [s.active]: active == item.id })}>{ item.name}</p>)
                    }
                </div>
            </div>
        </div>
    </Popup>
})

PopupType.propTypes = {
    onSelect: PropTypes.func
}

export default PopupType;