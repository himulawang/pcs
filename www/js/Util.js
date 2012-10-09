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
    lastIndex: function last(object) {
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
            throw new Exception(10202);
        }
    },
};
