import {
  Context
} from '../../common'

export class Tips extends Context {
  public enabled: Boolean = true
  public startDelay: number = 1000
  public cycleDelay: number = 15000
  public tipCount: number = -1
  public startTimeout: any;
  public refreshTimeout: any;
  public tipBox: any

  constructor() {
    super()
    const RED = this.RED
    let {
      enabled,
      startTips,
      stopTips
    } = this.rebind([
        'startTips',
        'stopTips'
      ])

    RED.actions.add("core:toggle-show-tips", function (state) {
      if (state === undefined) {
        RED.userSettings.toggle("view-show-tips");
      } else {
        enabled = state;
        if (enabled) {
          startTips();
        } else {
          stopTips();
        }
      }
    });
  }

  setTip() {
    const {
      RED,
     } = this
    let {
      tipCount,
      tipBox,
      startTimeout,
      refreshTimeout,
      cycleTips,
      cycleDelay
    } = this
    var r = Math.floor(Math.random() * tipCount);
    var tip = RED._("infotips:info.tip" + r);

    var m;
    while ((m = /({{(.*?)}})/.exec(tip))) {
      var shortcut = RED.keyboard.getShortcut(m[2]);
      if (shortcut) {
        tip = tip.replace(m[1], RED.keyboard.formatKey(shortcut.key));
      } else {
        return;
      }
    }
    while ((m = /(\[(.*?)\])/.exec(tip))) {
      tip = tip.replace(m[1], RED.keyboard.formatKey(m[2]));
    }
    tipBox.html(tip).fadeIn(200);
    if (startTimeout) {
      startTimeout = null;
      refreshTimeout = setInterval(cycleTips, cycleDelay);
    }
  }

  cycleTips() {
    const {
      tipBox
    } = this
    tipBox.fadeOut(300, () => {
      this.setTip();
    })
  }

  startTips() {
    const {
      enabled,
      refreshTimeout,
      setTip,
      startDelay,
      RED
    } = this
    let {
    tipCount,
      startTimeout
  } = this

    $(".sidebar-node-info").addClass('show-tips');
    if (enabled) {
      if (!startTimeout && !refreshTimeout) {
        if (tipCount === -1) {
          do {
            tipCount++;
          } while (RED._("infotips:info.tip" + tipCount) !== "infotips:info.tip" + tipCount);
        }
        startTimeout = setTimeout(setTip, startDelay);
      }
    }
  }

  stopTips() {
    let {
      startTimeout,
      refreshTimeout
    } = this

    $(".sidebar-node-info").removeClass('show-tips');
    clearInterval(refreshTimeout);
    clearTimeout(startTimeout);
    refreshTimeout = null;
    startTimeout = null;
  }

  nextTip() {
    let {
      startTimeout,
      refreshTimeout,
      setTip
    } = this.rebind([
        'setTip'
      ])

    clearInterval(refreshTimeout);
    startTimeout = true;
    setTip();
  }
}
