exports.TableLogicLib = {
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
    addStructureList: function addStructureList(columnList, tableList) {
        /*
         * @import Object           columnList
         * @import TableList        tableList
         * @export StructureList    structureList
         * */
        var self = this;
        var table = tableList.last();
        var id = table.getPK();

        structureList = new StructureList(id);
        var structure, column;
        for (var i in columnList) {
            column = columnList[i];
            structure = new Structure([
                null,
                column.column,
                column.isPK,
                column.allowEmpty,
                column.type,
                column.client,
                column.server,
                column.description,
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
    verifyBatchData: function verifyBatchData(structureList, data) {
        /*
         * @import StructureList    structrueList
         * @import Object           data
         * @export void
         * */
        var list = structureList.getList();
        var columnTypes = [];
        for (var i in list) {
            columnTypes.push(list[i].type);
        }

        var util = I.Util;
        for (var j = 0; j < data.length; ++j) {
            // skip title
            var n = data[j];
            if (j === 0) continue;
            for (var columnTypeIndex = 0; columnTypeIndex < columnTypes.length; ++columnTypes) {
                switch (columnTypes[columnTypeIndex]) {
                    case 'number':
                        if (!util.isInt(n[columnTypeIndex])) return this.cb(new I.Exception(50105));
                        break;
                    case 'string':
                        if (!util.isString(n[columnTypeIndex])) return this.cb(new I.Exception(50106));
                        break;
                    case 'json':
                        if (!util.isJSON(n[columnTypeIndex])) return this.cb(new I.Exception(50107));
                        break;
                    default:
                        return this.cb(new I.Exception(50108));
                }
            }
        }
        this.next();
    },
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
    addTable: function addTable(tableName, description, tableList) {
        /*
         * @import String           tableName
         * @import String           description
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
    /* Callback */
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
        connectionPool.broadcast('C0101', { tl: tableList.toClient() });
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
