var view, tab, table, importer;
$(function() {
    view = new View();
    tab = new Tab();
    table = new Table();
    importer = new Importer();

    view.get('indexLeftBlock', function(html) {
        $('body').append(html);
        $('#menuTabs').tabs();
        view.get('tabTableTop', function(html) {
            $('#tabTable').html(html);
            $('#buttonCreateTable, #buttonImportData').button();
            tab.clickTabTable();
        });
    });
});
