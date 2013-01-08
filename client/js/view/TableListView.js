var TableListView = function TableListView() {
    this.el = $('#TableList');
    this.renderAll = function renderAll() {
        this.el.empty();
        var table;
        for (var id in tableList.list) {
            table = tableList.list[id];
            this.renderCreate(table);
        }
    };
    this.renderCreate = function renderCreate(input) {
        var data = { table: input };
        var html = Renderer.make('TableList-Table', data);
        this.el.append(html);
    };
    this.renderTableName = function renderTableName(table) {
        var id = table.id;
        $('#TableList-Table-' + id + '-Name').html(table.name);
    };
    // event
    this.openTableDefine = function openTableDefine(id) {
        var table = tableList.get(id);
        tableDefineView.renderAll(table);
    };
};
