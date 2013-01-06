var Util = {
    parse: function parse(json) {
        try {
            var obj = JSON.parse(json);
        } catch (e) {
            throw new Exception(50003);
        }
        if (obj.r != 0) {
            throw new Exception(obj.r);
        }

        return obj.d;
    },
    getFileBasename: function getFileBasename(filename) {
        return filename.split('.')[0];
    },
    getLength: function getLength(object) {
        if (Array.isArray(object)) {
            return object.length;
        } else if (typeof object === 'object') {
            var i = 0;
            for (var h in object) {
                ++i;
            }
            return i;
        } else {
            throw new Exception(10201);
        }
    },
    last: function last(object) {
        if (Array.isArray(object)) {
            return object[object.length - 1];
        } else if (typeof object === 'object') {
            var length = this.getLength(object);
            var i = 0;
            for (var h in object) {
                if (i === length - 1) {
                    return object[h];
                }
                ++i;
            }
        } else {
            throw new Exception(10202);
        }
    },
    lastIndex: function lastIndex(object) {
        if (Array.isArray(object)) {
            return object.length - 1;
        } else if (typeof object === 'object') {
            var length = this.getLength(object);
            var i = 0;
            for (var h in object) {
                if (i === length - 1) {
                    return h;
                }
                ++i;
            }
            return false;
        } else {
            throw new Exception(10207);
        }
    },
    upperCaseFirst: function upperCaseFirst(string) {
        return string[0].toUpperCase() + string.substr(1);
    },
    uniqueValue: function uniqueValue(object) {
        var exists = [];
        var value;
        if (Array.isArray(object)) {
            var result = [];
            for (var i = 0; i < object.length; ++i) {
                value = object[i];
                if (exists.indexOf(value) != -1) continue;
                exists.push(value);
                result.push(value);
            }
        } else if (typeof object === 'object') {
            var result = {};
            for (var i in object) {
                value = object[i];
                if (exists.indexOf(value) != -1) continue;
                exists.push(value);
                result[i] = value;
            }
        } else {
            throw new Exception(10208);
        }
        return result;
    },
    valueExist: function valueExist(value, object) {
        if (Array.isArray(object)) {                                
            return object.indexOf(value) !== -1;                    
        } else if (typeof object === 'object') {                    
            for (var h in object) {                                 
                if (object[h] === value) {                          
                    return true;                                    
                }                                                   
            }                                                       
            return false;                                           
        } else {                                                    
            throw new Exception(10206);                           
        }
    },
};
