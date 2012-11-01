var TableLogicLib = {
    getTableList: function getTableList() {
        /*
         * @import void
         * @export TableList        tableList
         * */
        var self = this;
        TableListModel.retrieve(0 /* Unique */, function(err, data) {
            if (err) return self.cb(err);
            self.set('tableList', data);
            self.next();
        });
    },
    /* StructureList */
    getStructureList: function getStructureList(id) {
        /*
         * @import Number           id
         * @export structureList    structureList
         * */
        var self = this;
        StructureListModel.retrieve(id, function(err, data) {
            if (err) return self.cb(err);
            self.set('structureList', data);
            self.next();
        });
    },
    addStructureList: function addStructureList(options, tableList) {
        /*
         * @import Object           options
         * @import TableList        tableList
         * @export StructureList    structureList
         * */
        var self = this;
        var table = tableList.last();
        var id = table.getPK();

        structureList = new StructureList(id);
        var structure, option;
        for (var i in options) {
            option = options[i];
            structure = new Structure([
                null,
                i,
                option.isPK,
                option.allowEmpty,
                option.type,
                option.client,
                option.server,
                option.description,
            ]);
            structureList.add(structure);
        }
        StructureListModel.update(structureList, function(err, data) {
            if (err) return self.cb(err);
            self.set('structureList', data);
            self.next();
        });
    },
    delStructureList: function delStructureList(structureList) {
        /*
         * @import StructureList    structureList
         * @export void
         * */
        var self = this;
        StructureListModel.del(structureList, function(err, data) {
            if (err) return self.cb(err);
            self.next();
        });
    },
    /* DataList */
    getDataList: function getDataList(DataListModel) {
        /*
         * @import Model            DataListModel
         * @export DataList         dataList
         * */
        var self = this;
        DataListModel.retrieve(0, function(err, data) {
            if (err) return self.cb(err);
            self.set('dataList', data);
            self.next();
        });
    },
    addDataList: function addDataList(inputData, dataTableName, dataList, DataListModel, dynamicMaker) {
        /*
         * @import Object           inputData
         * @import String           dataTableName
         * @import DataList         dataList
         * @import DataListModel    DataListModel
         * @import DynamicMaker     dynamicMaker
         * @export DataList         dataList
         * */
        var self = this;
        dataTableName = dynamicMaker.makeDataTableName(dataTableName);
        inputData.forEach(function(n, i) {
            // skip title
            if (i === 0) return;
            var initData = [null];
            for (var i in n) {
                initData.push(n[i]);
            }
            var data = new global[dataTableName](initData);
            dataList.add(data);
        });
        DataListModel.update(dataList, function(err, data) {
            if (err) return self.cb(err);
            self.set('dataList', data);
            self.next();
        });
    },
    delDataList: function delDataList(dataList, DataListModel) {
        /*
         * @import DataList         dataList
         * @import DataListModel    DataListModel
         * @export DataList         dataList
         * */
        var self = this;
        DataListModel.del(dataList, function(err, data) {
            if (err) return self.cb(err);
            self.set('dataList', data);
            self.next();
        });
    },
    /* Table */
    addTable: function addTable(tableName, description, sort, tableList) {
        /*
         * @import String           tableName
         * @import String           description
         * @import Number           sort
         * @import TableList        tableList
         * @export TableList        tableList
         * */
        var self = this;
        // verify table not exists
        var list = tableList.getList();
        for (var i in list) {
            if (list[i].name.toLowerCase() == tableName.toLowerCase()) {
                return self.cb(new I.Exception(20001));
            }
        }
        
        // add table
        var table = new Table();
        table.name = tableName;
        table.sort = 1;
        table.description = description;

        tableList.add(table);
        TableListModel.update(tableList, function(err, data) {
            if (err) return self.cb(err);
            self.set('tableList', data);
            self.next();
        });
    },
    updateTable: function updateTable(tableList, table, tableName, description) {
        /*
         * @import TableList        tableList
         * @import Table            table
         * @import String           tableName
         * @import String           description
         * @export TableList        tableList
         * */
        var self = this;
        table.name = tableName;
        table.description = description;

        tableList.update(table);
        TableListModel.update(tableList, function(err, data) {
            if (err) return self.cb(err);
            self.set('tableList', tableList);
            self.next();
        });
    },
    delTable: function delTable(table, tableList) {
        /*
         * @import Table            table
         * @import TableList        tableList
         * @export void
         * */
        var self = this;
        tableList.del(table);
        TableListModel.update(tableList, function(err, data) {
            if (err) return self.cb(err);
            self.next();
        });
    },
    delStructure: function delStructure(delOptions, structureList) {
        /*
         * @import Object           delOptions
         * @import StructureList    structureList
         * @export StructureList    structureList
         * */
        if (!delOptions) return this.next();
        var id;
        for (var i in delOptions) {
            id = delOptions[i];
            structure = structureList.get(id);
            if (structure === null) continue;

            structureList.del(id);
        }
        this.set('structureList', structureList);
        this.next();
    },
    addStructure: function addStructure(addOptions, structureList) {
        /*
         * @import Object           addOptions
         * @import StructureList    structureList
         * @export StructureList    structureList
         * */
        if (!addOptions) return this.next();
        var option;
        for (var i in addOptions) {
            option = addOptions[i];
            structure = new Structure([
                null,
                i,
                option.isPK,
                option.allowEmpty,
                option.type,
                option.client,
                option.server,
                option.description,
            ]);
            structureList.add(structure);
        };
        this.set('structureList', structureList);
        this.next();
    },
    updateStructure: function updateStructure(updateOptions, structureList) {
        /*
         * @import Object           updateOptions
         * @import StructureList    structureList
         * @export StructureList    structureList
         * */
        var self = this;
        if (!updateOptions) return this.next();
        var option, id;
        for (var updateIndex in updateOptions) {
            option = updateOptions[updateIndex];
            id = updateIndex.substr(1);
            structure = structureList.get(id);

            if (structure === null) continue;

            structure.name = option.name;
            structure.isPK = option.isPK;
            structure.allowEmpty = option.allowEmpty;
            structure.type = option.type;
            structure.client = option.client;
            structure.server = option.server;
            structure.description = option.description;

            structureList.update(structure);
        };
        this.set('structureList', structureList);
        StructureListModel.update(structureList, function(err, data) {
            if (err) return self.cb(err);
            self.next();
        });
    },
    /* Data Global Key */
    resetDataGlobalKey: function resetDataGlobalKey(DataModel) {
        /*
         * @import Model            DataModel
         * @export void
         * */
        var self = this;
        db.set(I.Const.GLOBAL_KEY_PREFIX + DataModel.abb, 0, function(err, data) {
            if (err) return self.cb(err);
            self.next();
        });
    },
    delDataGlobal: function delDataGlobal(DataModel) {
        /*
         * @import Model            DataModel
         * @export void
         * */
        var self = this;
        db.del(I.Const.GLOBAL_KEY_PREFIX + DataModel.abb, function(err, data) {
            if (err) return self.cb(err);
            self.next();
        });
    },
    verifyTableExists: function verifyTableExists(tableList, id) {
        /*
         * @import TableList        tableList
         * @import Number           id
         * @export Table            table
         * */
        var table = tableList.get(id);
        if (table === null) return this.cb(new I.Exception(50004));
        this.set('table', table);
        this.next();
    },
    verifyTableNotExists: function verifyTableNotExists(tableList, tableName, id) {
        /*
         * @import TableList        tableList
         * @import String           tableName
         * @import Number           id
         * @export void
         * */
        var list = tableList.getList();
        tableName = tableName.toLowerCase();
        for (var i in list) {
            if (list[i].name.toLowerCase() == tableName) {
                if (i == id) continue;
                return this.cb(new I.Exception(20002));
            }
        }
        this.next();
    },
    verifyTableByTableName: function verifyTableByTableName(tableList, tableName) {
        /*
         * @import TableList        tableList
         * @import String           tableName
         * @export Table            table
         * @export Number           tableId
         * */
        tableName = tableName.toLowerCase();
        table = tableList.getTableByTableName(tableName);
        if (table === null) return cb(new I.Exception(50104));
        this.set('table', table);
        this.set('tableId', table.id);
        this.next();
    },
    makeDynamicClass: function makeDynamicClass(table, structureList) {
        /*
         * @import Table            table
         * @import StructureList    structureList
         * @export Data             Data
         * @export DataModel        DataModel
         * @export Model            DataListModel
         * @export DynamicMaker     DynamicMaker
         * */
        dynamicMaker = new DynamicMaker();
        dynamicMaker.make(table, structureList);
        dataTableName = dynamicMaker.makeDataTableName(table.name);
        var Data = global[dataTableName];
        var DataModel = global[dataTableName + 'Model'];
        var DataListModel = global[dataTableName + 'ListModel'];
        this.set('Data', Data);
        this.set('DataModel', DataModel);
        this.set('DataListModel', DataListModel);
        this.set('dynamicMaker', dynamicMaker);
        this.next();
    },
    cbGetTableList: function cbGetTableList(tableList) {
        /*
         * @import TableList        tableList
         * @export void
         * */
        this.cb(null, { tl: tableList.toClient(), });
    },
    cbCreateTable: function cbCreateTable(tableList, structureList) {
        /*
         * @import TableList        tableList
         * @import StructureList    structureList
         * @export void
         * */
        this.cb(null, {
            tl: tableList.toClient(),
            sl: structureList.toClient(),
        });
    },
    cbGetStructureList: function cbGetStructureList(table, structureList) {
        /*
         * @import Table            table
         * @import StructureList    structureList
         * @export void
         * */
        this.cb(null, {
            sl: structureList.toClient(),
            t: table.toClient(),
        });
    },
    cbGetData: function cbGetData(dataList, Data, dynamicMaker) {
        /*
         * @import DataList         dataList
         * @import Data             Data
         * @import DynamicMaker     dynamicMaker
         * @export void
         * */
        this.cb(null, {
            dl: dataList.toClient(),
            cl: new Data().abb,
        });
        dynamicMaker.clear();
    },
    cbModifyStructure: function cbModifyStructure() {
        /*
         * @import void
         * @export void
         * */
        this.cb(null, {});
    },
    cbDeleteTable: function cbDeleteTable(dynamicMaker) {
        /*
         * @import DynamicMaker     dynamicMaker
         * @export void
         * */
        this.cb(null, {});
        dynamicMaker.clear();
    },
    cbUploadData: function cbUploadData(dataList, dynamicMaker) {
        /*
         * @import DataList         dataList
         * @import DynamicMaker     dynamicMaker
         * @export void
         * */
        console.log(dataList.toClient());
        this.cb(null, { dl: dataList.toClient() });
        dynamicMaker.clear();
    },
};

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
