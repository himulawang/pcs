var Exporter = function Exporter() {};

Exporter.prototype.clickCreateExport = function clickCreateExport() {
    var self = this;
    view.get('createExport', function(html) {
        $('#indexRightBlock').html(html);
        $('#exportSettingTabs').tabs();
    });
};
