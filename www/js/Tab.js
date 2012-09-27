var Tab = function() {};

Tab.prototype.clickTabTable = function clickTabTable() {
    $.post('./getTableList', { req: 'getTableList' }, function(json) {
        var obj = Util.parse(json);
        view.get('tabTableList', function(html) {
            $('#tabTableList').html(html).find('input').button();
        }, obj);
    });
};
Tab.prototype.clickTabExport = function clickTabExport() {
    $.post('./getExportList', { req: 'getExportList' }, function(json) {
        var obj = Util.parse(json);
        view.get('tabExportList', function(html) {
            $('#tabExportList').html(html).find('input').button();
        }, obj);
    });
};
Tab.prototype.clearRightBlock = function clearRightBlock() {
    $('#indexRightBlock').empty();
};
