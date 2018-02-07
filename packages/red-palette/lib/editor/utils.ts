import { Context } from "../../../context";

import {
  container,
  delegateTarget,
  delegateTo,
  delegator,
  lazyInject,
  $TYPES
} from './_base'

import {
  I18n
} from '../../../_interfaces'

export interface IPaletteUtils {
  formatUpdatedAt(dateString)
}

const TYPES = $TYPES.all

@delegator(container)
export class PaletteUtils extends Context implements IPaletteUtils {
  @lazyInject(TYPES.i18n) i18n: I18n

  formatUpdatedAt(dateString) {
    const {
      i18n
    } = this
    var now = new Date();
    var d = new Date(dateString);
    var delta = (Date.now() - new Date(dateString).getTime()) / 1000;
    if (delta < 60) {
      return i18n.t('palette.editor.times.seconds');
    }
    delta = Math.floor(delta / 60);
    if (delta < 10) {
      return i18n.t('palette.editor.times.minutes');
    }
    if (delta < 60) {
      return i18n.t('palette.editor.times.minutesV', {
        count: delta
      });
    }

    delta = Math.floor(delta / 60);

    if (delta < 24) {
      return i18n.t('palette.editor.times.hoursV', {
        count: delta
      });
    }

    delta = Math.floor(delta / 24);

    if (delta < 7) {
      return i18n.t('palette.editor.times.daysV', {
        count: delta
      })
    }
    var weeks = Math.floor(delta / 7);
    var days = delta % 7;

    if (weeks < 4) {
      return i18n.t('palette.editor.times.weeksV', {
        count: weeks
      })
    }

    var months = Math.floor(weeks / 4);
    weeks = weeks % 4;

    if (months < 12) {
      return i18n.t('palette.editor.times.monthsV', {
        count: months
      })
    }
    var years = Math.floor(months / 12);
    months = months % 12;

    if (months === 0) {
      return i18n.t('palette.editor.times.yearsV', {
        count: years
      })
    } else {
      return i18n.t('palette.editor.times.year' + (years > 1 ? 's' : '') + 'MonthsV', {
        y: years,
        count: months
      })
    }
  }
}
