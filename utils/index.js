var path = require('path');
var config = require('./config.json');

exports.unique = function(data) {
    data = data || [];
    var a = {},
        i = 0,
        len = data.length;
    for (; i < len; i++) {
        var v = data[i];
        if ('undefined' === typeof(a[v])) {
            a[v] = 1;
        }
    }
    data.length = 0;
    for (i in a) {
        if (a.hasOwnProperty(i)) {
            data.push(i);
        }
    }
    return data;
};

exports.checkFilePath = function(filepath, typelist, src) {
    var param = filepath.match(/(^.+\?\?)|(.+$)/gi);
    if (param) {
        var types = new RegExp("[^\,]+\.(" + typelist + ")(?=$|[\,|\?])", "gi");
        if (param[0]) {
            var matched = path.normalize(param[0]).match(types);
            if (matched) {
                matched = exports.unique(matched);
                var extension = matched.map(function(element) {
                    var typeReg = new RegExp("(\)(" + typelist + ")");
                    return element.match(typeReg)[2];
                });
                if (exports.unique(extension).length === 1) {
                    var root = param[0].slice(0, -2);
                    var files = matched.map(function(element) {
                            var t = element.indexOf('?');
                            element = (t !== -1) ? element.slice(0, t) : element;
                            return path.join(src + element);
                        });
                    return files;
                }
            }
        }
    }
    return null;
};

exports.decode = function(province_code, city_code) {
    var area = config.area,
        province = '',
        city = '';
    for(var i = 0; i < area.length; i++) {
        if(area[i].province_code === province_code) {
            province = area[i].province;
            for(var n = 0; n < area[i].cities.length; n++) {
                if(area[i].cities[n].city_code === city_code) {
                    city = area[i].cities[n].city;
                }
            }
        }
    }
    return {
        province : province,
        city : city
    };
};

exports.encode = function(province, city) {
    var area = config.area,
        province_code = '',
        city_code = '';
    for(var i = 0; i < area.length; i++) {
        if(area[i].province === province) {
            province_code = area[i].province_code;
            for(var n = 0; n < area[i].cities.length; n++) {
                if(area[i].cities[n].city === city) {
                    city_code = area[i].cities[n].city_code;
                }
            }
        }
    }
    return {
        province_code : province_code,
        city_code :city_code
    };
};

exports.mixin= function(source,target){
    for(var i in target){
        if(target.hasOwnProperty(i)){
            source[i] = target[i];
        }
    }
    return source;
};

exports.noop = function(){};

/*更新session*/
exports.updateSession = function(req,obj){
    var session = req.session;
    if(session){
        for(var k in obj){
            if(obj.hasOwnProperty(k)){
                if(k in session){
                    session[k] = obj[k];
                }
            }
        }
    }
};

exports.uniq = function(dates){
    var result = [],
        hash = {};
    for(var key of dates) {
        if(!hash[key]) {
            result.push(key);
            hash[key] = true;
        }
    }
    return result;
};

exports.toTable = function(data, rows, cols, count) {
    var newData = [];
    for(var i = 0; i < data.length; i++) {
        var obj = {
            data : data[i],
            rows : rows[i],
            cols : cols[i]
        };
        if(count && count[i]) {
            obj.count = count[i];
        }
        newData.push(obj);
    }
    return newData;
};

exports.sort = function(array, first, second) {
    for(var i = 0;i < array.length; i++) {
        var j = i,
            key = array[i];
        while(--j > -1) {
            if (array[j][first] < key[first]) {
                array[j + 1] = array[j];
            } else if(array[j][first] === key[first]) {
                if (array[j][second] < key[second]) {
                    array[j + 1] = array[j];
                } else {
                    break;
                }
            } else {
                break;
            }
        }
        array[j + 1] = key;
    }
    return array;
};

exports.toFixed = function(one, two) {
    return (one / (two === 0 ? 1 : two) * 100).toFixed(2) + "%";
};

exports.percentage = function(one, two) {
    return (one / (two === 0 ? 1 : two) * 100).toFixed(2);
};

exports.toRound = function(one, two) {
    return Math.round(one / (two === 0 ? 1 : two) * 100);
};

exports.division = function(one, two) {
    return (one / (two === 0 ? 1 : two)).toFixed(2);
};

exports.round = function(one, two) {
    return Math.round((one / (two === 0 ? 1 : two)));
};

exports.contrast = function(one, two) {
    return (one - two) / (two === 0 ? 1 : two);
};

exports.ceil = function(one, two) {
    return Math.ceil((one / (two === 0 ? 1 : two)));
};

exports.getDate = function(date){
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
};

exports.times = function(startTime, endTime, day_type) {
    var start = new Date(startTime).getTime(),
        end = new Date(endTime).getTime(),
        year = new Date(start).getFullYear(),
        month = new Date(start).getMonth() + 1,
        array = [];
    while(start <= end) {
        if(day_type === '1') {
            array.push(exports.getDate(new Date(start)));
            start = start + 24 * 60 * 60 * 1000;
        } else if(day_type === '2') {
            if(new Date(start).getDay() === 0) {
                array.push(exports.getDate(new Date(start)));
                start = start + 7 * 24 * 60 * 60 * 1000;
            } else {
                start = start + 24 * 60 * 60 * 1000;
            }
        } else if(day_type === '3') {
            if(new Date(start).getDate() ===
                new Date(new Date(year, month, 1).getTime() - 24 * 60 * 60 * 1000).getDate()) {
                month++;
                array.push(exports.getDate(new Date(start)));
                start = new Date(year, month, 1).getTime() - 24 * 60 * 60 * 1000;
            } else {
                start = new Date(year, month, 1).getTime() - 24 * 60 * 60 * 1000;
            }
        }
    }
    return array;
};

exports.getClientIp = function(req) {
    var ipAddress;
    var forwardedIpsStr = req.header('x-forwarded-for');
    if (forwardedIpsStr) {
        var forwardedIps = forwardedIpsStr.split(',');
        ipAddress = forwardedIps[0];
    }
    if (!ipAddress) {
        ipAddress = req.connection.remoteAddress;
    }
    return ipAddress;
};

exports.date = function(date, day_type) {
    var startTime = "";

    if(day_type === "1") {
        startTime = new Date(
            exports.getDate(
                new Date(
                    new Date(date) - 24 * 60 * 60 * 1000
                )
            ) + " 00:00:00"
        )
    } else if(day_type === "2") {
        startTime = new Date(
            exports.getDate(
                new Date(
                    new Date(date) - 7 * 24 * 60 * 60 * 1000
                )
            ) + " 00:00:00"
        )
    } else {
        var start = new Date(date),
            year = new Date(start).getFullYear(),
            month = new Date(start).getMonth();
        startTime = new Date(new Date(year, month, 1).getTime() - 24 * 60 * 60 * 1000);
    }

    return startTime;
};
