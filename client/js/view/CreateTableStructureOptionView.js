var CreateTableStructureOptionView = Backbone.View.extend({
    addColumn: function addColumn() {
        var html = Renderer.make('CreateTableStructureOption');
        $('#CreateTableStructure-Option').append(html);
    },
    delColumn: function delColumn(target) {
        if ($('#CreateTableStructure-Option').children().length <= 1) return;
        $(target).parent().parent().remove();
    },
});

