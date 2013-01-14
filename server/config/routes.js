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
    // table list
    C0101: {                          
        ctrl: 'TableList',                  
        action: 'Get', 
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
    // column list
    C0301: {
        ctrl: 'ColumnList',                  
        action: 'Get', 
        param: {
            id: 'ni',
        },
    },
    //  column
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
};
