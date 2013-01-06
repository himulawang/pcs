exports.routes = {
    // C00xx Net
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
    // C01xx Table
    C0101: {                          
        ctrl: 'TableList',                  
        action: 'Retrieve', 
        param: {},
    },
    C0102: {
        ctrl: 'Table',                  
        action: 'CreateTable', 
        param: {
            table: 'nh',
            columnList: 'nh',
        },
    },
    // table
    'createTable': {
        'action': 'TableAction',
        'param': {
            'table': 'nh',
            'description': 'es',
            'options': 'nh',
        },
    },
    'getTableList': {
        'action': 'TableAction',
        'param': {
        },
    },
    'getStructure': {
        'action': 'TableAction',
        'param': {
            'id': 'ni'
        },
    },
    'modifyStructure': {
        'action': 'TableAction',
        'param': {
            'id': 'ni',
            'tableName': 'ns',
            'description': 'es',
            'addOptions': 'mh',
            'delOptions': 'mh',
            'updateOptions': 'mh',
        },
    },
    'deleteTable': {
        'action': 'TableAction',
        'param': {
            'id': 'ni'
        },
    },
    'uploadData': {
        'action': 'TableAction',
        'param': {
            'tableName': 'ns',
            'data': 'nh',
        },
    },
    'getData': {
        'action': 'TableAction',
        'param': {
            'id': 'ni',
        },
    },
    // export
    'getExportList': {
        'action': 'ExportAction',
        'param': {
        },
    },
    'getExportConfig': {
        'action': 'ExportAction',
        'param': {
            'id': 'ni',
        },
    },
    'createExport': {
        'action': 'ExportAction',
        'param': {
            'exportName': 'ns',
            'description': 'es',
            'client': 'nh',
            'server': 'nh',
        },
    },
    'modifyExport': {
        'action': 'ExportAction',
        'param': {
            'id': 'ni',
            'exportName': 'ns',
            'description': 'es',
            'client': 'nh',
            'server': 'nh',
        },
    },
    'deleteExport': {
        'action': 'ExportAction',
        'param': {
            'id': 'ni',
        },
    },
    'exportData': {
        'action': 'ExportAction',
        'param': {
            'id': 'ni',
        },
    },
};
