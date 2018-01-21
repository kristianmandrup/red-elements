import { User } from '../'
import { Context } from '../../context'
import { ServerTokenPoster } from './server/token-poster';

interface IDialogElem extends JQuery<HTMLElement> {
  dialog: Function
}

interface IButton extends JQuery<HTMLElement> {
  button: Function
}

export class UserLogin extends Context {
  public tokenPoster: ServerTokenPoster = new ServerTokenPoster(this.user.server)

  constructor(public user: User) {
    super()
  }

  async loginDialog(opts) {
    const {
      RED,
      updateUserMenu
    } = this.rebind([
        'updateUserMenu'
      ])

    if (typeof opts == 'function') {
      opts = {};
    }

    var dialog = <IDialogElem>$('<div id="node-dialog-login" class="hide">' +
      '<div style="display: inline-block;width: 250px; vertical-align: top; margin-right: 10px; margin-bottom: 20px;"><img id="node-dialog-login-image" src=""/></div>' +
      '<div style="display: inline-block; width: 250px; vertical-align: bottom; margin-left: 10px; margin-bottom: 20px;">' +
      '<form id="node-dialog-login-fields" class="form-horizontal" style="margin-bottom: 0px;"></form>' +
      '</div>' +
      '</div>');

    dialog.dialog({
      autoOpen: false,
      dialogClass: "ui-dialog-no-close",
      modal: true,
      closeOnEscape: !!opts.cancelable,
      width: 600,
      resizable: false,
      draggable: false
    });

    $("#node-dialog-login-fields").empty();

    await this.serverUserLogin({
      dialog
    })
  }

  /**
   *
   * Also posts auth token to server
   * @param param
   */
  onLoginSuccess({ data, opts }) {
    const {
      RED
    } = this
    const {
      updateUserMenu,
      postAuthToken
    } = this.rebind([
        'updateUserMenu',
        'postAuthToken'
      ])
    const user = this
    let i
    if (data.type == "credentials") {
      for (; i < data.prompts.length; i++) {
        var field = data.prompts[i];
        var row = $("<div/>", {
          class: "form-row"
        });
        $('<label for="node-dialog-login-' + field.id + '">' + RED._(field.label) + ':</label><br/>').appendTo(row);
        var input = $('<input style="width: 100%" id="node-dialog-login-' + field.id + '" type="' + field.type + '" tabIndex="' + (i + 1) + '"/>').appendTo(row);

        if (i < data.prompts.length - 1) {
          input.keypress(
            (function () {
              var r = row;
              return function (event) {
                if (event.keyCode == 13) {
                  r.next("div").find("input").focus();
                  event.preventDefault();
                }
              }
            })()
          );
        }
        row.appendTo("#node-dialog-login-fields");
      }
      $('<div class="form-row" style="text-align: right; margin-top: 10px;"><span id="node-dialog-login-failed" style="line-height: 2em;float:left;" class="hide">' + RED._("user.loginFailed") + '</span><img src="red/images/spin.svg" style="height: 30px; margin-right: 10px; " class="login-spinner hide"/>' +
        (opts.cancelable ? '<a href="#" id="node-dialog-login-cancel" style="margin-right: 20px;" tabIndex="' + (i + 1) + '">' + RED._("common.label.cancel") + '</a>' : '') +
        '<input type="submit" id="node-dialog-login-submit" style="width: auto;" tabIndex="' + (i + 2) + '" value="' + RED._("user.login") + '"></div>').appendTo("#node-dialog-login-fields");


      const buttonElem = <IButton>$("#node-dialog-login-submit")
      buttonElem.button();
      $("#node-dialog-login-fields").submit((event) => {
        buttonElem.button("option", "disabled", true);
        $("#node-dialog-login-failed").hide();
        $(".login-spinner").show();

        var body = {
          client_id: "node-red-editor",
          grant_type: "password",
          scope: ""
        }
        for (var i = 0; i < data.prompts.length; i++) {
          var field = data.prompts[i];
          body[field.id] = $("#node-dialog-login-" + field.id).val();
        }

        opts.buttonElem = buttonElem
        postAuthToken(body, opts)

        event.preventDefault();
      });

    } else if (data.type == "strategy") {
      i = 0;
      for (; i < data.prompts.length; i++) {
        var field = data.prompts[i];
        var row = $("<div/>", {
          class: "form-row",
          style: "text-align: center"
        }).appendTo("#node-dialog-login-fields");

        var loginButton = <IButton>$('<a href="#"></a>', {
          style: "padding: 10px"
        }).appendTo(row).click(function () {
          // document.location = field.url;
          // TODO: FIX ME!
          throw Error('user: login - trying to set document location!!')
        });
        if (field.image) {
          $("<img>", {
            src: field.image
          }).appendTo(loginButton);
        } else if (field.label) {
          var label = $('<span></span>').text(field.label);
          if (field.icon) {
            $('<i></i>', {
              class: "fa fa-2x " + field.icon,
              style: "vertical-align: middle"
            }).appendTo(loginButton);
            label.css({
              "verticalAlign": "middle",
              "marginLeft": "8px"
            });

          }
          label.appendTo(loginButton);
        }
        loginButton.button();
      }
    }
  }

  /**
   * Perform user login on server
   * @param param0
   */
  serverUserLogin({
    dialog
  }) {
    this.user.server.login({
      dialog
    })
  }
}

