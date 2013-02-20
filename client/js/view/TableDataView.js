var TableDataView = function TableDataView() {
    this.el = $('#Content');
    this.renderAll = function renderAll(id) {
        this.el.empty();
        var table = dataPool.get('tableList', 0).get(id);
        var columnList = dataPool.get('columnList', id);
        var dataList = dataPool.get('dataList', id);
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
    this.isViewOpened = function isViewOpened(id) {
        return $('#TableData-' + id + '-Sheet').length !== 0;
    };
};

