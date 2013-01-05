var ModifyTableStructureView = Backbone.View.extend({
    tagName: 'div',
    render: function renderModifyTableStructure(data) {
        /* @import Object       data
         * @export void
         * */
        data = data || {};
        modifyTableStructureView.$el.html(Renderer.make('ModifyTableStructure', data));
        $('#Content').empty().html(modifyTableStructureView.el);
        this.next();
    },
});
