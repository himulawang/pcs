var TableListController = {
    onRetrieve: function onRetrieve(data) {
        tableList.fromServer(data.tableList);
        tableListView.render();
    },
};

