var TableDefineView = function TableDefineView() {
    this.name = '#TableDefine';
    this.childType = {
        table: 'Table',
        column: 'Column',
    };
    this.makeId = function makeId(type, id, attr) {
        return $(this.name + '-' + this.childType[type] + '-' + id + '-' + I.Util.upperCaseFirst(attr));
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

        Resizer.tableDefine();
    };
    this.renderRemoveTable = function renderRemoveTable(id) {
        if (!this.isViewOpened(id)) return;
        indexView.clearContent();
    };
    this.renderTableName = function renderTableName(table) {
        if (!this.isViewOpened(table.id)) return;
        var id = table.id;
        var el = this.makeId('table', id, 'name');
        if (el.val() === table.name) return;
        el.val(table.name);
    };
    this.renderTableDescription = function renderTableDescription(table) {
        if (!this.isViewOpened(table.id)) return;
        var id = table.id;
        var el = this.makeId('table', id, 'description');
        if (el.val() === table.description) return;
        el.val(table.description);
    };
    this.renderAddColumn = function renderAddColumn(listId, column) {
        if (!this.isViewOpened(listId)) return;
        var data = { listId: listId, column: column };
        var html = Renderer.make('TableDefine-Column', data);
        $('#TableDefine-ColumnList').append(html);
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
        if (el.val() === column.name) return;
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
    this.renderColumnDescription = function renderColumnDescription(listId, column) {
        if (!this.isViewOpened(listId)) return;
        var data = { listId: listId, column: column };
        var el = this.makeId('column', column.id, 'description');
        if (el.val() === column.description) return;
        el.val(column.description);
    };
    this.isViewOpened = function isViewOpened(tableId) {
        var el = this.makeId('table', tableId, 'id');
        return el.length !== 0;
    };
    // event
    this.onTableNameChange = function onTableNameChange(id, el) {
        var table = dataPool.get('tableList', 0).get(id);
        if (table.name == el.value) return;
        table.name = el.value;
        table.update();
    };
    this.onTableDescriptionChange = function onTableDescriptionChange(id, el) {
        var table = dataPool.get('tableList', 0).get(id);
        if (table.description == el.value) return;
        table.description = el.value;
        table.update();
    };
    this.onColumnNameChange = function onColumnNameChange(listId, columnId, el) {
        var column = dataPool.get('columnList', listId).get(columnId);
        if (column.name == el.value) return;
        column.name = el.value;
        column.update(listId);
    };
    this.onColumnIsPKChange = function onColumnIsPKChange(listId, columnId, el) {
        var column = dataPool.get('columnList', listId).get(columnId);
        column.isPK = I.Util.isChecked(el);
        column.update(listId);
    };
    this.onColumnAllowEmptyChange = function onColumnAllowEmptyChange(listId, columnId, el) {
        var column = dataPool.get('columnList', listId).get(columnId);
        column.allowEmpty = I.Util.isChecked(el);
        column.update(listId);
    };
    this.onColumnTypeChange = function onColumnTypeChange(listId, columnId, el) {
        var column = dataPool.get('columnList', listId).get(columnId);
        column.type = $(el).val();
        column.update(listId);
    };
    this.onColumnDescriptionChange = function onColumnDescriptionChange(listId, columnId, el) {
        var column = dataPool.get('columnList', listId).get(columnId);
        if (column.description ==  el.value) return;
        column.description = el.value;
        column.update(listId);
    };
    this.addColumn = function addColumn(tableId) {
        var column = new I.Models.Column();
        column.create(tableId);
    };
    this.delColumn = function delColumn(tableId, columnId) {
        dataPool.get('columnList', tableId).get(columnId).remove(tableId);
    };
};
