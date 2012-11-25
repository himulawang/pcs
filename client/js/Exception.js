var Exception = function Exception(code) {
    $('#error').dialog({
        title: 'Ops...',
        modal: true,
        buttons: {
            OK: function() {
                $(this).dialog('close');
            },
        }
    }).html('Error ' + code + ': ' + ExceptionCodes[code]);
    throw new Error(code);
};
