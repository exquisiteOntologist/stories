import dayjs from "dayjs";

/** Get the time in minutes since a date */
export const minutesSince = (dateFrom: string | Date) => {
    const dur = dayjs.duration(dayjs(new Date()).diff(dayjs(dateFrom)));
    return dur.asMinutes();
};
