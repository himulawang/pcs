var CreateTableStructureOptionView = Backbone.View.extend({
    tagName: 'div',
    className: 'row-fluid CreateTableStructure-Column',
    render: function renderCreateTableStructureOption(data) {
        data = data || {};
        createTableStructureOptionView.$el.html(Renderer.make('CreateTableStructureOption', data));
        $('#CreateTableStructure-Option').append(createTableStructureOptionView.el);
    },
});

