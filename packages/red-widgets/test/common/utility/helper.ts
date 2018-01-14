interface option {
    header: any,
    class: any,
    addButton: any,
    height: any,
    sortable: any,
    connectWith: any,
    resize: any,
    sort: any,
    removable: any,
    addItem: any,
    scrollOnAdd: any,
    removeItem: any
}

let options: option = {
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

export default options;