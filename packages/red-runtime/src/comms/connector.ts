import {
  Communications
} from './'

import {
  Context
} from '../context'

export interface IConnector {
  connect: () => void
}

interface AuthTokens {
  access_token: string
}

const { log } = console

/**
 * Connect to WebSocket and set up event handlers for:
 * - open socket channel
 * - close socket channel
 * - receive message on socket channel
 */
export class Connector extends Context {
  protected auth_tokens: AuthTokens
  protected pending_auth: boolean
  protected active: boolean

  constructor(public communications: Communications) {
    super()
  }

  /**
   * Connect to WebSocket and set up socket event handlers
   */
  connect() {
    const {
      RED
    } = this

    let {
      connectWS,
      setInstanceVars,
      _pathOf,
      _onOpen,
      _onClose,
      _onMessage
    } = this.rebind([
        'connectWS',
        'setInstanceVars',
        '_pathOf',
        '_onOpen',
        '_onClose',
        '_onMessage'
      ], this.communications)


    // See: https://developer.mozilla.org/en-US/docs/Web/API/Location
    const active = true
    const location = window.location
    const path = _pathOf(location)
    const auth_tokens = RED.settings.get("auth-tokens");
    const pendingAuth = (auth_tokens != null);

    const ws = new WebSocket(path);

    this.setInstanceVars({
      active,
      location,
      ws,
      auth_tokens,
      pendingAuth
    })

    _onOpen()
    _onClose()
    _onMessage()

    return this
  }

  protected _pathOf(location): string {
    var path = location.hostname;
    var port = location.port;
    if (port.length !== 0) {
      path = path + ":" + port;
    }
    path = path + document.location.pathname;
    path = path + (path.slice(-1) == "/" ? "" : "/") + "comms";
    path = "ws" + (document.location.protocol == "https:" ? "s" : "") + "://" + path;
    return path
  }

  protected _completeConnection() {
    const {
      ws,
      subscriptions
    } = this.communications

    log('Websocket complete connection', {
      ws
    })
    for (var t in subscriptions) {
      if (subscriptions.hasOwnProperty(t)) {
        ws.send(JSON.stringify({
          subscribe: t
        }));
      }
    }
  }

  protected _onOpen() {
    let {
      pendingAuth,
      reconnectAttempts,
      clearErrorTimer,
      active,
      location,
      ws,
      connectCountdown,
      connectCountdownTimer,
      subscriptions,
      errornotification
    } = this.communications

    const {
      auth_tokens
    } = this

    const {
      _completeConnection
    } = this.rebind([
        '_completeConnection'
      ])

    ws.onopen = function () {
      // log('Websocket open', {
      //   ws
      // })
      reconnectAttempts = 0;
      if (errornotification) {
        clearErrorTimer = setTimeout(function () {
          errornotification.close();
          errornotification = null;
        }, 1000);
      }
      if (pendingAuth) {
        ws.send(JSON.stringify({
          auth: auth_tokens.access_token
        }));
      } else {
        _completeConnection();
      }
    }
  }

  protected _onClose() {
    let {
      RED,
      reconnectAttempts,
      errornotification,
      clearErrorTimer,
      active,
      ws,
      connectCountdown,
      connectCountdownTimer,
    } = this.communications

    const {
      connectWS
    } = this.rebind([
        'connectWS'
      ])

    ws.onclose = function () {
      // log('websocket:closed', {
      //   ws
      // })
      if (!active) {
        return;
      }
      if (clearErrorTimer) {
        clearTimeout(clearErrorTimer);
        clearErrorTimer = null;
      }
      reconnectAttempts++;
      if (reconnectAttempts < 10) {
        setTimeout(connectWS, 1000);
        if (reconnectAttempts > 5 && errornotification == null) {
          errornotification = RED.notify(RED._("notification.errors.lostConnection"), "error", true);
        }
      } else if (reconnectAttempts < 20) {
        setTimeout(connectWS, 2000);
      } else {
        connectCountdown = 60;
        connectCountdownTimer = setInterval(function () {
          connectCountdown--;
          if (connectCountdown === 0) {
            errornotification.update(RED._("notification.errors.lostConnection"));
            clearInterval(connectCountdownTimer);
            connectWS();
          } else {
            var msg = RED._("notification.errors.lostConnectionReconnect", {
              time: connectCountdown
            }) + ' <a href="#">' + RED._("notification.errors.lostConnectionTry") + '</a>';
            errornotification.update(msg);
            $(errornotification).find("a").click(function (e) {
              e.preventDefault();
              errornotification.update(RED._("notification.errors.lostConnection"));
              clearInterval(connectCountdownTimer);
              connectWS();
            })
          }
        }, 1000);
      }
    }
  }

  protected _onMessage() {
    let {
      RED,
      pendingAuth,
      active,
      ws,
      subscriptions
    } = this.communications

    const {
      completeConnection,
      connectWS
    } = this.rebind([
        'completeConnection',
        'connectWS'
      ])

    ws.onmessage = function (event) {
      log('websocket: message', {
        event
      })

      const msg = JSON.parse(event.data);
      if (pendingAuth && msg.auth) {
        if (msg.auth === "ok") {
          pendingAuth = false;
          completeConnection();
        } else if (msg.auth === "fail") {
          // anything else is an error...
          active = false;
          RED.user.login({
            updateMenu: true
          }, () => {
            connectWS();
          })
        }
      } else if (msg.topic) {
        for (let t in subscriptions) {
          if (subscriptions.hasOwnProperty(t)) {
            var re = new RegExp("^" + t.replace(/([\[\]\?\(\)\\\\$\^\*\.|])/g, "\\$1").replace(/\+/g, "[^/]+").replace(/\/#$/, "(\/.*)?") + "$");
            if (re.test(msg.topic)) {
              var subscribers = subscriptions[t];
              if (subscribers) {
                for (let i = 0; i < subscribers.length; i++) {
                  subscribers[i](msg.topic, msg.data);
                }
              }
            }
          }
        }
      }
    }
    this.setInstanceVars({
      active,
      pendingAuth
    })
  }
}
