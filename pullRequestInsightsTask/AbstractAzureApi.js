"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var azureReleaseInterfaces = __importStar(require("azure-devops-node-api/interfaces/ReleaseInterfaces"));
var WebApi_1 = require("azure-devops-node-api/WebApi");
var Build_1 = require("./Build");
var Release_1 = require("./Release");
var AbstractAzureApi = /** @class */ (function () {
    function AbstractAzureApi(uri, accessKey) {
        this.connection = this.createConnection(uri, accessKey);
    }
    AbstractAzureApi.prototype.getConnection = function () {
        return this.connection;
    };
    AbstractAzureApi.prototype.getBuild = function (project, buildId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = Build_1.Build.bind;
                        return [4 /*yield*/, this.getBuildData(project, buildId)];
                    case 1:
                        _b = [void 0, _c.sent()];
                        return [4 /*yield*/, this.getBuildTimeline(project, buildId)];
                    case 2: return [2 /*return*/, new (_a.apply(Build_1.Build, _b.concat([_c.sent()])))()];
                }
            });
        });
    };
    AbstractAzureApi.prototype.getBuilds = function (project, definition, reason, status, maxNumber, branchName) {
        return __awaiter(this, void 0, void 0, function () {
            var builds, rawBuildsData, numberBuild, id, _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        builds = [];
                        return [4 /*yield*/, this.connection.getBuildApi()];
                    case 1: return [4 /*yield*/, (_e.sent()).getBuilds(project, Array(definition), undefined, undefined, undefined, undefined, undefined, reason, status, undefined, undefined, undefined, maxNumber, undefined, undefined, undefined, undefined, branchName)];
                    case 2:
                        rawBuildsData = _e.sent();
                        numberBuild = 0;
                        _e.label = 3;
                    case 3:
                        if (!(numberBuild < rawBuildsData.length)) return [3 /*break*/, 6];
                        id = Number(rawBuildsData[numberBuild].id);
                        _a = builds;
                        _b = numberBuild;
                        _c = Build_1.Build.bind;
                        _d = [void 0, rawBuildsData[numberBuild]];
                        return [4 /*yield*/, this.getBuildTimeline(project, id)];
                    case 4:
                        _a[_b] = new (_c.apply(Build_1.Build, _d.concat([_e.sent()])))();
                        _e.label = 5;
                    case 5:
                        numberBuild++;
                        return [3 /*break*/, 3];
                    case 6: return [2 /*return*/, builds];
                }
            });
        });
    };
    AbstractAzureApi.prototype.getRelease = function (project, releaseId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = Release_1.Release.bind;
                        return [4 /*yield*/, this.getReleaseData(project, releaseId)];
                    case 1: return [2 /*return*/, new (_a.apply(Release_1.Release, [void 0, _b.sent()]))()];
                }
            });
        });
    };
    AbstractAzureApi.prototype.getReleases = function (project, definition, reason, status, maxNumber, branchName) {
        return __awaiter(this, void 0, void 0, function () {
            var releases, rawReleasesData, numberRelease;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        releases = [];
                        return [4 /*yield*/, this.connection.getReleaseApi()];
                    case 1: return [4 /*yield*/, (_a.sent()).getReleases(project, definition, undefined, undefined, undefined, status, undefined, undefined, undefined, undefined, maxNumber, undefined, azureReleaseInterfaces.ReleaseExpands.Environments, undefined, undefined, undefined, branchName)];
                    case 2:
                        rawReleasesData = _a.sent();
                        for (numberRelease = 0; numberRelease < rawReleasesData.length; numberRelease++) {
                            releases[numberRelease] = new Release_1.Release(rawReleasesData[numberRelease]);
                        }
                        return [2 /*return*/, releases];
                }
            });
        });
    };
    AbstractAzureApi.prototype.postNewCommentThread = function (thread, pullRequestId, repositoryId, projectName) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getConnection().getGitApi()];
                    case 1:
                        (_a.sent()).createThread(thread, repositoryId, pullRequestId, projectName);
                        return [2 /*return*/];
                }
            });
        });
    };
    AbstractAzureApi.prototype.getPullRequestData = function (repositoryId, pullRequestId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getConnection().getGitApi()];
                    case 1: return [2 /*return*/, (_a.sent()).getPullRequest(repositoryId, pullRequestId)];
                }
            });
        });
    };
    AbstractAzureApi.prototype.getBuildData = function (project, buildId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getConnection().getBuildApi()];
                    case 1: return [2 /*return*/, (_a.sent()).getBuild(project, buildId)];
                }
            });
        });
    };
    AbstractAzureApi.prototype.getBuildTimeline = function (project, buildId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getConnection().getBuildApi()];
                    case 1: return [2 /*return*/, (_a.sent()).getBuildTimeline(project, buildId)];
                }
            });
        });
    };
    AbstractAzureApi.prototype.getReleaseData = function (project, releaseId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getConnection().getReleaseApi()];
                    case 1: return [2 /*return*/, (_a.sent()).getRelease(project, releaseId)];
                }
            });
        });
    };
    AbstractAzureApi.prototype.createConnection = function (uri, accessToken) {
        var creds = WebApi_1.getPersonalAccessTokenHandler(accessToken);
        return new WebApi_1.WebApi(uri, creds);
    };
    return AbstractAzureApi;
}());
exports.AbstractAzureApi = AbstractAzureApi;
//     public async postNewCommentThread (thread: azureGitInterfaces.GitPullRequestCommentThread, pullRequestId: number, repositoryId: string, projectName: string): Promise<void>{
//         (await this.getConnection().getGitApi()).createThread(thread, repositoryId, pullRequestId, projectName);
//     }
//     public async getBuild(project: string, buildId: number): Promise<Build>{
//         return new Build(await this.getBuildData(project, buildId), await this.getBuildTimeline(project, buildId));
//     }
//     public async getBuilds(project: string, definitions?: number[], reason?: azureBuildInterfaces.BuildReason, status?: azureBuildInterfaces.BuildStatus, maxNumber?: number, branchName?: string): Promise<Build[]>{
//         let builds: Array<Build> = []; 
//         let rawBuildsData: azureBuildInterfaces.Build[] = await (await this.connection.getBuildApi()).getBuilds(project, definitions, undefined, undefined, undefined, undefined, undefined, reason, status, undefined, undefined, undefined, maxNumber, undefined, undefined, undefined, undefined, branchName);  
//         for (let numberBuild = 0; numberBuild < rawBuildsData.length; numberBuild++){
//             let id: number = Number(rawBuildsData[numberBuild].id);
//             builds[numberBuild] = new Build(await this.getBuildData(project, id), await this.getBuildTimeline(project, id));
//     }
//     return builds;
// }
//     private async getBuildData(project: string, buildId: number): Promise<azureBuildInterfaces.Build>{
//         return (await this.getConnection().getBuildApi()).getBuild(project, buildId);
//     }
//     private async getBuildTimeline(project: string, buildId: number): Promise<azureBuildInterfaces.Timeline>{
//         return (await this.getConnection().getBuildApi()).getBuildTimeline(project, buildId); 
//     }
//     public async getRelease(project: string, releaseId: number): Promise<Release>{
//         return new Release(await this.getReleaseData(project, releaseId)); 
//     }
//     private async getReleaseData(project: string, releaseId: number): Promise<azureReleaseInterfaces.Release>{
//         return (await this.getConnection().getReleaseApi()).getRelease(project, releaseId); 
//     }
// public async getCurrentPipeline(configurations: EnvironmentConfigurations): Promise<IPipeline>{
//     //let type: string = configurations.getHostType();
//     //if (type === AzureApi.BUILD){
//         return this.getBuild(configurations.getProjectName(), configurations.getBuildId()); 
//     }
//if (type === AzureApi.RELEASE){
//     return this.getRelease(configurations.getProjectName(), configurations.getReleaseId()); 
// }
// throw(new Error(`ERROR: CANNOT RUN FOR HOST TYPE ${type}`));
//}
// private createConnection(teamFoundationUri: string, accessToken: string): WebApi {
//     let creds = getPersonalAccessTokenHandler(accessToken);
//     return new WebApi(teamFoundationUri, creds);
// }
//}