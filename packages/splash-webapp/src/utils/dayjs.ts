import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import advanced from 'dayjs/plugin/advancedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';

const defaultTimezone = 'America/New_York';

dayjs.extend(relativeTime);
dayjs.extend(advanced);
dayjs.extend(utc);
dayjs.extend(duration);
dayjs.extend(timezone);
dayjs.tz.setDefault(defaultTimezone);

export function formatInTimezone(date: dayjs.Dayjs, format: string, timezone = defaultTimezone) {
    return date
        .tz(timezone)
        .format(format);
}

export {
    dayjs
};

export default dayjs;
