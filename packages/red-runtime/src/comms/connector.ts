import {
  Communications
} from './'

import {
  Context,
  lazyInject,
  $TYPES
} from './_base'

import {
  INotifications,
  IUser
} from '../interfaces'

const TYPES = $TYPES.all

interface AuthTokens {
  access_token: string
}

const { log } = console

export interface IConnector {
  connect()
  pathOf(location)
}

/**
 * Connect to WebSocket and set up event handlers for:
 * - open socket channel
 * - close socket channel
 * - receive message on socket channel
 */
export class Connector extends Context implements IConnector {
  @lazyInject(TYPES.notifications) notifications: INotifications
  @lazyInject(TYPES.user) user: IUser


  protected auth_tokens: AuthTokens
  protected pending_auth: boolean
  protected active: boolean


  constructor(public communications: Communications) {
    super()
  }

  /**
   * Connect to WebSocket and set up socket event handlers
   */
  pathOf(location) {
    return this._pathOf(location);
  }

  connect() {
    const {
      RED
    } = this

    let location1

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
    const path = this.pathOf(location);

    const auth_tokens = RED.settings.get("auth-tokens");
    const pendingAuth = (auth_tokens != null);

    //const ws = new WebSocket(path);


    this.setInstanceVars({
      active,
      location,
      //ws,
      auth_tokens,
      pendingAuth
    })

    _onOpen
    _onClose
    _onMessage
    // _pathOf(location)
    // this._pathOf(location)
    // {
    //   return _pathOf(location);
    // }

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

    const { notifications } = this
    const notify = notifications.notify.bind(notifications)

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
          errornotification = notify.notify(RED._("notification.errors.lostConnection"), "error", true);
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

    const { user } = this

    const {
      completeConnection,
      connectWS
    } = this.rebind([
        'completeConnection',
        'connectWS'
      ])

    ws.onmessage = async function (event) {
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
          await user.login({
            updateMenu: true
          })
          connectWS()
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
