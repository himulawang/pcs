exports.ctrl = {
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
};
