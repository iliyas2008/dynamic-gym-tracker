import { Calendar } from 'antd'
import enGB from 'antd/lib/calendar/locale/en_GB'
import moment from 'moment'
import React from 'react'

const CalendarView = () => {
  const { lang } = enGB
  const customLocale = {...lang, monthFormat: "MMMM", dayFormat: moment.updateLocale('en', { 
    weekdaysMin: [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ]
})
}
  const locale = {...enGB, lang: customLocale}
  
  return (
    <Calendar
    locale={locale}
     />
  )
}

export default CalendarView