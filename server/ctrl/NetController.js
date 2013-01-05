exports.NetController = {
    GetOnlineUserCount: function GetOnlineUserCount(lc, params) {
        lc.add({
            fn: function cbGetOnlineUserCount() {
                this.cb(null, {
                    onlineUserCount: connectionPool.length(),
                });
            },
        });
    },
};
