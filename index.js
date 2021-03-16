const xlss = require('xlsx')
const _ = require('lodash') // 
const file = xlss.readFile("./abc.xlsx", { type: 'binary' })
const parserTime = require('./parser-time');

const POINT = {
    CheckLate: 100,
    LATE_PER_MINUTE: 1,
    NOTE_CHECK_IN: 500,
    NOT_CHECK_OUT: 50,
};

const data = (xlss.utils.sheet_to_json(file.Sheets[file.SheetNames[0]]))

const newXlss = data.map(function(item) {

    console.log(data);
    const sumDayNotCheckIn = _.get(item, 'Tổng ngày không check in')
    const sumDayNotCheckOut = _.get(item, 'Tổng ngày không check out')
    const sumLateDay = _.get(item, 'Tổng ngày đi trễ')
    const sumLateTime = parserTime.getTimeMS(_.get(item, 'Tổng thời gian đi trễ')) / 60000
    console.log(item['Họ và tên'], sumLateTime);

    const sum = sumDayNotCheckIn * POINT.NOTE_CHECK_IN + sumDayNotCheckOut * POINT.NOT_CHECK_OUT + sumLateDay * POINT.CheckLate + sumLateTime * POINT.LATE_PER_MINUTE;

    return {
        name: item['Họ và tên'],
        email: item['Email'],
        sum,
    }

});

_.forEach(_.orderBy(newXlss, ['sum'], ['desc']), (item, index) => {
    console.log(index, item);
});