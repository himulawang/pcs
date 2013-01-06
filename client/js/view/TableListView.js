var TableListView = function TableListView() {
    this.render = function render() {
        var data = { tableList: tableList };
        var html = Renderer.make('TableList', data);
        $('#TableList').empty().html(html);
    };
};
