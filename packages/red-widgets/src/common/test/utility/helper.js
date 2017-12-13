const options = {
    header: $('<div></div>'),
    class: 'editable',
    addButton: true,
    height: 100,
    sortable: "sortable",
    connectWith: 100,
    resize: () => { },
    sort: function (data, item) { return -1; },
    removable: true,
    addItem: function (row, index, data) { },
    scrollOnAdd: true,
    removeItem: function (data) { }
};