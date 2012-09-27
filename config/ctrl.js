exports.ctrl = {
    // table
    'createTable': {
        'action': 'TableAction',
        'param': {
            'tableName': 'ns',
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
};
