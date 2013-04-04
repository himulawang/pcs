var RestoreController = {
    restore: function restore() {
        iWebSocket.send('C1101', { obj: restoreView.obj });
    },
    onRestore: function onRestore() {
        NetController.init();
    },
};

