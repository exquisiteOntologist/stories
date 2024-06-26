import dayjs from "dayjs";

/** Get the time in minutes since a date */
export const minutesSince = (dateFrom: string | Date) => {
    const dur = dayjs.duration(dayjs(new Date()).diff(dayjs(dateFrom)));
    return dur.asMinutes();
};

/** Get time from date */
export const time = (s: string | Date): number => new Date(s).getTime();
export const sortRecencyDescending = (dateA: string | Date, dateB: string | Date) => time(dateB) - time(dateA);
