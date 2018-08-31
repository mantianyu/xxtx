const chinaId = function (id) {
  let that = {};
  that.isOK = false;
  that.error = '';

  if (!id || typeof (id) != 'string' || id.length != 15 && id.length != 18 ||
    !id.match(/^[0-9]{15}$/) && !id.match(/^[0-9]{17}[0-9xX]$/) || "111111111111111" == id) {
    that.error = '输入不是15位或者18位有效字符串';
    return false;
  }

  var area = {
    11: "北京",
    12: "天津",
    13: "河北",
    14: "山西",
    15: "内蒙古",
    21: "辽宁",
    22: "吉林",
    23: "黑龙江",
    31: "上海",
    32: "江苏",
    33: "浙江",
    34: "安徽",
    35: "福建",
    36: "江西",
    37: "山东",
    41: "河南",
    42: "湖北",
    43: "湖南",
    44: "广东",
    45: "广西",
    46: "海南",
    50: "重庆",
    51: "四川",
    52: "贵州",
    53: "云南",
    54: "西藏",
    61: "陕西",
    62: "甘肃",
    63: "青海",
    64: "宁夏",
    65: "新疆",
    71: "台湾",
    81: "香港",
    82: "澳门",
    91: "国外"
  };

  that.areaName = area[id.substr(0, 2)];
  if (!that.areaName) {
    that.error = '前2位不是有效的行政区划代码';
    return false;
  };

  if (id.length == 15) {
    that.year = parseInt(id.substr(6, 2));
    that.month = parseInt(id.substr(8, 2));
    that.day = parseInt(id.substr(10, 2));
  } else {
    that.year = parseInt(id.substr(6, 4));
    that.month = parseInt(id.substr(10, 2));
    that.day = parseInt(id.substr(12, 2));
  }

  that.error = '出生日期不正确';
  if (that.month > 12) {
    return false;
  }
  if (that.day > 31) {
    return false;
  }
  // February can't be greater than 29 (leap year calculation comes later)
  if ((that.month == 2) && (that.day > 29)) {
    return false;
  }
  // check for months with only 30 days
  if ((that.month == 4) || (that.month == 6) || (that.month == 9) ||
    (that.month == 11)) {
    if (that.day > 30) {
      return false;
    }
  }
  // if 2-digit year, use 50 as a pivot date
  if (that.year < 100) {
    that.year += 1900;
  }
  if (that.year > 9999) {
    return false;
  }
  // check for leap year if the month and day is Feb 29
  if ((that.month == 2) && (that.day == 29)) {
    var div4 = that.year % 4;
    var div100 = that.year % 100;
    var div400 = that.year % 400;
    // if not divisible by 4, then not a leap year so Feb 29 is invalid
    if (div4 != 0) {
      return false;
    }
    // at that point, year is divisible by 4. So if year is divisible by
    // 100 and not 400, then it's not a leap year so Feb 29 is invalid
    if ((div100 == 0) && (div400 != 0)) {
      return false;
    }
  }
  that.yearStr = '' + that.year;
  that.monthStr = (that.month < 10 ? '0' : '') + that.month;
  that.dayStr = (that.day < 10 ? '0' : '') + that.day;

  // date is valid
  var birthDay = new Date(that.year, that.month - 1, that.day);

  if (birthDay - new Date() >= 0 || birthDay - new Date(1850, 1, 1) <= 0) {
    return false;
  }

  that.error = '';
  var lastNum = id.length == '15' ? id.substr(14, 1) : id.substr(16, 1);
  that.sex = (lastNum == '1' || lastNum == '3' || lastNum == '5' ||
    lastNum == '7' || lastNum == '9') ? '1' : '0';
  that.sexName = that.sex == '1' ? '男' : '女';
  if (id.length == '15') {
    that.isOK = true;
    return true;
  }

  var getLastValidationLetter = function (str) {
    var strArray = new Array(17);
    // 存储身份证的前17为数字
    var Wi = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2,
      1);
    // 表示第i位置上的加权因子
    var Y = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
    // 校验码值
    var S = 0;
    // 十七位数字本体码加权求和
    var jym = 0;
    // 校验码

    for (var i = 16; i >= 0; i -= 1) {
      strArray[i] = Number(str.charAt(i));
    }

    for (var j = 16; j >= 0; j -= 1) {
      S += strArray[j] * Wi[j];
    }

    jym = S % 11;
    return Y[jym];
  };

  if (id.substr(17, 1) != getLastValidationLetter(id.substr(0, 17))) {
    that.error = '18位身份证编码最后一位校验码不正确';
    return false;
  }

  that.isOK = true;
  return true;
}

export default chinaId;
