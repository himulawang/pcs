var TableListView = function TableListView() {
    this.el = $('#TableList');
    this.renderAll = function renderAll() {
        this.el.empty();
        var tableList = dataPool.get('tableList', 0);
        var table;
        for (var id in tableList.list) {
            table = tableList.list[id];
            this.renderCreate(table);
        }
    };
    this.renderCreate = function renderCreate(table) {
        var data = { table: table };
        var html = Renderer.make('TableList-Table', data);
        this.el.append(html);
    };
    this.renderTableName = function renderTableName(table) {
        var id = table.id;
        $('#TableList-Table-' + id + '-Name').html(table.name);
    };
    // event
    this.openTableDefine = function openTableDefine(id) {
        var table = dataPool.get('tableList', 0).get(id);
        tableDefineView.renderAll(table);
    };
};
