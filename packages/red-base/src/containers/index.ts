import {
  Container
} from 'inversify'

const containers: any = {
  runtime: new Container(),
  widgets: new Container()
}

containers.all = Container.merge(containers.runtime, containers.widgets)

export {
  containers
}

