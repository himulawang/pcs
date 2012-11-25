var ExporterLib = {
    getExportConfig: function getExportConfig(id) {
        /*
         * @import Number           id
         * @export ExportConfig     clientExportConfig
         * @export ExportConfig     serverExportConfig
         * */
        var self = this;
        var param = {
            req: 'getExportConfig',
            id: id,
        };
        $.post('./getExportConfig', param, function(json) {
            var obj = Util.parse(json);
            self.set('clientExportConfig', graph.convertNetData(obj.ecc));
            self.set('serverExportConfig', graph.convertNetData(obj.ecs));
            self.next();
        });
    },
    getData: function getData(id, graphTableId) {
        /*
         * @import Number           id
         * @import Number           graphTableId
         * @export Array
         * */
        var self = this;
        $.post('./getData', { req: 'getData', id: id }, function(json) {
            var obj = Util.parse(json);
            var dataList = self.get('graphTableDataList') ? self.get('graphTableDataList') : {};

            dataList[graphTableId] = obj.dl;
            self.set('graphTableDataList', dataList);
            self.next();
        });
    },
    getTableStructure: function getTableStructure(id, graphTableId) {
        /*
         * @import Number           id
         * @import Number           graphTableId
         * @export Array
         * */
        var self = this;
        $.post('./getStructure', { req: 'getStructure', id: id }, function(json) {
            var obj = Util.parse(json);
            var tableStructureList = self.get('tableStructureList') ? self.get('tableStructureList') : {};
            tableStructureList[graphTableId] = obj.sl;
            self.set('tableStructureList', tableStructureList);
            self.next();
        });
    },
    getBatchDataList: function getBatchDataList(config) {
        /*
         * @import ExportConfig     config
         * @export Array
         * */
        var self = this;
        var lc = new LogicController();
        var graphTableIds = config.graphTableIds;
        var tableId;
        for (var graphTableId in graphTableIds) {
            tableId = graphTableIds[graphTableId];
            lc.add({
                fn: ExporterLib.getData,
                imports: { id: tableId, graphTableId: graphTableId },
                exports: { graphTableDataList: 'graphTableDataList' },
            });
            lc.add({
                fn: ExporterLib.getTableStructure,
                imports: { id: tableId, graphTableId: graphTableId },
                exports: { tableStructureList: 'tableStructureList' },
            });
        }

        lc.add({
            fn: function makeGraphTableDataList() {
                self.set('graphTableDataList', this.get('graphTableDataList'));
                self.set('tableStructureList', this.get('tableStructureList'));
                self.next();
            },
            imports: {},
            exports: {},
        });

        lc.next();
    },
    mergeAndRenameColumn: function mergeAndRenameColumn(config, graphTableDataList, tableStructureList) {
        var mergedTableList = {};
        var mergedTable, selected;
        for (var graphTableId in graphTableDataList) {
            selected = config.columnDetail[graphTableId].selected;
            for (var columnId in selected) {
                
            }
            mergedTable = {};

        }
    },
    cbDownloadData: function cbDownloadData() {
        this.cb();
    },
};
