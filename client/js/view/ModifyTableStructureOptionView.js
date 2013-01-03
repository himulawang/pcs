var ModifyTableStructureOptionView = Backbone.View.extend({
    tagName: 'div',
    render: function renderModifyTableStructureOption(data) {
        /* @import Object       data
         * @export void
         * */
        data = data || {};
        modifyTableStructureOptionView.$el.html(Renderer.make('ModifyTableStructureOption', data));
        $('#ModifyTableStructure-Option').empty().html(modifyTableStructureOptionView.el);
        this.next();
    },
});

