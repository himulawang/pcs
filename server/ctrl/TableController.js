exports.TableController = {
    Retrieve: function Retrieve(lc, params) {
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
    },
    Create: function Create(lc, params) {
        lc.add({
            fn: TableLogicLib.getTableList,
            imports: {},
            exports: { tableList: 'tableList' },
        });
        lc.add({
            fn: TableLogicLib.addTable,
            imports: { 
                tableName: params.table.name,
                description: params.table.description, 
                _tableList: null,
            },
            exports: { tableList: 'tableList' },
        });
        lc.add({
            fn: TableLogicLib.addStructureList,
            imports: { columnList: params.columnList, _tableList: null, },
            exports: { structureList: 'structureList' },
        });
        lc.add({
            fn: TableLogicLib.cbCreateTable,
            imports: { _tableList: null, _structureList: null },
            exports: {},
        });
    },
};
