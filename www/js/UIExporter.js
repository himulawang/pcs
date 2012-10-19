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
UIExporter.prototype.domAddLevel = function domAddLevel(el, zone, level) {
    // title
    var titleEl = document.createElement('span');
    titleEl.innerHTML = 'Level' + level;
    $(el).before(titleEl);

    // graph
    var graphEl = document.createElement('div');
    graphEl.classList.add('levelGraph');
    graphEl.classList.add('border');
    graphEl.classList.add('left');
    graphEl.classList.add('level' + level);

    var hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.value = level;
    hiddenInput.classList.add('levelValue');
    graphEl.appendChild(hiddenInput);

    eventExporter.bindGraphDrop(graphEl);
    zone.find('.graph').append(graphEl);
};

/* Tab Export List*/
UIExporter.prototype.getTabExportList = function getTabExportList() {
    return $('#tabExportList');
};

/* Tables */
UIExporter.prototype.getTables = function getTables() {
    return this.getTabExportList().find('input').button();
};
UIExporter.prototype.domAddTable = function domAddTable(tab, level, tableId, graphTableId) {
    // add dom
    var el = this['getTab' + Util.upperCaseFirst(tab)]().find('.level' + level);
    $.post('/getStructure', { req: 'getStructure', id: tableId }, function(json) {
        var obj = Util.parse(json);
        view.get('graphTableStructure', function(html) {
            el.append(html)
                .find('.graphTableId').last().val(graphTableId);
            eventExporter.bindGraphTable(el);
        }, obj);
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
