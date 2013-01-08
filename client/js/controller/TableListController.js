var TableListController = {
    onRetrieve: function onRetrieve(data) {
        tableList.fromAbbArray(data.tableList);
        tableListView.renderAll();
    },
};
