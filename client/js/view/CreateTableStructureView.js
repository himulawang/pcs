var CreateTableStructureView = Backbone.View.extend({
    tagName: 'div',
    render: function renderCreateTableStructure(data) {
        /* @import Object       data
         * @export void
         * */
        data = data || {};
        createTableStructureView.$el.html(Renderer.make('CreateTableStructure', data));
        $('#content').empty().html(createTableStructureView.el);
        this.next();
    },
    createTable: function createTable() {
        /*
        'tableName': 'ns',   
        'description': 'es', 
        'options': 'nh',     
        */
        var tableName = $('#Name').val();
        var description = $('#Description').val();
        var req = {
            tableName: tableName,
            description: description,
        };

    },
});

