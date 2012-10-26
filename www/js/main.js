// init on ready
var view, tab, table, importer, graph, exporter, eventExporter, uiExporter;

// init on useing
var canvas;

$(function() {
    view = new View();
    tab = new Tab();
    table = new Table();
    importer = new Importer();

    exporter = new Exporter();
    eventExporter = new EventExporter();
    uiExporter = new UIExporter();

    // init
    view.get('addLevel', function(html) {}, { level: 1 });

    view.get('indexLeftBlock', function(html) {
        $('body').append(html);
        $('#menuTabs').tabs();
        view.get('tabTableTop', function(html) {
            $('#tabTable').html(html);
            $('#buttonCreateTable, #buttonImportData').button();
            tab.clickTabTable();
        });
        view.get('tabExportTop', function(html) {
            $('#tabExport').html(html);
            $('#buttonCreateExport, #buttonExportData, #buttonDownloadAll').button();
        });
    });
});
