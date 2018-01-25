import { BaseAdapter } from "../base/index";

export interface IAxiosAdapter {

}

export class AxiosAdapter extends BaseAdapter implements IAxiosAdapter {
  constructor(public api: any, config?: any) {
    super(api, config)
  }
}
