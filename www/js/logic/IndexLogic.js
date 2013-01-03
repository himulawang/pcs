var IndexLogic = {
    loadIndex: function() {
        var lc = new LogicController();
        lc.add({
            fn: IndexLogicLib.loadIndexLeftBlock,
            imports: {},
            exports: {},
        });
        lc.add({
            fn: TabLogicLib.loadTabTableTop,
            imports: {},
            exports: {},
        });
        lc.add({
            fn: TabLogicLib.loadTabExportTop,
            imports: {},
            exports: {},
        });
        lc.next();
    },
};
