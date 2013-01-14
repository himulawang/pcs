var TableDefineView = function TableDefineView() {
    this.name = '#TableDefine';
    this.childType = {
        table: 'Table',
        column: 'Column',
    };
    this.makeId = function makeId(type, id, attr) {
        return $(this.name + '-' + this.childType[type] + '-' + id + '-' + Util.upperCaseFirst(attr));
    };
    this.renderAll = function renderAll(table) {
        // table define
        var data = { table: table };
        var html = Renderer.make('TableDefine', data);
        $('#Content').empty().html(html);

        // column
        var columnList = dataPool.get('columnList', table.id);
        for (var id in columnList.list) {
            this.renderAddColumn(table.id, columnList.get(id));
        }
    };
    this.renderTableName = function renderTableName(table) {
        if (!this.isViewOpened(table.id)) return;
        var id = table.id;
        var el = this.makeId('table', id, 'name');
        el.val(table.name);
    };
    this.renderTableDescription = function renderTableDescription(table) {
        if (!this.isViewOpened(table.id)) return;
        var id = table.id;
        var el = this.makeId('table', id, 'description');
        el.val(table.description);
    };
    this.renderAddColumn = function renderAddColumn(listId, column) {
        if (!this.isViewOpened(listId)) return;
        var data = { listId: listId, column: column };
        var html = Renderer.make('TableDefine-Column', data);
        $('#ColumnList').append(html);
    };
    this.renderRemoveColumn = function renderRemoveColumn(listId, id) {
        if (!this.isViewOpened(listId)) return;
        var el = this.makeId('column', id, 'div');
        el.remove();
    };
    this.renderColumnName = function renderColumnName(listId, column) {
        if (!this.isViewOpened(listId)) return;
        var data = { listId: listId, column: column };
        var el = this.makeId('column', column.id, 'name');
        el.val(column.name);
    };
    this.renderColumnIsPK = function renderColumnIsPK(listId, column) {
        if (!this.isViewOpened(listId)) return;
        var data = { listId: listId, column: column };
        var el = this.makeId('column', column.id, 'isPK');
        el.attr('checked', column.isPK ? 'checked' : null);
    };
    this.renderColumnAllowEmpty = function renderColumnAllowEmpty(listId, column) {
        if (!this.isViewOpened(listId)) return;
        var data = { listId: listId, column: column };
        var el = this.makeId('column', column.id, 'allowEmpty');
        el.attr('checked', column.allowEmpty ? 'checked' : null);
    };
    this.renderColumnType = function renderColumnType(listId, column) {
        if (!this.isViewOpened(listId)) return;
        var data = { listId: listId, column: column };
        var el = this.makeId('column', column.id, 'type');
        el.val(column.type);
    };
    this.renderColumnClient = function renderColumnClient(listId, column) {
        if (!this.isViewOpened(listId)) return;
        var data = { listId: listId, column: column };
        var el = this.makeId('column', column.id, 'client');
        el.attr('checked', column.client ? 'checked' : null);
    };
    this.renderColumnServer = function renderColumnServer(listId, column) {
        if (!this.isViewOpened(listId)) return;
        var data = { listId: listId, column: column };
        var el = this.makeId('column', column.id, 'server');
        el.attr('checked', column.server ? 'checked' : null);
    };
    this.renderColumnDescription = function renderColumnDescription(listId, column) {
        if (!this.isViewOpened(listId)) return;
        var data = { listId: listId, column: column };
        var el = this.makeId('column', column.id, 'description');
        el.val(column.description);
    };
    this.isViewOpened = function isViewOpened(tableId) {
        var el = this.makeId('table', tableId, 'id');
        if (el.length !== 0) return true;
    };
    // event
    this.onTableNameChange = function onTableNameChange(id, el) {
        var table = dataPool.get('tableList', 0).get(id);
        table.name = el.value;
        table.update();
    };
    this.onTableDescriptionChange = function onTableDescriptionChange(id, el) {
        var table = dataPool.get('tableList', 0).get(id);
        table.description = el.value;
        table.update();
    };
    this.onColumnNameChange = function onColumnNameChange(listId, columnId, el) {
        var column = dataPool.get('columnList', listId).get(columnId);
        column.name = el.value;
        column.update(listId, column);
    };
    this.onColumnIsPKChange = function onColumnIsPKChange(listId, columnId, el) {
        var column = dataPool.get('columnList', listId).get(columnId);
        column.isPK = Util.isChecked(el);
        column.update(listId, column);
    };
    this.onColumnAllowEmptyChange = function onColumnAllowEmptyChange(listId, columnId, el) {
        var column = dataPool.get('columnList', listId).get(columnId);
        column.allowEmpty = Util.isChecked(el);
        column.update(listId, column);
    };
    this.onColumnTypeChange = function onColumnTypeChange(listId, columnId, el) {
        var column = dataPool.get('columnList', listId).get(columnId);
        column.type = $(el).val();
        column.update(listId, column);
    };
    this.onColumnClientChange = function onColumnClientChange(listId, columnId, el) {
        var column = dataPool.get('columnList', listId).get(columnId);
        column.client = Util.isChecked(el);
        column.update(listId, column);
    };
    this.onColumnServerChange = function onColumnServerChange(listId, columnId, el) {
        var column = dataPool.get('columnList', listId).get(columnId);
        column.server = Util.isChecked(el);
        column.update(listId, column);
    };
    this.onColumnDescriptionChange = function onColumnDescriptionChange(listId, columnId, el) {
        var column = dataPool.get('columnList', listId).get(columnId);
        column.description = $(el).val();
        column.update(listId, column);
    };
    this.addColumn = function addColumn(tableId) {
        var column = new I.Models.Column();
        column.create(tableId);
    };
    this.delColumn = function delColumn(tableId, columnId) {
        dataPool.get('columnList', tableId).get(columnId).remove(tableId, columnId);
    };
};
