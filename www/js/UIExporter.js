var UIExporter = function UIExporter() {};

/* Whole */
UIExporter.prototype.getExportSetting = function getExportSetting() {
    return $('#exportSetting');
};

/* Client or Server Tab */
UIExporter.prototype.getTabClient = function getTabClient() {
    return $('#exportTabClient');
};
UIExporter.prototype.getTabServer = function getTabServer() {
    return $('#exportTabServer');
};
UIExporter.prototype.getActiveTab = function getActiveTab() {
    return $('#exportTab' + Util.upperCaseFirst(exporter.tab));
};

/* Tab Button */
UIExporter.prototype.getTabButtonClient = function getTabButtonClient() {
    return $('#exportTabButtonClient');
};
UIExporter.prototype.getTabButtonServer = function getTabButtonServer() {
    return $('#exportTabButtonServer');
};

/* Add Level */
UIExporter.prototype.getAddLevelButtonClient = function getAddLevelButtonClient() {
    return this.getTabClient().find('.buttonAddLevel');
};
UIExporter.prototype.getAddLevelButtonServer = function getAddLevelButtonServer() {
    return this.getTabServer().find('.buttonAddLevel');
};
UIExporter.prototype.getButtonActiveAddLevel = function getButtonActiveAddLevel() {
    return this.getActiveTab().find('.buttonAddLevel');
};
UIExporter.prototype.getGraphLevelZone = function getGraphLevelZone(zone, level) {
    var levelZone;
    zone.find('.levelGraph').each(function(i, n) {
        if ($(n).find('.levelValue').val() == level) levelZone = $(n);
    });
    return levelZone;
};
UIExporter.prototype.domAddLevel = function domAddLevel(el, zone, level) {
    view.get('addLevel', function(html) {
        zone.find('.graph').append(html);
        var graphEl = uiExporter.getGraphLevelZone(zone, level);
        var buttonDeleteLevelEl = graphEl.find('.buttonDeleteLevel');

        eventExporter.bindGraphDrop(graphEl[0]);
        eventExporter.bindDelLevel(buttonDeleteLevelEl);
    }, { level: level });
};
UIExporter.prototype.domDelLevel = function domDelLevel(el) {
    el.remove();
};
UIExporter.prototype.domRefreshLevel = function domRefreshLevel(tab) {
    var zone = this.getActiveTab();

    // change title
    var level = 1;
    zone.find('.exporterLevelTitle').each(function(i, n) {
        $(n).html('Level' + level++);
    });

    // change hidden value
    level = 1;
    zone.find('.levelValue').each(function(i, n) {
        $(n).val(level++);
    });
};

/* Tab Export List*/
UIExporter.prototype.getTabExportList = function getTabExportList() {
    return $('#tabExportList');
};

/* Tables */
UIExporter.prototype.getTables = function getTables() {
    return this.getTabExportList().find('input').button();
};
UIExporter.prototype.domAddNewTable = function domAddNewTable(tab, level, tableId, graphTableId) {
    var zone = this['getTab' + Util.upperCaseFirst(tab)]();
    var el = this.getGraphLevelZone(zone, level);
    $.post('/getStructure', { req: 'getStructure', id: tableId }, function(json) {
        var obj = Util.parse(json);
        view.get('graphTableStructure', function(html) {
            el.append(html)
                .find('.graphTableId').last().val(graphTableId);
            eventExporter.bindGraphTable(el);
        }, obj);
    });
};
UIExporter.prototype.domAddTable = function domAddTable(tab, level, tableId, graphTableId, columnDetail) {
    var zone = this['getTab' + Util.upperCaseFirst(tab)]();
    var el = this.getGraphLevelZone(zone, level);
    $.post('/getStructure', { req: 'getStructure', id: tableId }, function(json) {
        var obj = Util.parse(json);
        view.get('graphTableStructure', function(html) {
            var tableEl = el.append(html).find('.graphTableStructure').last();
            tableEl.find('.graphTableId').last().val(graphTableId);
            tableEl.find('.columnId').each(function(i, n) {
                var columnId = $(n).val();
                var rename = columnDetail.columnRename[columnId];
                if (!rename) return;

                $(n).parent().parent().find('.graphTableStructureRenameInput').val(rename);
            });

            eventExporter.bindGraphTable(el);
        }, obj);
    });
};
UIExporter.prototype.domDelTable = function domDelTable(tableEl) {
    tableEl.remove();
};
UIExporter.prototype.domChangeRenameInput = function domChangeRenameInput(tab, graphTableId, columnId, rename) {
    var zone = this['getTab' + Util.upperCaseFirst(tab)]();
    var tableEl;
    zone.find('.graphTableId').each(function(i, n) {
        if ($(n).val() == graphTableId) tableEl = $(n).parent().parent();
    });

    tableEl.find('.columnId').each(function(i, n) {
        if ($(n).val() == columnId) {
            $(n).parent().parent().find('.graphTableStructureRenameInput').val(rename);
        }
    });
};

UIExporter.prototype.getColumnElByColumnId = function getColumnElByColumnId(graphTableId, columnId) {
    var tableEl;
    this.getActiveTab().find('.graphTableId').each(function(i, n) {
        if ($(n).val() == graphTableId) tableEl = n;
    });
    var columnEl;
    $(tableEl).parent().parent().find('.columnId').each(function(i, n) {
        var el = $(n);
        if (el.val() == columnId) columnEl = el.parent().parent();
    });
    return columnEl;
};
