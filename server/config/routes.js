exports.routes = {
    // net
    C0001: {                          
        ctrl: 'Net',                  
        action: 'Connect',            
        param: {},
    },                                
    C0002: {                          
        ctrl: 'Net',                  
        action: 'GetOnlineUserCount', 
        param: {},
    },
    C0003: {
        ctrl: 'Net',
        action: 'Init', 
        param: {},
    },
    // table list
    C0101: {                          
        ctrl: 'TableList',                  
        action: 'Retrieve', 
        param: {},
    },
    //  table
    C0201: {
        ctrl: 'Table',                  
        action: 'Create', 
        param: {},
    },
    C0202: {
        ctrl: 'Table',                  
        action: 'Update', 
        param: {
            id: 'ni',
            table: 'nh',
        },
    },
    C0203: {
        ctrl: 'Table',                  
        action: 'Remove', 
        param: {
            id: 'ni',
        },
    },
    // column list
    C0301: {
        ctrl: 'ColumnList',                  
        action: 'Retrieve', 
        param: {
            id: 'ni',
        },
    },
    // column
    C0401: {
        ctrl: 'Column',                  
        action: 'Create', 
        param: {
            listId: 'ni',
        },
    },
    C0402: {
        ctrl: 'Column',                  
        action: 'Update', 
        param: {
            listId: 'ni',
            id: 'ni',
            column: 'nh',
        },
    },
    C0403: {
        ctrl: 'Column',                  
        action: 'Remove', 
        param: {
            listId: 'ni',
            id: 'ni',
        },
    },
    // data list
    C0501: {
        ctrl: 'DataList',                  
        action: 'Import', 
        param: {
            id: 'ni',
            dataList: 'nh',
        },
    },
    // data
    C0601: {
        ctrl: 'Data',                  
        action: 'Create', 
        param: {
            tableId: 'ni',
        },
    },
    C0602: {
        ctrl: 'Data',                  
        action: 'Update', 
        param: {
            tableId: 'ni',
            columnId: 'ni',
            dataId: 'ni',
            data: 'nh',
        },
    },
    C0603: {
        ctrl: 'Data',                  
        action: 'Remove', 
        param: {
            tableId: 'ni',
            rowId: 'ni',
        },
    },
    // exporter list
    C0701: {
        ctrl: 'ExporterList',                  
        action: 'Retrieve', 
        param: {
        },
    },
    // exporter
    C0801: {
        ctrl: 'Exporter',                  
        action: 'Create', 
        param: {
        },
    },
    C0802: {
        ctrl: 'Exporter',                  
        action: 'Update', 
        param: {
            exporter: 'nh'
        },
    },
    C0803: {
        ctrl: 'Exporter',                  
        action: 'Remove', 
        param: {
            id: 'ni',
        },
    },
    C0901: {
        ctrl: 'Exporter',                  
        action: 'UpdateRootTable', 
        param: {
            id: 'ni',
            tableId: 'ni',
        },
    },
    C0902: {
        ctrl: 'Exporter',                  
        action: 'AddBlock', 
        param: {
            id: 'ni',
            level: 'ni',
            tableId: 'ni',
        },
    },
    C0903: {
        ctrl: 'Exporter',
        action: 'RemoveBlock',
        param: {
            id: 'ni',
            level: 'ni',
            blockId: 'ni',
        },
    },
    C0904: {
        ctrl: 'Exporter',
        action: 'RootTableRenameChange',
        param: {
            id: 'ni',
            columnId: 'ni',
            rename: 'es',
        },
    },
};
