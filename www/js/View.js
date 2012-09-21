var View = function() {
    this.list = {};
};

View.prototype.get = function(name, cb, data) {
    var self = this;
    data = data || {};
    if (this.list[name] === undefined) {
        $.get('../view/' + name + '.jade', {}, function(jadeSrc) {
            var fn = jade.compile(jadeSrc);
            self.list[name] = fn;
            self.get(name, cb, data);
        });
        return;
    }
    console.log(data);
    var html = self.list[name](data);
    cb(html);
};
