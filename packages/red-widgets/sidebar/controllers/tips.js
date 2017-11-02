import {
  Context
} from './context'

export class Tips extends Context {
  constructor(ctx) {
    super(ctx)
    let RED = ctx
    this.enabled = true;
    this.startDelay = 1000;
    this.cycleDelay = 15000;
    // startTimeout;
    // refreshTimeout;
    this.tipCount = -1;

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
    let RED = this.ctx
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
    tipBox.fadeOut(300, () => {
      this.setTip();
    })
  }

  startTips() {
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
    $(".sidebar-node-info").removeClass('show-tips');
    clearInterval(refreshTimeout);
    clearTimeout(startTimeout);
    refreshTimeout = null;
    startTimeout = null;
  }

  nextTip() {
    clearInterval(refreshTimeout);
    startTimeout = true;
    setTip();
  }
}
