exports.RestoreController = {
    Restore: function Restore(connection, api, params) {
        if (params.obj.type !== 'pcs bak') return;
        var bak = params.obj.data;
        // remove all data
        dataPool.drop();

        // restore start
        for (var name in bak) {
            var item = bak[name];
            if (item.key === 'dataList' || item.key === 'dataPK') continue;

            if (item.type === 'PK') {
                var pk = new I.Models[item.className]();
                pk.restoreSync(item);
                dataPool.set(item.key, item.field, pk);
                continue;
            }

            if (item.type === 'List') {
                var list = new I.Models[item.className](item.pk);
                list.restoreSync(item);
                dataPool.set(item.key, item.field, list);

                if (item.key === 'columnList') I.Lib.DynamicMaker.make(item.field);
                continue;
            }
        }

        // restore dataList
        for (var name in bak) {
            var item = bak[name];
            if (item.key !== 'dataList' && item.key !== 'dataPK') continue;

            if (item.type === 'PK') {
                var pk = new I.Models[item.className]();
                pk.restoreSync(item);
                dataPool.set(item.key, item.field, pk);
                continue;
            }

            if (item.type === 'List') {
                var list = new I.Models[item.className](item.pk);
                list.restoreSync(item);
                dataPool.set(item.key, item.field, list);
                continue;
            }
        }

        dataPool.sync();

        var data = {};
        connectionPool.single(connection, api, I.Const.PCSConst.REQUEST_RESULT_CODE_SUCCESS, data);
    },
};
