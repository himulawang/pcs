var Table = Backbone.Model.extend({
    validate: function validate(params) {
        // name
        if (!(params.name.length >= 1 && params.name.length <= 32)) {
            throw new Exception(20001);
        }
        // description
        if (!(params.description.length <= 32)) {
            throw new Exception(20002);
        }
    },
});

