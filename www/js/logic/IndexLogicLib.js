var IndexLogicLib = {
    loadIndexLeftBlock: function loadIndexLeftBlock() {
        /*
         * @import void
         * @export void
         * */
        var self = this;
        view.get('indexLeftBlock', function(html) {
            $('body').append(html);
            $('#menuTabs').tabs();
            self.next();
        });
    },
};
