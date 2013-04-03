var Resizer = {
    getBodyHeight: function() {
        return $(window).height();
    },
    getFooterHeight: function() {
        return $('#Footer').outerHeight(true);
    },
    getBodyWidth: function() {
        return $(window).width();
    },
    getLeftBlockWidth: function() {
        return $('#Left-Block').outerWidth(true);
    },
    getContentMarginWidth: function() {
        return parseInt($('#Content').css('margin-left'));
    },
    index: function() {
        var bodyHeight = Resizer.getBodyHeight();
        var logoHeight = $('#Logo').outerHeight(true);
        var tabHeaderHeight = $('#TabHeader').outerHeight(true);
        var footerHeight = Resizer.getFooterHeight(true);

        $('#Tree').css('height', bodyHeight - logoHeight - tabHeaderHeight - footerHeight);
    },
    tableData: function() {
        var bodyHeight = Resizer.getBodyHeight();
        var h2Height = $('#TableData-Header').outerHeight(true);
        var titleHeight = $('#TableData-Title').outerHeight(true);
        var footerHeight = Resizer.getFooterHeight();

        var bodyWidth = Resizer.getBodyWidth();
        var leftBlockWidth = Resizer.getLeftBlockWidth();
        var contentMarginWidth = Resizer.getContentMarginWidth();
        var tableDataBodyWidth = bodyWidth - leftBlockWidth - contentMarginWidth;
        $('#TableData-Body')
            .css('height', bodyHeight - h2Height - titleHeight - footerHeight)
            .css('width', tableDataBodyWidth);
        $('#TableData-Column-Header, #TableData-Data').css('width', tableDataBodyWidth - 61);
    }
};

