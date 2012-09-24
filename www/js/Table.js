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

    var description = $('#createTableDescription').val();

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
            description: el.find('.createTableDescription').val(),
        };
    });

    var param = {
        req: 'createTable',
        tableName: tableName,
        description: description,
        options: options
    };
    $.post('./createTable', param, function(json) {
        var obj = Util.parse(json);
        tab.clickTabTable();
        tab.clearRightBlock();
    });
};
Table.prototype.mouseoverTableList = function mouseoverTableList(el) {
    $(el).find('.tableListButtons').removeClass('hide');
};
Table.prototype.mouseoutTableList = function mouseoutTableList(el) {
    $(el).find('.tableListButtons').addClass('hide');
};
Table.prototype.clickStructure = function clickStructure(id) {
    var self = this;
    $.post('/getStructure', { req: 'getStructure', id: id }, function(json) {
        var obj = Util.parse(json);
        view.get('modifyStructure', function(html) {
            $('#indexRightBlock').empty().html(html);
            //$('.modifyStructureAddColumnBefore, .modifyStructureAddColumnAfter').button();
            self.structure = obj.sl;
        }, obj);
    });
};
Table.prototype.addColumn = function addColumn() {
    view.get('modifyStructureOption', function(html) {
        $('#modifyStructureOption').append(html);
    });
};
Table.prototype.delColumn = function delColumn(el) {
    var parentEl = $(el).parent().parent();
    if (parentEl.find('.modifyStructureIsPK')[0].checked) {
        throw new Exception(50008);
    }
    if (parentEl.hasClass('modifyStructureNewColumn')) {
        parentEl.remove();
    } else {
        parentEl.addClass('modifyStructureDeletedColumn');
    }
};
Table.prototype.modifyStructure = function modifyStructure() {
    var tableName = $('#modifyStructureName').val();
    if (tableName === '') {
        throw new Exception(50005);
    }

    var description = $('#modifyStructureDescription').val();

    var param = { 
        req: 'modifyStructure',
        id: $('#modifyStructureTableId').val(),
        tableName: $('#modifyStructureName').val(),
        description: description,
        addOptions: {},
        delOptions: {},
        updateOptions: {},
    };
    $('.modifyStructureOption').each(function(i, n) {
        var el = $(n);
        var columnNameList = {};
        var columnName = el.find('.modifyStructureColumn').val();
        if (columnName === '') {
            throw new Exception(50009);
        }

        if (el.hasClass('modifyStructureNewColumn')) {
            if (columnNameList[columnName]) {
                throw new Exception(50006);
            }
            param.addOptions[columnName] = {
                name: columnName,
                isPK: el.find('.modifyStructureIsPK')[0].checked ? 1 : 0,
                allowEmpty: el.find('.modifyStructureAllowEmpty')[0].checked ? 1 : 0,
                type: el.find('.modifyStructureType').val(),
                client: el.find('.modifyStructureClient')[0].checked ? 1 : 0,
                server: el.find('.modifyStructureServer')[0].checked ? 1 : 0,
                description: el.find('.modifyStructureDescription').val(),
            };
            columnNameList[columnName] = 1;
        } else if (el.hasClass('modifyStructureDeletedColumn')) {
            var delValue = el.find('.modifyStructureId').val();
            var delIndex = 'd' . delValue;
            param.delOptions[delIndex] = delValue;
        } else {
            if (columnNameList[columnName]) {
                throw new Exception(50006);
            }
            var updateIndex = 'u' . el.find('.modifyStructureId').val();
            param.updateOptions[updateIndex] = {
                name: columnName,
                isPK: el.find('.modifyStructureIsPK')[0].checked ? 1 : 0,
                allowEmpty: el.find('.modifyStructureAllowEmpty')[0].checked ? 1 : 0,
                type: el.find('.modifyStructureType').val(),
                client: el.find('.modifyStructureClient')[0].checked ? 1 : 0,
                server: el.find('.modifyStructureServer')[0].checked ? 1 : 0,
                description: el.find('.modifyStructureDescription').val(),
            };
            columnNameList[columnName] = 1;
        }
    });

    $.post('./modifyStructure', param, function(json) {
    });
};
