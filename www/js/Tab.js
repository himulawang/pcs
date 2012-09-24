var Tab = function() {};

Tab.prototype.clickTabTable = function() {
    $.post('/getTableList', { req: 'getTableList' }, function(json) {
        var obj = Util.parse(json);
        view.get('tabTableList', function(html) {
            $('#tabTableList').html(html).find('input').button();
        }, obj);
    });
    
};
Tab.prototype.clearRightBlock = function() {
    $('#indexRightBlock').empty();
};
