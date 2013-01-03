var TabLogicLib = {
    loadTabTableTop: function loadTabTableTop() {
        /*
         * @import void
         * @export void
         * */
        var self = this;
        view.get('tabTableTop', function(html) {
            $('#tabTable').html(html);
            $('#buttonCreateTable, #buttonImportData').button();
            tab.clickTabTable();
            self.next();
        });
    },
    loadTabExportTop: function loadTabExportTop() {
        /*
         * @import void
         * @export void
         * */
        var self = this;
        view.get('tabExportTop', function(html) {
            $('#tabExport').html(html);
            $('#buttonCreateExport, #buttonExportData, #buttonDownloadAll').button();
            self.next();
        });
    },
};
