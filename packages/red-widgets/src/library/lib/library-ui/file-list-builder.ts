/**
 *
 */
export class FileListBuilder {
  buildFileListItem(item) {
    var li = document.createElement("li");
    li.onmouseover = function (e) {
      $(this).addClass("list-hover");
    };
    li.onmouseout = function (e) {
      $(this).removeClass("list-hover");
    };
    return li;
  }

  /**
   * TODO: extract Ajax calls to use generic API
   *
   * @param root
   * @param data
   */
  buildFileList(root: string, data: any[]) {
    var ul = document.createElement("ul");
    var li;
    for (var i = 0; i < data.length; i++) {
      var v = data[i];
      if (typeof v === "string") {
        // directory
        li = this.buildFileListItem(v);
        li.onclick = (() => {
          var dirName = v;
          return (e) => {
            var bcli = $('<li class="active"><span class="divider">/</span> <a href="#">' + dirName + '</a></li>');
            $("a", bcli).click((e) => {
              $(this).parent().nextAll().remove();

              $.getJSON("library/" + this.options.url + root + dirName, (data) => {
                $("#node-select-library").children().first().replaceWith(this.buildFileList(root + dirName + "/", data));
              });

              e.stopPropagation();
            });
            var bc = $("#node-dialog-library-breadcrumbs");
            $(".active", bc).removeClass("active");
            bc.append(bcli);

            $.getJSON("library/" + this.options.url + root + dirName, (data) => {
              $("#node-select-library").children().first().replaceWith(this.buildFileList(root + dirName + "/", data));
            });

          }
        })();
        li.innerHTML = '<i class="fa fa-folder"></i> ' + v + "</i>";
        ul.appendChild(li);
      } else {
        // file
        li = this.buildFileListItem(v);
        li.innerHTML = v.name;
        li.onclick = (() => {
          var item = v;
          return (e) => {
            $(".list-selected", ul).removeClass("list-selected");
            $(this).addClass("list-selected");

            $.get("library/" + this.options.url + root + item.fn, (data) => {
              this.selectedLibraryItem = item;
              this.libraryEditor.setValue(data, -1);
            });

          }
        })();
        ul.appendChild(li);
      }
    }
    return ul;
  }
}
