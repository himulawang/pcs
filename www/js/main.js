var view, tab, table;
$(function() {
    view = new View();
    tab = new Tab();
    table = new Table();

    view.get('indexLeftBlock', function(html) {
        $('body').append(html);
        $('#menuTabs').tabs();
        view.get('tabTableTop', function(html) {
            $('#tabTable').html(html);
            $('#buttonCreateTable').button();
        });
    });
});
