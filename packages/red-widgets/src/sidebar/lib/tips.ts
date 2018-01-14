import {
  Context
} from '../../common'

const { log } = console

export class Tips extends Context {
  public enabled: Boolean = true
  public startDelay: number = 1000
  public cycleDelay: number = 15000
  public tipCount: number = -1
  public startTimeout: any;
  public refreshTimeout: any;
  public tipBox: any
  public maxTipCount = 20

  constructor() {
    super()
    let {
      RED,
      enabled
    } = this

    const {
      startTips,
      stopTips
    } = this.rebind([
        'startTips',
        'stopTips'
      ])

    RED.actions.add("core:toggle-show-tips", (state) => {
      log('configure tips', {
        state
      })

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
    // log('Tips: created')
  }

  setTip() {
    let {
      RED,
      tipCount,
      tipBox,
      startTimeout,
      refreshTimeout,
    } = this

    const {
      cycleTips,
      cycleDelay
    } = this.rebind([
        'cycleTips',
        'cycleDelay'
      ])


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
      this.startTimeout = null;
      this.refreshTimeout = setInterval(cycleTips, cycleDelay);
    }
    return this
  }

  cycleTips() {
    const {
      tipBox
    } = this
    tipBox.fadeOut(300, () => {
      this.setTip();
    })
    return this
  }

  startTips() {
    // log('startTips')
    let {
      RED,
      enabled,
      startDelay,
      tipCount,
      startTimeout,
      refreshTimeout,
      maxTipCount
    } = this
    const {
      setTip,
    } = this.rebind([
        'setTip'
      ])

    let sidebarNodeInfoElem = $(".sidebar-node-info")
    this._validateDefined(sidebarNodeInfoElem, 'sidebarNodeInfoElem', 'stopTips')

    sidebarNodeInfoElem.addClass('show-tips');

    if (enabled) {
      log('startTips', {
        enabled
      })
      if (!startTimeout && !refreshTimeout) {
        if (tipCount === -1) {
          while (true) {
            tipCount++;
            let i18nlabel = RED._("infotips:info.tip" + tipCount)
            let label = "infotips:info.tip" + tipCount
            let matchingLabel = i18nlabel === label
            if (!matchingLabel || tipCount > maxTipCount) break;
            // log({
            //   tipCount
            // })
          }
        }
        this.startTimeout = setTimeout(setTip, startDelay);
      }
      this.tipCount = tipCount
    }
    return this
  }

  stopTips() {
    let {
      startTimeout,
      refreshTimeout
    } = this.rebind([
        'startTimeout',
        'refreshTimeout'
      ])

    let sidebarNodeInfoElem = $(".sidebar-node-info")
    this._validateDefined(sidebarNodeInfoElem, 'sidebarNodeInfoElem', 'stopTips')
    sidebarNodeInfoElem.removeClass('show-tips');
    clearInterval(refreshTimeout);
    clearTimeout(startTimeout);

    this.refreshTimeout = null;
    this.startTimeout = null;
    return this
  }

  nextTip() {
    let {
      startTimeout,
      refreshTimeout,
    } = this

    const {
      setTip
    } = this.rebind([
        'setTip',
      ])

    clearInterval(refreshTimeout);
    startTimeout = true;
    return setTip();
  }
}
