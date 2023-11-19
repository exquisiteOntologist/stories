import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'

export interface RelativeDateProps {
    date?: string | number | Date | null
    fallback?: String
}

export const RelativeDate: React.FC<RelativeDateProps> = ({ date, fallback = '' }) => {
    const [nowDate, setNowDate] = useState<Date>(new Date())
    let timeout: NodeJS.Timeout | undefined

    useEffect(() => () => timeout && clearTimeout(timeout))

    if (!date) return <>{fallback}</>

    const notJustNow = dayjs(date).diff(dayjs(nowDate), 'hours') >= 1

    timeout = setTimeout(
        () => requestAnimationFrame(() => setNowDate(new Date())),
        notJustNow ? (1000 * 60 * 10) : (1000 * 60)
    );

    const relativeDate: string = dayjs(date).fromNow()

    return (
        <>{relativeDate}</>
    )
}
