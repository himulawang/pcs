exports.orms = [
{
    name: 'Table',
    abb: 't',
    column: [
        'id',
        'name',
        'description',
    ],
    toAddFilter: [],
    toUpdateFilter: [0],
    toAbbFilter: [],
    toArrayFilter: [],
    pk: 'id',
    pkAutoIncrement: true,
    list: 'TableList',
},
{
    name: 'Column',
    abb: 'c',
    column: [
        'id',
        'name',
        'isPK',
        'allowEmpty',
        'type',
        'client',
        'server',
        'description',
    ],
    toAddFilter: [],
    toUpdateFilter: [0],
    toAbbFilter: [],
    toArrayFilter: [],
    pk: 'id',
    pkAutoIncrement: true,
    list: 'ColumnList',
},
{
    name: 'Exporter',
    abb: 'e',
    column: [
        'id',
        'name',
        'description',
        'path',
        'changed',
        'baseTableId',
        'tables',
        'levels',
        'links',
    ],
    toAddFilter: [],
    toUpdateFilter: [0],
    toAbbFilter: [],
    toArrayFilter: [],
    pk: 'id',
    pkAutoIncrement: true,
    list: 'ExporterList',
},
];
