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

        this.renderIndexColumn(table.id, dataList);
        this.renderDataColumn(table.id, dataList);
    };
    this.makeDataRowHTML = function makeDataRowHTML(tableId, row) {
        return Renderer.make('TableData-DataRow', { tableId: tableId, row: row });
    };
    this.renderIndexColumn = function renderIndexColumn(tableId, dataList) {
        var row;
        var html = '';
        for (var i in dataList.list) {
            row = dataList.get(i);
            html += Renderer.make('TableData-Index', { row: row });
        }
        html += Renderer.make('TableData-LastRow', { tableId: tableId });
        $('#TableData-Index').html(html);
    };
    this.renderDataColumn = function renderDataColumn(tableId, dataList) {
        var row;
        var html = '';
        for (var i in dataList.list) {
            row = dataList.get(i);
            html += this.makeDataRowHTML(tableId, row);
        }
        $('#TableData-Data').html(html);
    };
    this.renderImport = function renderImport(id) {
        if (!this.isViewOpened(id)) return;
        this.renderAll(id);
    };
    this.renderRemoveTable = function renderRemoveTable(id) {
        if (!this.isViewOpened(id)) return;
        $('#Content').empty();
    };
    this.renderDataCreate = function renderDataCreate(tableId, row) {
        if (!this.isViewOpened(tableId)) return;
        var html = this.makeDataRowHTML(tableId, row);
        $('#TableData-Data').append(html);
    };
    this.renderDataUpdate = function renderDataUpdate(tableId, dataId, columnId, data) {
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
        if (value == data[columnName]) return;
        data[columnName] = value;
        DataController.Update(tableId, columnId, data);
    };
    this.createData = function createData(tableId) {
        DataController.Create(tableId);
    };
};
