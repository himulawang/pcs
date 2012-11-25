// init on ready
var view, tab, table, importer, graph, exporter, eventExporter, uiExporter, fs;

// init on using
var canvas;

/* view */
var indexView, tableListView;
var tableList;
$(function() {
    indexView = new IndexView();
    tableListView = new TableListView();
    indexView.render();

    tableList = new TableList();
    //tableList.getTableList();
    /*
    fs = new FileSystem();
    view = new View();
    tab = new Tab();
    table = new Table();
    importer = new Importer();
    graph = new Graph();

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
    */
});
