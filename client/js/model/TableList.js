var TableList = Backbone.Collection.extend({
    getTableListData: function getTableListData() {
        /* @import void
         * @export Object       tableListData
         * */
        var self = this;
        $.post('./getTableList', { req: 'getTableList' }, function(json) {
            var tableListData = Util.parse(json);
            self.set('tableListData', tableListData);
            self.next();
        });
    },
});
