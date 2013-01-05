var TableList = Backbone.Collection.extend({
    model: Table,
    retrieve: function retrieve() {
        iWebSocket.send('C0101');
    },
});
