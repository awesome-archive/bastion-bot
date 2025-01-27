"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const rest_1 = __importDefault(require("@octokit/rest"));
const fs = __importStar(require("mz/fs"));
const node_fetch_1 = __importDefault(require("node-fetch"));
exports.GitHub = new rest_1.default();
const tempCmds = [];
async function downloadCmd(file) {
    const fullPath = "./commands/" + file.name;
    const body = await (await node_fetch_1.default(file.download_url)).buffer();
    await fs.writeFile(fullPath, body);
}
exports.botOpts = JSON.parse(fs.readFileSync("config/botOpts.json", "utf8"));
exports.botOpts.cmdRepos.forEach(async (repo) => {
    const res = await exports.GitHub.repos.getContents(repo);
    for (const file of res.data) {
        if (file.name.endsWith(".js")) {
            try {
                await downloadCmd(file);
            }
            catch (e) {
                throw e;
            }
        }
    }
});
const files = fs.readdirSync("./commands");
files.forEach(async (file) => {
    if (file.endsWith(".js")) {
        try {
            const mod = await Promise.resolve().then(() => __importStar(require("../commands/" + file)));
            for (const key in mod) {
                if (mod.hasOwnProperty(key)) {
                    tempCmds.push(mod[key]);
                    console.log("Loaded command " + mod[key].names[0] + "!");
                }
            }
        }
        catch (e) {
            console.error(e);
        }
    }
});
exports.commands = tempCmds;
//# sourceMappingURL=commands.js.map