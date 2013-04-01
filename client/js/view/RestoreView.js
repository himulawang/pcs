var RestoreView = function RestoreView() {
    this.renderAll = function renderAll() {
        var html = Renderer.make('Restore');
        $('#Content').empty().html(html);
    };
    this.preview = function preview() {
        var fileList = $('#RestoreAll-File')[0].files;
        if (fileList.length === 0) return;

        I.Util.fsRead(fileList[0], this.onPreviewLoad);
    };
    this.onPreviewLoad = function onPreviewLoad(text) {
        try {
            var obj = JSON.parse(text);
        } catch (e) {
            $('#RestoreStatus').html('Invalid pcs file.');
        }
    };
};

