export const getDate = (res) => {
  /**
   * 获取一个月多少天，并获取月初星期几
   */
  const daxier = ["一", "二", "三", "四", "五", "六", "日"];
  const date = new Date(res);
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  var date2 = new Date(y, m, 0);
  var rq = date2.getDate(); // 日 本月最后一天

  var xq = date2.getDay(); // 星期 本月第一天星期几  new Date(0).getDay()
  var rq2 = rq % 7;
  if (rq2 === 0) {
    xq = rq2 + 1;
  } else {
    if (rq2 > xq) xq += 7;
    xq = xq - rq2;
  }

  var data = [];
  for (var i = 1; i <= rq; i++) {
    data.push({
      ri: i,
      xq: daxier[xq],
      yue: m < 10 ? '0' + m : m,
      nian: y
    });

    xq = ++xq == 7 ? 0 : xq;
  }
  if (data[0].xq == "二") {
    data.unshift({
      ri: "t",
      xq: "一"
    });
  }
  if (data[0].xq == "三") {
    data.unshift({
      ri: "t",
      xq: "一"
    }, {
      ri: "t",
      xq: "二"
    });
  }
  if (data[0].xq == "四") {
    data.unshift({
      ri: "t",
      xq: "一"
    }, {
      ri: "t",
      xq: "二"
    }, {
      ri: "t",
      xq: "三"
    });
  }
  if (data[0].xq == "五") {
    data.unshift({
      ri: "t",
      xq: "一"
    }, {
      ri: "t",
      xq: "二"
    }, {
      ri: "t",
      xq: "三"
    }, {
      ri: "t",
      xq: "四"
    });
  }
  if (data[0].xq == "六") {
    data.unshift({
      ri: "t",
      xq: "一"
    }, {
      ri: "t",
      xq: "二"
    }, {
      ri: "t",
      xq: "三"
    }, {
      ri: "t",
      xq: "四"
    }, {
      ri: "t",
      xq: "五"
    });
  }
  if (data[0].xq == "日") {
    data.unshift({
      ri: "t",
      xq: "一"
    }, {
      ri: "t",
      xq: "二"
    }, {
      ri: "t",
      xq: "三"
    }, {
      ri: "t",
      xq: "四"
    }, {
      ri: "t",
      xq: "五"
    }, {
      ri: "t",
      xq: "六"
    });
  }
  return data;
}
/* 比较两个日期大小 */
export const compareDate = (date1, date2) => {
  if (date1 > date2) {
    return [date2, date1]
  }
  if (date1 < date2) {
    return [date1, date2]
  }
  if (date1 == date2) {
    return [date1, date2]
  }
}
/* 是否在日期范围内 */
export const compareTwoDate = (startDate, endDate, data) => {
  if (startDate && endDate && data) {
    if (data >= startDate && data <= endDate) {
      return true
    } else {
      return false
    }
  }
}
// n 传入几就是前几天
export const getBeforeDate = (n, date) => {
  // var n = n;
  var d = new Date(date);
  var year = d.getFullYear();
  var mon = d.getMonth() + 1;
  var day = d.getDate();
  if (day <= n) {
    if (mon > 1) {
      mon = mon - 1;
    } else {
      year = year - 1;
      mon = 12;
    }
  }
  d.setDate(d.getDate() - n);
  year = d.getFullYear();
  mon = d.getMonth() + 1;
  day = d.getDate();
  let s =
    year +
    "-" +
    (mon < 10 ? "0" + mon : mon) +
    "-" +
    (day < 10 ? "0" + day : day);
  return s;
}
/* 获取日期后一个月 */
export const getAfterDate = (d, m) => {
  var ds = d.split('-'),
    _d = ds[2] - 0;
  var nextM = new Date(ds[0], ds[1] - 1 + m + 1, 0);
  var max = nextM.getDate();
  d = new Date(ds[0], ds[1] - 1 + m, _d > max ? max : _d);
  let yy = d.toLocaleDateString().match(/\d+/g).join('-').split('-')[0];
  let mm = d.toLocaleDateString().match(/\d+/g).join('-').split('-')[1] < 10 ? '0' + d.toLocaleDateString().match(/\d+/g).join('-').split('-')[1] : d.toLocaleDateString().match(/\d+/g).join('-').split('-')[1];
  let dd = d.toLocaleDateString().match(/\d+/g).join('-').split('-')[2] < 10 ? '0' + d.toLocaleDateString().match(/\d+/g).join('-').split('-')[1] : d.toLocaleDateString().match(/\d+/g).join('-').split('-')[1]
  return yy + '-' + mm + '-' + dd
}
/**
 *获取30天后的输入日期
 *{param:DateTime} date 输入日期(YYYY-MM-DD)
 *{param:number } monthNum 月数
 */
export const GetNextMonthDay = (sdate, interval, caret) => {
  var patt1 = /^\d{4}-([0-1]?[0-9])-([0-3]?[0-9])$/; //判断输入的日期是否符合格式正则表达式
  if (!(sdate && typeof (sdate) == "string" && patt1.test(sdate))) {
    sdate = new Date(); //不满足日期的则使用当前年月日
  }
  interval = isNaN(parseInt(interval)) ? 0 : parseInt(interval); //若没有输入间隔，则使用当前日
  caret = (caret && typeof (caret) == "string") ? caret : "-"; // 默认间隔符为'-'
  var gdate = new Date(sdate).getTime(); //获取指定年月日
  gdate = gdate + 1000 * 60 * 60 * 24 * interval; //加减相差毫秒数
  var speDate = new Date(gdate); //获取指定好毫秒数时间
  var preYear = speDate.getFullYear();
  var preMonth = speDate.getMonth() + 1;
  var preDay = speDate.getDate();
  preMonth = (preMonth < 10) ? ("0" + preMonth) : preMonth;
  preDay = (preDay < 10) ? ("0" + preDay) : preDay;
  var preDate = preYear + caret + preMonth + caret + preDay;
  return preDate;
}


export const chargeDate = (date) => {
  let nowTime = getTime() + '-' + getDay()
  let result = ""
  if (date > nowTime) {
    result = 'big'
  }
  if (date <= nowTime) {
    result = 'small'
  }
  return result
}
/*  */
export const isAllow = (time) => {
  let nowTime = getTime() + '-' + getDay()
  let result = ''
  if (nowTime < time) {
    result = 'not'
  }
  if (nowTime >= time) {
    result = 'allow'
  }
  return result
}
export const isAllowDate = (time1, time2) => {
  if (time1 && time2 && time1 != '' && time2 != '') {
    let nowTime = time1
    let result = ''
    if (nowTime < time2) {
      result = 'not'
    }
    if (nowTime >= time2) {
      result = 'allow'
    }
    return result
  } else {
    return 'not'
  }
}
/* 完整的当前时间 */
export const getQueryTime = () => {
  let dateTime
  let yy = new Date().getFullYear()
  let mm = new Date().getMonth() + 1
  let dd = new Date().getDate()
  let hh = new Date().getHours()
  let mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() :
    new Date().getMinutes()
  let ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() :
    new Date().getSeconds()

  dateTime = yy + '-' + (mm < 10 ? ('0' + mm) : mm) + '-' + (dd < 10 ? ('0' + dd) : dd) + ' ' + (hh < 10 ? ('0' + hh) : hh) + ':' + mf + ':' + ss
  return dateTime
}
// 获取当前时间
export const getNowTime = () => {
  let dateTime
  // let yy = new Date().getFullYear()
  // let mm = new Date().getMonth() + 1
  // let dd = new Date().getDate()
  let hh = new Date().getHours()
  let mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() :
    new Date().getMinutes()
  let ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() :
    new Date().getSeconds()
  // yy + '-' + mm + '-' + dd + ' ' + 
  dateTime = hh + ':' + mf + ':' + ss
  return dateTime
}
export const getNowTimeFull = () => {
  let dateTime
  let yy = new Date().getFullYear()
  let mm = new Date().getMonth() + 1
  let dd = new Date().getDate()
  let hh = new Date().getHours()
  let mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() :
    new Date().getMinutes()
  let ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() :
    new Date().getSeconds()

  dateTime = yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf + ':' + ss
  return dateTime
}

/* 年月 */
export const getTime = () => {
  var date = new Date();
  var seperator1 = "-";
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = year + seperator1 + month;
  return currentdate;
}
/* 日 */
export const getDay = () => {
  var date = new Date();
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = strDate;
  return currentdate;
}

/* 日 */
export const getDay2 = () => {
  var date = new Date();
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  return month;
}

export const getLastYm = (data) => {
  let year = data.split('-')[0];
  let arr = [{
      name: "一月",
      date: 1,
      y: Number(year.split('-')[0])
    },
    {
      name: "二月",
      date: 2,
      y: Number(year.split('-')[0])
    },
    {
      name: "三月",
      date: 3,
      y: Number(year.split('-')[0])
    },
    {
      name: "四月",
      date: 4,
      y: Number(year.split('-')[0])
    },
    {
      name: "五月",
      date: 5,
      y: Number(year.split('-')[0])
    },
    {
      name: "六月",
      date: 6,
      y: Number(year.split('-')[0])
    },
    {
      name: "七月",
      date: 7,
      y: Number(year.split('-')[0])
    },
    {
      name: "八月",
      date: 8,
      y: Number(year.split('-')[0])
    },
    {
      name: "九月",
      date: 9,
      y: Number(year.split('-')[0])
    },
    {
      name: "十月",
      date: 10,
      y: Number(year.split('-')[0])
    },
    {
      name: "十一月",
      date: 11,
      y: Number(year.split('-')[0])
    },
    {
      name: "十二月",
      date: 12,
      y: Number(year.split('-')[0])
    },
  ]
  return arr
}

export const getNextYm = (data) => {
  let year = data.split('-')[0];
  let arr = [{
      name: "一月",
      date: 1,
      y: Number(year.split('-')[0]) + 1
    },
    {
      name: "二月",
      date: 2,
      y: Number(year.split('-')[0]) + 1
    },
    {
      name: "三月",
      date: 3,
      y: Number(year.split('-')[0]) + 1
    },
    {
      name: "四月",
      date: 4,
      y: Number(year.split('-')[0]) + 1
    },
    {
      name: "五月",
      date: 5,
      y: Number(year.split('-')[0]) + 1
    },
    {
      name: "六月",
      date: 6,
      y: Number(year.split('-')[0]) + 1
    },
    {
      name: "七月",
      date: 7,
      y: Number(year.split('-')[0]) + 1
    },
    {
      name: "八月",
      date: 8,
      y: Number(year.split('-')[0]) + 1
    },
    {
      name: "九月",
      date: 9,
      y: Number(year.split('-')[0]) + 1
    },
    {
      name: "十月",
      date: 10,
      y: Number(year.split('-')[0]) + 1
    },
    {
      name: "十一月",
      date: 11,
      y: Number(year.split('-')[0]) + 1
    },
    {
      name: "十二月",
      date: 12,
      y: Number(year.split('-')[0]) + 1
    },
  ]
  return arr
}

export const getLastTime = (date) => {
  var arr = date.split('-');
  var year = arr[0]; //获取当前日期的年份
  var month = arr[1]; //获取当前日期的月份
  var day = arr[2]; //获取当前日期的日
  // var days = new Date(year, month, 0);
  // days = days.getDate(); //获取当前日期中月的天数
  var year2 = year;
  var month2 = parseInt(month) - 1;
  if (month2 == 0) {
    year2 = parseInt(year2) - 1;
    month2 = 12;
  }
  var day2 = day;
  var days2 = new Date(year2, month2, 0);
  days2 = days2.getDate();
  if (day2 > days2) {
    day2 = days2;
  }
  if (month2 < 10) {
    month2 = '0' + month2;
  }
  var t2 = year2 + '-' + month2;
  return t2;
}

export const getNextTime = (date) => {
  var arr = date.split('-');
  var year = arr[0]; //获取当前日期的年份
  var month = arr[1]; //获取当前日期的月份
  var day = arr[2]; //获取当前日期的日
  // var days = new Date(year, month, 0);
  // days = days.getDate(); //获取当前日期中的月的天数
  var year2 = year;
  var month2 = parseInt(month) + 1;
  if (month2 == 13) {
    year2 = parseInt(year2) + 1;
    month2 = 1;
  }
  var day2 = day;
  var days2 = new Date(year2, month2, 0);
  days2 = days2.getDate();
  if (day2 > days2) {
    day2 = days2;
  }
  if (month2 < 10) {
    month2 = '0' + month2;
  }

  var t2 = year2 + '-' + month2;
  return t2;
}

export const format = function (date, fmt) {
  var o = {
    "M+": date.getMonth() + 1, //月份
    "d+": date.getDate(), //日
    "h+": date.getHours(), //小时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
    "S": date.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
}
// 返回本月的第一天
export function monthFirstDay() {
  var date = new Date()
  date.setDate(1)
  var month = parseInt(date.getMonth() + 1)
  var day = date.getDate()
  if (month < 10) {
    month = '0' + month
  }
  if (day < 10) {
    day = '0' + day
  }
  return (date.getFullYear() + '-' + month + '-' + day)
}