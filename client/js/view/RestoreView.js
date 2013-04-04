var RestoreView = function RestoreView() {
    this.obj = null;
    this.renderAll = function renderAll() {
        var html = Renderer.make('Restore');
        $('#Content').empty().html(html);
    };
    this.renderStatus = function renderStatus(text) {
        $('#RestoreStatus').html(text);
    };
    this.preview = function preview() {
        var fileList = $('#RestoreAll-File')[0].files;
        if (fileList.length === 0) return;

        I.Util.fsRead(fileList[0], this.onPreviewLoad);
    };
    this.onPreviewLoad = function onPreviewLoad(text) {
        var view = restoreView;
        try {
            var obj = JSON.parse(text);
        } catch (e) {
            view.renderStatus('Invalid pcs file.');
            view.obj = null;
            return;
        }
        if (obj.type !== 'pcs bak') {
            view.renderStatus('Invalid pcs file.');
            view.obj = null;
            return;
        }

        view.obj = obj;
        view.renderStatus('OK');
    };
    this.onRestore = function onRestore() {
        if (this.obj === null) return;
        dialogView.renderRestore();
    };
};

