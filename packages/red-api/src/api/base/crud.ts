import { BaseApi } from "./api";
import {
  IApiRead,
  IApiUpdate,
  IApiCreate,
  IApiDelete
} from './methods'

export class CrudApi extends BaseApi {
  public read: IApiRead
  public update: IApiUpdate
  public create: IApiCreate
  public delete: IApiDelete
}
