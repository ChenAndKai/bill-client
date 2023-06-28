// PopupDate/index.jsx
import dayjs from 'dayjs'
import PropTypes from 'prop-types'
import React, { forwardRef, useState } from 'react'
import { DatePicker, Popup } from 'zarm'

const PopupDate = forwardRef(({ onSelect, mode = "date" }, ref) => {
    const [show, setShow] = useState(false);
    const [now, setNow] = useState(new Date());

    const closeMonth = (item) => {
        setNow(item)
        setShow(false)
        if (mode == 'month') {
            onSelect(dayjs(item).format('YYYY-MM'))
        } else if (mode == 'date') {
            onSelect(dayjs(item).format('YYYY-MM-DD'))
        }
    }

    if (ref) {
        ref.current = {
            show: () => setShow(true),
            close: () => setShow(false)
        }
    }

    return <Popup
        visible={show}
        direction="bottom"
        onMaskClick={() => setShow(false)}
        destroy={false}
        mountContainer={() => document.body}
    >
        <div>
            <DatePicker
                visible={show}
                value={now}
                mpde={mode}
                onOk={closeMonth}
                onCancel={() => setShow(false)}
            />
        </div>
    </Popup>
})

PopupDate.propTypes = {
    mode: PropTypes.string,
    onSelect: PropTypes.func
}

export default PopupDate;