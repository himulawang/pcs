var Table = Backbone.Model.extend({
    getStructure: function getStructure(id) {
        /* @import Number       id
         * @export Object       tableStructure
         * */
        var self = this;
        $.post('./getStructure', { req: 'getStructure', id: id }, function(json) {
            var tableStructure = Util.parse(json);
            self.set('tableStructure', tableStructure);
            self.next();
        });
    },
});

