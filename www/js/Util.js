var Util = {
    parse: function(json) {
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
    getFileBasename: function(filename) {
        return filename.split('.')[0];
    },
};
