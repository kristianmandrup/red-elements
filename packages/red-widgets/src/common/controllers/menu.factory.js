import { Menu } from "./menu";
export class MenuFactory {
    constructor(RED) {
        this.RED = RED;
    }
    init(options) {
        return new Menu(options, this.RED);
    }
}