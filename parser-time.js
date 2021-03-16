const _ = require('lodash');

const _timeDefault = {
    dayInWeek: 5,
    hourInDay: 8,
};

const formatDisplay = {
    PRIMARY: 'primary',
    VN: 'vn',
};

const _display = {
    week: {
        [formatDisplay.PRIMARY]: 'W',
        [formatDisplay.VN]: ' tuần',
    },
    day: {
        [formatDisplay.PRIMARY]: 'D',
        [formatDisplay.VN]: ' ngày',
    },
    hour: {
        [formatDisplay.PRIMARY]: 'H',
        [formatDisplay.VN]: ' giờ',
    },
    minute: {
        [formatDisplay.PRIMARY]: 'M',
        [formatDisplay.VN]: ' phút',
    }
};

const _getMS = {
    w: {
        [formatDisplay.PRIMARY]: 'W',
        [formatDisplay.VN]: ' t',
    },
    d: {
        [formatDisplay.PRIMARY]: 'D',
        [formatDisplay.VN]: ' n',
    },
    h: {
        [formatDisplay.PRIMARY]: 'H',
        [formatDisplay.VN]: ' g',
    },
    m: {
        [formatDisplay.PRIMARY]: 'M',
        [formatDisplay.VN]: ' p',
    }
};

const _regexGetMS = {
    [formatDisplay.PRIMARY]: /(\d+)(\w)/g,
    [formatDisplay.VN]: /(\d+) (\w)/g,
};

const _lengthSubDisplay = {
    [formatDisplay.PRIMARY]: 1,
    [formatDisplay.VN]: 2,
}

function convertMS(ms, options = {}) {
    if (typeof ms !== 'number') return ms;
    const format = options.formatDisplay || formatDisplay.PRIMARY;
    const dayInWeek = options.dayInWeek || _timeDefault.dayInWeek;
    const hourInDay = options.hourInDay || _timeDefault.hourInDay;

    let m = Math.floor(ms / 60000);
    let h = Math.floor(m / 60);
    let d = Math.floor(h / hourInDay);
    const w = Math.floor(d / dayInWeek);
    m = m % 60;
    h = h % hourInDay;
    d = d % dayInWeek;
    return `${ w !== 0 ? w + _display.week[format] : '' } ${ d !== 0 ? d + _display.day[format] : '' } ${ h !== 0 ? h + _display.hour[format] : '' } ${ m !== 0 ? m + _display.minute[format] : '' }`
        .trim();
}

function _getTimeConst({ m, h, d, w }, format) {
    return {
        [_getMS.w[format]]: w,
        [_getMS.d[format]]: d,
        [_getMS.h[format]]: h,
        [_getMS.m[format]]: m,
    };
}

function getTimeMS(time, options = {}) {
    if (!time) {
        return 0;
    }
    if (/^\d+$/g.test(time)) {
        return parseInt(time);
    }

    const format = options.formatDisplay || formatDisplay.PRIMARY;
    const reg = _regexGetMS[format];
    const lengthSubDisplay = _lengthSubDisplay[format];
    const dayInWeek = options.dayInWeek || _timeDefault.dayInWeek;
    const hourInDay = options.hourInDay || _timeDefault.hourInDay;

    const m = 1000 * 60;
    const h = m * 60;
    const d = h * hourInDay;
    const w = d * dayInWeek;
    const timeConst = _getTimeConst({ m, h, d, w }, format);
    return _.reduce(time.match(reg), (sum, n) => {
        const key = n.slice(-lengthSubDisplay);
        let value = parseInt(n.slice(0, -lengthSubDisplay));
        value = /^\d+$/g.test(value) ? parseInt(n.slice(0, -lengthSubDisplay)) : 0;
        if (!timeConst[key] || !/^\d+$/g.test(value)) {
            return sum + 0;
        }
        return sum + (timeConst[key] * value);
    }, 0);
}

module.exports = {
    formatDisplay,
    convertMS,
    getTimeMS,
};