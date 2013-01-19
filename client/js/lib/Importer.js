var Importer = {
    data: [],
    preview: function preview() {
        var fileList = $('#ImportTableDataFile')[0].files;
        if (fileList.length === 0) return;

        I.Util.fsRead(fileList[0], this.onPreviewLoad);
    },
    onPreviewLoad: function onPreviewLoad(text) {
        var lines = text.split("\n");
        if (!Array.isArray(lines) || lines.length <= 1) throw new I.Exception(50101);

        var columns = lines[0].split("\t");
        var data = lines[1].split("\t");
        var preview = {};
        columns.forEach(function(n, i) {
            preview[n] = data[i];
        });

        $('#TableDataPreview').html(JSON.stringify(preview));

        this.data = lines;
    },
    validate: function validate(id) {
        var columnList = dataPool.get('columnList', id);

        columns = [];
        for (var columnId in columnList.list) {
            columns.push(columnList.get(columnId));
        }

        for (var i = 1; i < this.data.length; ++i) {
            
        }
    },
};
