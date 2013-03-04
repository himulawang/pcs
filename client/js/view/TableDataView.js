var TableDataView = function TableDataView() {
    this.el = $('#Content');
    this.renderAll = function renderAll(id) {
        this.el.empty();
        var table = dataPool.get('tableList', 0).get(id);
        var columnList = dataPool.get('columnList', id);
        var dataList = dataPool.get('dataList', id);
        if (dataList === undefined) {
            // fake one
            dataList = { list: {} };
        }
        var data = {
            table: table,
            columnList: columnList,
            dataList: dataList,
        };
        var html = Renderer.make('TableData', data);
        this.el.html(html);
    };
    this.renderImport = function renderImport(id) {
        if (!this.isViewOpened(id)) return;
        this.renderAll(id);
    };
    this.renderRemoveTable = function renderRemoveTable(id) {
        if (!this.isViewOpened(id)) return;
        $('#Content').empty();
    };
    this.renderDataChange = function renderDataChange(tableId, dataId, columnId, data) {
        if (!this.isViewOpened(tableId)) return;
        var el = $('#TableData-' + dataId + '-' + columnId + '-Cell');
        var columnName = data.column[columnId].abb;
        var value = data[columnName];

        var input = el.children('input');
        if (input.length !== 0) {
            input.val(value);
            return;
        }

        el.html(value);
    };
    this.isViewOpened = function isViewOpened(id) {
        return $('#TableData-' + id + '-Sheet').length !== 0;
    };
    // event
    this.enterInputModel = function enterInputModel(tableId, rowId, columnId, el) {
        el = $(el);
        if (el.children('input').length !== 0) return;
        var value = el.text();
        var data = {
            value: value,
            tableId: tableId,
            rowId: rowId,
            columnId: columnId,
        };
        var html = Renderer.make('TableData-Input', data);
        el.html(html);
        el.children('input').focus();
    };
    this.leaveInputModel = function leaveInputModel(rowId, columnId, el) {
        el = $(el);
        var value = el.val();
        el.parent().html(value);
    };
    this.onDataChange = function onDataChange(tableId, rowId, columnId, el) {
        var dataList = dataPool.get('dataList', tableId);
        var data = dataList.get(rowId);
        var columnName = data.column[columnId].abb;

        var value = $(el).val();
        data[columnName] = value;
        DataController.Update(tableId, columnId, data);
    };
};
