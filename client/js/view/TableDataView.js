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
    this.isViewOpened = function isViewOpened(id) {
        return $('#TableData-' + id + '-Sheet').length !== 0;
    };
    // event
    this.enterInputModel = function enterInputModel(rowId, columnId, el) {
        el = $(el);
        var value = el.text();
        var data = {
            value: value,
            rowId: rowId,
            columnId: columnId,
        };
        var html = Renderer.make('TableData-Input', data);
        el.html(html);
    };
    this.leaveInputModel = function leaveInputModel(rowId, columnId, el) {
        el = $(el);
        var value = el.val();
        el.parent().html(value);
    };
};

