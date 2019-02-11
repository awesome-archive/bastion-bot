"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../modules/Command");
const libraryPages_1 = require("../modules/libraryPages");
const util_1 = require("../modules/util");
const names = ["f"];
async function func(msg) {
    const content = util_1.trimMsg(msg);
    const funcs = await libraryPages_1.functions.getResults(content);
    if (funcs.length > 0) {
        return await util_1.sendLibrary(funcs, msg);
    }
    return msg.channel.createMessage("Sorry, I couldn't find any functions matching `" + content + "`!");
}
exports.command = new Command_1.Command(names, func);
//# sourceMappingURL=function.js.map