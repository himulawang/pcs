var NetController = {
    Connect: function Connect(onready) {
        iWebSocket = new IWebSocket().start(WS_URL, WS_PROTOCOL);
        iWebSocket.onopen = function onopen() {
            $('#Status').html('<span class="label label-success">Online </span>');
            NetController.GetOnlineUserCount();
            onready();
        };
        iWebSocket.onclose = function onclose() {
            $('#Status').html('<span class="label label-important">Offline </span>');
            $('#OnlineUser').html('<span class="badge badge-default"> ? </span>');
        };
    },
    GetOnlineUserCount: function GetOnlineUserCount() {
        iWebSocket.send('C0002');
    },
    onGetOnlineUserCount: function onGetOnlineUserCount(data) {
        $('#OnlineUser').html('<span class="badge badge-info">' + data.onlineUserCount + '</span>');
    },
};
