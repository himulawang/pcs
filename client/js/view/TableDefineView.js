var TableDefineView = function TableDefineView() {
    this.renderAll = function renderAll(table) {
        var data = { table: table };
        var html = Renderer.make('TableDefine', data);
        $('#Content').empty().html(html);
    };
    this.renderTableName = function renderTableName(table) {
        var id = table.id;
        $('#TableDefine-Table-' + id + '-Name').val(table.name);
    };
    this.renderTableDescription = function renderTableDescription(table) {
        var id = table.id;
        $('#TableDefine-Table-' + id + '-Description').val(table.description);
    };
    // event
    this.onTableNameChange = function onTableNameChange(id, el) {
        var table = tableList.get(id);
        table.name = el.value;
        table.update();
    };
    this.onTableDescriptionChange = function onTableDescriptionChange(id, el) {
        var table = tableList.get(id);
        table.description = el.value;
        table.update();
    };
};

