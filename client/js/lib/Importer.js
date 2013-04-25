var Importer = {
    column: [],
    data: [],
    showMsg: function showMsg(text) {
        $('#TableDataError').html(text);
    },
    clearError: function clearError() {
        $('#TableDataError').html('');
    },
    enableSubmit: function enableSubmit() {
        $('#ImportTableDataSubmitButton').removeAttr('disabled');
    },
    preview: function preview() {
        var fileList = $('#ImportTableDataFile')[0].files;
        if (fileList.length === 0) return;

        I.Util.fsRead(fileList[0], this.onPreviewLoad);
    },
    onPreviewLoad: function onPreviewLoad(text) {
        // validate
        var id = $('#ImportTableId').html();
        Importer.validate(id, text);

        var preview = {};
        for (var i = 0; i < Importer.column.length; ++i) {
            preview[Importer.column[i]] = Importer.data[0][i];
        }

        $('#TableDataPreview').html(JSON.stringify(preview));
    },
    validate: function validate(id, text) {
        // split to line
        var lines = text.split("\n");
        if (!Array.isArray(lines) || lines.length <= 1) throw new I.Exception(50101);

        // check column length match
        var columnList = dataPool.get('columnList', id);

        var columns = [];
        for (var columnId in columnList.list) {
            columns.push(columnList.get(columnId));
        }

        var fileColumns = lines[0].split("\t");
        if (fileColumns.length !== columns.length) {
            this.showMsg(I.ExceptionCodes[50103]);
            throw new I.Exception(50103);
        }
        // check column name match
        for (var x = 0; x < columns.length; ++x) {
            fileColumns[x] = fileColumns[x].trim();
            if (fileColumns[x] !== columns[x].name) {
                this.showMsg(I.ExceptionCodes[50109]);
                throw new I.Exception(50109);
            }
        }

        // split to column
        var datas = [];
        for (var y = 1; y < lines.length; ++y) {
            datas[y - 1] = lines[y].split("\t");
            datas[y - 1].forEach(function(n, i) {
                datas[y - 1][i] = datas[y - 1][i].trim();
            });
        }

        var util = I.Util;
        var data, column;
        var existPK = [];
        for (var i = 0; i < datas.length; ++i) {
            for (var j = 0; j < columns.length; ++j) {
                data = datas[i][j];
                column = columns[j];
                // pk
                if (column.isPK) {
                    if (util.valueExist(data, existPK)) {
                        this.showMsg('PK confilct Row: ' + (i + 1) + ' Column: ' + (j + 1) + ' got: ' + data);
                        throw new I.Exception(50102);
                    }
                    existPK.push(data);
                }
                // allow empty
                if (column.allowEmpty) {
                    if (data === '') continue;
                } else {
                    if (data === '') throw new I.Exception(50104);
                }
                // type
                switch (column.type) {
                    case 'number':
                        if (!util.isNumber(data)) {
                            this.showMsg('ImportFile Row: ' + (i + 1) + ' Column: ' + (j + 1) + ' should be number, got: ' + data);
                            console.log('ImportFile Row: ' + (i + 1) + ' Column: ' + (j + 1) + ' should be number, got: ' + data);
                            throw new I.Exception(50105);
                        }
                        break;
                    case 'string':
                        if (!util.isString(data)) {
                            this.showMsg('ImportFile Row: ' + (i + 1) + ' Column: ' + (j + 1) + ' should be string, got: ' + data);
                            console.log('ImportFile Row: ' + (i + 1) + ' Column: ' + (j + 1) + ' should be string, got: ' + data);
                            throw new I.Exception(50106);
                        }
                        break;
                    case 'json':
                        if (!util.isJSON(data)) {
                            this.showMsg('ImportFile Row: ' + (i + 1) + ' Column: ' + (j + 1) + ' should be json, got: ' + data);
                            console.log('ImportFile Row: ' + (i + 1) + ' Column: ' + (j + 1) + ' should be json, got: ' + data);
                            throw new I.Exception(50107);
                        }
                        break;
                    default:
                        console.log('Invalide column type: ' + column.type);
                        throw new I.Exception(50108);
                }
            }
        }

        this.data = datas;
        this.column = fileColumns;
        this.showMsg('File verified!');
        this.enableSubmit();
    },
};
