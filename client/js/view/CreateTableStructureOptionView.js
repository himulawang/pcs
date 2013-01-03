var CreateTableStructureOptionView = Backbone.View.extend({
    tagName: 'div',
    render: function renderCreateTableStructureOption(data) {
        /* @import Object       data
         * @export void
         * */
        data = data || {};
        createTableStructureOptionView.$el.html(Renderer.make('CreateTableStructureOption', data));
        $('#CreateTableStructure-Option').append(createTableStructureOptionView.el);
        this.next();
    },
});

