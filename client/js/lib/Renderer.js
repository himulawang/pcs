var Renderer = {
    cachedTpl: {},
    make: function make(name, data) {
        data = data || {};
        if (this.cachedTpl[name] === undefined) {
            var jadeSrc = $.ajax({
                url: '../../tpl/' + name + '.jade',
                async: false,
            }).responseText;
            var fn = jade.compile(jadeSrc, { filename:'../../tpl/' + name + '.jade' });
            this.cachedTpl[name] = fn;
        }
        var html = this.cachedTpl[name](data);
        return html;
    },
};
