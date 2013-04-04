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
        this.el.empty().html(html);

        this.renderIndexColumn(table.id, dataList);
        this.renderDataColumn(table.id, dataList);

        $('#TableData-Data')
            .on('click', '.TableData-Cell', this.enterInputModel)
            .on('scroll', this.onDataScroll);
        $('#TableData-Index').on('click', '.icon-remove-circle', this.removeData);

        Resizer.tableData();
    };
    this.makeDataRowHTML = function makeDataRowHTML(tableId, row) {
        return Renderer.make('TableData-DataRow', { tableId: tableId, row: row });
    };
    this.makeIndexRowHTML = function makeIndexRowHTML(tableId, row) {
        return Renderer.make('TableData-Index', { tableId: tableId, row: row });
    };
    this.renderIndexColumn = function renderIndexColumn(tableId, dataList) {
        var row;
        var html = '';
        for (var i in dataList.list) {
            row = dataList.get(i);
            html += this.makeIndexRowHTML(tableId, row);
        }
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
        var indexHTML = this.makeIndexRowHTML(tableId, row);
        $('#TableData-Index').append(indexHTML);

        var dataHTML = this.makeDataRowHTML(tableId, row);
        $('#TableData-Data').append(dataHTML);
    };
    this.renderDataUpdate = function renderDataUpdate(tableId, dataId, columnId, data) {
        if (!this.isViewOpened(tableId)) return;
        var el = $('#TableData-' + dataId + '-' + columnId + '-Cell');
        var columnName = data.column[columnId].abb;
        var value = data[columnName];

        var input = el.children('input');
        if (input.length !== 0) {
            if (input.val() === value) return;
            input.val(value);
            return;
        }

        el.text(value);
    };
    this.renderDataRemove = function renderDataRemove(tableId, rowId) {
        if (!this.isViewOpened(tableId)) return;
        $('#TableData-Index-' + rowId + ',' + '#TableData-Row-' + rowId).remove();
    };
    this.renderColumnNameChange = function renderColumnNameChange(id, column) {
        if (!this.isViewOpened(id)) return;
        var el = $('#TableData-Header-Column-' + column.id + '-Name');
        if (el.text() === column.name) return;
        el.text(column.name);
    };
    this.renderColumnTypeChange = function renderColumnTypeChange(id, column) {
        if (!this.isViewOpened(id)) return;
        var el = $('#TableData-Header-Column-' + column.id + '-Type');
        var type = '(' + column.type + ')';
        if (el.text() === type) return;
        el.text(type);
    };
    this.isViewOpened = function isViewOpened(id) {
        return $('#TableData-' + id + '-Sheet').length !== 0;
    };
    // event
    this.enterInputModel = function enterInputModel(e) {
        if ($(e.target).hasClass('TableData-Cell')) {
            var el = $(e.target);
            if (el.children('input').length !== 0) return;
            var value = el.text();
            var dataset = e.target.dataset;
            var data = {
                value: value,
                tableId: dataset.tableId,
                rowId: dataset.rowId,
                columnId: dataset.columnId,
            };
            var html = Renderer.make('TableData-Input', data);
            el.html(html);
            el.children('input').focus();
        }
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
    this.removeData = function removeData(e) {
        if ($(e.target).hasClass('icon-remove-circle')) {
            var dataset = e.target.dataset;
            dialogView.renderDeleteDataRowConfirm(dataset.tableId, dataset.rowId);
        }
    };
    this.onDataScroll = function onDataScroll() {
        $('#TableData-Index')[0].scrollTop = this.scrollTop;
        $('#TableData-Column-Header')[0].scrollLeft = this.scrollLeft;
    };
};
