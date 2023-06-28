import PopupDate from '@/components/PopupDate';
import cx from 'classnames';
import dayjs from 'dayjs';
import React, { useRef, useState, useEffect } from 'react';
import { Icon, Progress  } from 'zarm';
import s from './style.module.less';
import MyIcon from '@/components/CustomIcon/MyIcon';
import { getDataByMonth } from "@/service";
import CustomIcon from '@/components/CustomIcon';
import { typeMap } from '@/utils'


let proportionChart = null;

const Data = () => {
    const monthRef = useRef();
    const [currentMonth, setCurrentMonth] = useState(dayjs().format('YYYY-MM'));
    const [totalType, setTotalType] = useState('expense'); //收入或支出类型
    const [totalExpense, setTotalExpense] = useState(0); // 总支出
    const [totalIncome, setTotalIncome] = useState(0); //总收入
    const [expenseData, setExpenseData] = useState([]); //支出数据
    const [incomeData, setIncomeData] = useState([]); // 收入数据

    const [pieType, setPieType] = useState('expense');//饼图的【收入】和【支出】控制


    useEffect(() => {
        getData();
        return () => {
            //每次组件卸载的时候，需要释放图标实例 .clear 只是将其清空不会释放
            proportionChart.dispose();
        }
    }, [currentMonth])


    //绘制饼图
    const setPieChart = (data) => {
        if(window.echarts) {
            proportionChart = echarts.init(document.getElementById('proportion'));
            proportionChart.setOption({
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br />{b} : {c} ({d}%)'
                },
                //图例
                legend: {
                    data: data.map(item => item.type_name)
                },
                series: [
                    {
                        name: '支出',
                        type: 'pie',
                        radius: '55%',
                        data: data.map(item => {
                            return {
                                value: item.number,
                                name: item.type_name
                            }
                        }),
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0,0,0,0.5)'
                            }
                        }
                    }
                ]
            })
        }
    }

        //详情
    const getData = async () => {
        const {data} = await getDataByMonth(currentMonth);

        //总支出
        setTotalExpense(data.total_expense);
        setTotalIncome(data.total_income);

        //过滤支出和收入
        const expense_data = data.total_data.filter(item => item.pay_type == 1).sort((a,b) => b.number - a.number); //过滤出账单为支出的项
        const income_data = data.total_data.filter(item => item.pay_type == 2).sort((a,b) => b.number - a.number); //过滤出账单为收入的项
        setExpenseData(expense_data);
        setIncomeData(income_data);

        setPieChart(pieType == 'expense' ? expense_data : income_data);
    }

    //切换饼图收支类型
    const changePieType = (type) => {
        setPieType(type);
        //重绘饼图
        setPieChart(type == 'expense' ? expenseData : incomeData);
    }

    const monthShow = () => {
        monthRef.current && monthRef.current.show();
    }

    const selectMonth = (item) => {
        setCurrentMonth(item);
    }
    return <div className={s.data}>
        <div className={s.total}>
            <div className={s.time} onClick={monthShow}>
                <span>{currentMonth}</span>
                <MyIcon className={s.date} type="icon-rili" />
            </div>
            <div className={s.title}>共支出</div>
            <div className={s.expense}>¥1000</div>
            <div className={s.income}>共收入¥200</div>
        </div>

        <div className={s.structure}>
            <div className={s.head}>
                <span className={s.title}>收支构成</span>
                <div className={s.tab}>
                    <span onClick={() => changeTotalType('expense')} className={cx({ [s.expense]: true, [s.active]: totalType == 'expense' })}>支出</span>
                    <span onClick={() => changeTotalType('income')} className={cx({ [s.income]: true, [s.active]: totalType == 'income' })}>收入</span>
                </div>
            </div>
            <div className={s.content}>
                {(totalType == 'expense' ? expenseData : incomeData).map(item => <div key={item.type_id} className={s.item}>
                    <div className={s.left}>
                        <div className={s.type}>
                            <span className={cx({ [s.expense]: totalType == 'expense', [s.income]: totalType == 'income' })}>
                                <CustomIcon
                                    type={item.type_id ? typeMap[item.type_id].icon : 1}
                                />
                            </span>
                            <span className={s.name}>{ item.type_name }</span>
                        </div>
                        <div className={s.progress}>¥{ Number(item.number).toFixed(2) || 0 }</div>
                    </div>
                    <div className={s.right}>
                        <div className={s.percent}>
                            <Progress shape="line" percent={Number((item.number / Number(totalType == 'expense' ? totalExpense : totalIncome)) * 100).toFixed(2)} theme='primary' />
                        </div>
                    </div>
                </div>)}
            </div>
        </div>

        <div className={s.structure}>
            <div className={s.proportion}>
                <div className={s.head}>
                    <span className={s.title}>收支构成</span>
                    <div className={s.tab}>
                        <span onClick={() => changePieType('expense')} className={cx({ [s.expense]: true, [s.active]: pieType == 'expense'  })}>支出</span>
                        <span onClick={() => changePieType('income')} className={cx({ [s.income]: true, [s.active]: pieType == 'income'  })}>收入</span>
                    </div>
                </div>
                {/* 这是用于放置饼图的 DOM 节点 */}
                <div id="proportion"></div>
            </div>

        </div>
        <PopupDate ref={monthRef} mode="month" onSelect={selectMonth} />
    </div>
}

export default Data