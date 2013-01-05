var CreateTableStructureView = Backbone.View.extend({
    tagName: 'div',
    render: function renderCreateTableStructure(data) {
        data = data || {};
        createTableStructureView.$el.html(Renderer.make('CreateTableStructure', data));
        $('#Content').empty().html(createTableStructureView.el);

        // add a column
        createTableStructureOptionView.render();
    },
    createTable: function createTable() {
        // table
        var tableName = this.$('#Name').val();
        var description = this.$('#Description').val();
        var table = new Table();
        table.set({
            name: tableName,
            description: description,
        });

        // columnList
        var columnListEl = $('.CreateTableStructure-Column');
        var columnList = new ColumnList();
        columnListEl.each(function(i, n) {
            n = $(n);
            var column = new Column();
            column.set({
                column: n.find('.ColumnName').val(),
                isPK: n.find('.IsPK').attr('checked') ? 1 : 0,
                allowEmpty: n.find('.AllowEmpty').attr('checked') ? 1 : 0,
                type: n.find('.Type').val(),
                client: n.find('.Client').attr('checked') ? 1 : 0,
                server: n.find('.Server').attr('checked') ? 1 : 0,
                description: n.find('.Description').val(),
            });
            columnList.push(column);
        });

        TableController.CreateTable(table, columnList);
    },
    closePanel: function closePanel() {
        indexView.clearContent();
    },
});

