var Table = function() {};

Table.prototype.clickCreateTable = function clickCreateTable() {
    var self = this;
    view.get('createTable', function(html) {
        $('#indexRightBlock').html(html);
        self.createTableAddOption();
    });
};

Table.prototype.createTableAddOption = function createTableAddOption() {
    view.get('createTableOption', function(html) {
        $('#createTableOption').append(html);
    });
};

Table.prototype.createTableColumnBlur = function createTableColumnBlur() {
    if ($('.createTableOption').last().find('.createTableColumn').val() !== '') {
        this.createTableAddOption();
    }
};

Table.prototype.createTable = function createTable() {
    var tableName = $('#createTableName').val();
    if (tableName === '') {
        throw new Exception(50001);
    }

    var options = {};
    $('.createTableOption').each(function(i, n) {
        var el = $(n);
        var columnName = el.find('.createTableColumn').val();
        if (columnName === '') return;
        if (options[columnName]) {
            throw new Exception(50002);
        }

        options[columnName] = {
            name: columnName,
            isPK: el.find('.createTableIsPK')[0].checked ? 1 : 0,
            allowEmpty: el.find('.createTableAllowEmpty')[0].checked ? 1 : 0,
            type: el.find('.createTableType').val(),
            client: el.find('.createTableClient')[0].checked ? 1 : 0,
            server: el.find('.createTableServer')[0].checked ? 1 : 0,
            type: el.find('.createTableDescription').val(),
        };
    });

    var param = { req: 'createTable', tableName: tableName, options: options };
    $.post('./', param, function(json) {
    });
};
