var ColumnList = Backbone.Collection.extend({
    model: Column,
    retrieve: function retrieve() {
        iWebSocket.send('C0101');
    },
    toArray: function toArray() {
        var array = [];
        this.each(function(column) {
            array.push(column.attributes);
        });
        return array;
    },
});
