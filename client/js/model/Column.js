var Column = Backbone.Model.extend({
    validate: function validate(params) {
        // column
        if (!(params.column.length >= 1 && params.column.length <= 32)) {
            throw new Exception(20101);
        }

        // description
        if (!(params.description.length <= 32)) {
            throw new Exception(20102);
        }
    },
});
