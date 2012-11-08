var TableLogic = function TableLogic() {};

TableLogic.prototype.getTableList = function getTableList(lc, params) {
    lc.add({
        fn: TableLogicLib.getTableList,
        imports: {},
        exports: { tableList: 'tableList' },
    });
    lc.add({
        fn: TableLogicLib.cbGetTableList,
        imports: { _tableList: null },
        exports: {},
    });
};
TableLogic.prototype.createTable = function createTable(lc, params) {
    lc.add({
        fn: TableLogicLib.getTableList,
        imports: {},
        exports: { tableList: 'tableList' },
    });
    lc.add({
        fn: TableLogicLib.addTable,
        imports: { 
            tableName: params.tableName,
            description: params.description, 
            sort: 1, // TODO
            _tableList: null,
        },
        exports: { tableList: 'tableList' },
    });
    lc.add({
        fn: TableLogicLib.addStructureList,
        imports: { options: params.options, _tableList: null, },
        exports: { structureList: 'structureList' },
    });
    lc.add({
        fn: TableLogicLib.cbCreateTable,
        imports: { _tableList: null, _structureList: null },
        exports: {},
    });
};
TableLogic.prototype.getStructure = function getStructure(lc, params) {
    lc.add({
        fn: TableLogicLib.getTableList,
        imports: {},
        exports: { tableList: 'tableList' },
    });
    lc.add({
        fn: TableLogicLib.verifyTableExists,
        imports: { _tableList: null, tableId: params.id },
        exports: { table: 'table'},
    });
    lc.add({
        fn: TableLogicLib.getStructureList,
        imports: { tableId: params.id },
        exports: { structureList: 'structureList' },
    });
    lc.add({
        fn: TableLogicLib.cbGetStructureList,
        imports: { _table: null, _structureList: 'structureList' },
        exports: {},
    });
};
TableLogic.prototype.getData = function getData(lc, params) {
    lc.add({
        fn: TableLogicLib.getTableList,
        imports: {},
        exports: { tableList: 'tableList' },
    });
    lc.add({
        fn: TableLogicLib.verifyTableExists,
        imports: { _tableList: null, tableId: params.id },
        exports: { table: 'table'},
    });
    lc.add({
        fn: TableLogicLib.getStructureList,
        imports: { tableId: params.id },
        exports: { structureList: 'structureList' },
    });
    lc.add({
        fn: TableLogicLib.makeDynamicClass,
        imports: { _table: null, _structureList: null },
        exports: { 
            Data: 'Data',
            DataModel: 'DataModel',
            DataListModel: 'DataListModel',
            dynamicMaker: 'dynamicMaker'
        },
    });
    lc.add({
        fn: TableLogicLib.getDataList,
        imports: { _DataListModel: null,  },
        exports: { dataList: 'dataList' },
    });
    lc.add({
        fn: TableLogicLib.cbGetData,
        imports: { _dataList: null, _Data: null, _dynamicMaker: null },
        exports: {},
    });
};
TableLogic.prototype.modifyStructure = function modifyStructure(lc, params) {
    lc.add({
        fn: TableLogicLib.getTableList,
        imports: {},
        exports: { tableList: 'tableList' },
    });
    lc.add({
        fn: TableLogicLib.verifyTableExists,
        imports: { _tableList: null, tableId: params.id },
        exports: { table: 'table'},
    });
    lc.add({
        fn: TableLogicLib.getStructureList,
        imports: { tableId: params.id },
        exports: { structureList: 'structureList' },
    });
    lc.add({
        fn: TableLogicLib.delStructure,
        imports: { delOptions: params.delOptions, _structureList: null },
        exports: { structureList: 'structureList' },
    });
    lc.add({
        fn: TableLogicLib.addStructure,
        imports: { addOptions: params.addOptions, _structureList: null },
        exports: { structureList: 'structureList' },
    });
    lc.add({
        fn: TableLogicLib.updateStructure,
        imports: { updateOptions: params.updateOptions, _structureList: null },
        exports: { structureList: 'structureList' },
    });
    lc.add({
        fn: TableLogicLib.verifyTableNotExists,
        imports: { _tableList: null, tableName: params.tableName, id: params.id },
        exports: {},
    });
    lc.add({
        fn: TableLogicLib.updateTable,
        imports: { _tableList: null, _table: null, tableName: params.tableName, description: params.description },
        exports: {},
    });
    lc.add({
        fn: TableLogicLib.cbModifyStructure,
        imports: {},
        exports: {},
    });
};
TableLogic.prototype.deleteTable = function deleteTable(lc, params) {
    lc.add({
        fn: TableLogicLib.getTableList,
        imports: {},
        exports: { tableList: 'tableList' },
    });
    lc.add({
        fn: TableLogicLib.verifyTableExists,
        imports: { _tableList: null, tableId: params.id },
        exports: { table: 'table'},
    });
    lc.add({
        fn: TableLogicLib.getStructureList,
        imports: { tableId: params.id },
        exports: { structureList: 'structureList' },
    });
    lc.add({
        fn: TableLogicLib.makeDynamicClass,
        imports: { _table: null, _structureList: null },
        exports: { 
            Data: 'Data',
            DataModel: 'DataModel',
            DataListModel: 'DataListModel',
            dynamicMaker: 'dynamicMaker'
        },
    });
    lc.add({
        fn: TableLogicLib.getDataList,
        imports: { _DataListModel: null, },
        exports: { dataList: 'dataList' },
    });
    lc.add({
        fn: TableLogicLib.delDataGlobal,
        imports: { _DataModel: null, },
        exports: {},
    });
    lc.add({
        fn: TableLogicLib.delDataList,
        imports: { _dataList: null, _DataListModel: null},
        exports: {},
    });
    lc.add({
        fn: TableLogicLib.delTable,
        imports: { _table: null, _tableList: null },
        exports: {},
    });
    lc.add({
        fn: TableLogicLib.delStructureList,
        imports: { _structureList: null },
        exports: {},
    });
    lc.add({
        fn: TableLogicLib.cbDeleteTable,
        imports: { _dynamicMaker: null },
        exports: {},
    });
};
TableLogic.prototype.uploadData = function uploadData(lc, params) {
    lc.add({
        fn: TableLogicLib.getTableList,
        imports: {},
        exports: { tableList: 'tableList' },
    });
    lc.add({
        fn: TableLogicLib.verifyTableByTableName,
        imports: { _tableList: null, tableName: params.tableName },
        exports: { table: 'table', tableId: 'tableId' },
    });
    lc.add({
        fn: TableLogicLib.getStructureList,
        imports: { _tableId: null },
        exports: { structureList: 'structureList' },
    });
    // TODO verify import data by column type
    lc.add({
        fn: TableLogicLib.makeDynamicClass,
        imports: { _table: null, _structureList: null },
        exports: { 
            Data: 'Data',
            DataModel: 'DataModel',
            DataListModel: 'DataListModel',
            dynamicMaker: 'dynamicMaker'
        },
    });
    lc.add({
        fn: TableLogicLib.getDataList,
        imports: { _DataListModel: null, },
        exports: { dataList: 'dataList' },
    });
    lc.add({
        fn: TableLogicLib.delDataList,
        imports: { _dataList: null, _DataListModel: null },
        exports: { dataList: 'dataList' },
    });
    lc.add({
        fn: TableLogicLib.resetDataGlobalKey,
        imports: { _DataModel: null },
        exports: {},
    });
    lc.add({
        fn: TableLogicLib.addDataList,
        imports: { 
            inputData: params.data,
            dataTableName: params.tableName,
            _dataList: null,
            _DataListModel: null,
            _dynamicMaker: null,
        },
        exports: { dataList: 'dataList' },
    });
    lc.add({
        fn: TableLogicLib.cbUploadData,
        imports: { _dataList: null, _dynamicMaker: null },
        exports: {},
    });
};

exports.TableLogic = new TableLogic();
