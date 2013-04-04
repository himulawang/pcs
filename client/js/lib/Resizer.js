var Resizer = {
    getBodyHeight: function getBodyHeight() {
        return $(window).height();
    },
    getFooterHeight: function getFooterHeight() {
        return $('#Footer').outerHeight(true);
    },
    index: function index() {
        var bodyHeight = Resizer.getBodyHeight();
        var logoHeight = $('#Logo').outerHeight(true);
        var tabHeaderHeight = $('#TabHeader').outerHeight(true);
        var footerHeight = Resizer.getFooterHeight(true);

        $('#Tree').css('height', bodyHeight - logoHeight - tabHeaderHeight - footerHeight);
    },
    tableData: function tableData() {
        var bodyHeight = Resizer.getBodyHeight();
        var h2Height = $('#TableData-Header').outerHeight(true);
        var titleHeight = $('#TableData-Title').outerHeight(true);
        var pHeight = 11;
        var footerHeight = Resizer.getFooterHeight();

        $('#TableData-Body').css('height', bodyHeight - h2Height - titleHeight - pHeight - footerHeight);
    },
    tableDefine: function tableDefine() {
        var bodyHeight = Resizer.getBodyHeight();
        var h2Height = $('#TableDefine-Header').outerHeight(true);
        var hrHeight = 42 * 2;
        var baseConfigHeight = $('#TableDefine-BaseDefine').outerHeight(true);
        var columnTitleHeight = $('#TableDefine-ColumnTitle').outerHeight(true);
        var footerHeight = Resizer.getFooterHeight();

        $('#TableDefine-ColumnList').css('height', bodyHeight - h2Height - hrHeight - baseConfigHeight - columnTitleHeight - footerHeight);
    },
    exporterData: function exporterData() {
        var bodyHeight = Resizer.getBodyHeight();
        var h2Height = $('#ExporterData-Header').outerHeight(true);
        var hrHeight = 42 * 2;
        var baseConfigHeight = $('#ExporterData-BaseDefine').outerHeight(true);
        var tabHeaderHeight = $('#ExporterData-TabHeader').outerHeight(true);
        var footerHeight = Resizer.getFooterHeight();

        $('#ExporterData-TabBody').css('height', bodyHeight - h2Height - hrHeight - baseConfigHeight - tabHeaderHeight - footerHeight);
    },
    exporterDefine: function exporterDefine() {
        var bodyHeight = Resizer.getBodyHeight();
        var h2Height = $('#ExporterDefine-Header').outerHeight(true);
        var hrHeight = 42 * 2;
        var baseConfigHeight = $('#ExporterDefine-BaseDefine').outerHeight(true);
        var footerHeight = Resizer.getFooterHeight();

        $('#ExporterDefine-Levels').css('height', bodyHeight - h2Height - hrHeight - baseConfigHeight - footerHeight);
    },
    onResize: function onResize() {
        var self = Resizer;
        self.index();

        if ($('#TableData-Header').length !== 0) {
            self.tableData();
            return;
        }
        if ($('#TableDefine-Header').length !== 0) {
            self.tableDefine();
            return;
        }

        if ($('#ExporterData-Header').length !== 0) {
            self.exporterData();
            return;
        }
        if ($('#ExporterDefine-Header').length !== 0) {
            self.exporterDefine();
            return;
        }
    },
};
