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
var tl = require("azure-pipelines-task-lib/task");
var EnvironmentConfigurations_1 = require("./EnvironmentConfigurations");
var fs = require('fs');
var user_messages_json_1 = __importDefault(require("./user_messages.json"));
var azureBuildInterfaces = __importStar(require("azure-devops-node-api/interfaces/BuildInterfaces"));
var Branch_1 = require("./Branch");
var AzureApiFactory_1 = require("./AzureApiFactory");
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var pastFailureThreshold, numberBuildsToQuery, desiredBuildReasons, desiredBuildStatus, configurations, azureApiFactory, azureApi, currentProject, currentPipeline, targetBranchName, retrievedPipelines, targetBranch, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 8, , 9]);
                    tl.debug("starting!");
                    pastFailureThreshold = 2;
                    numberBuildsToQuery = 10;
                    desiredBuildReasons = azureBuildInterfaces.BuildReason.BatchedCI + azureBuildInterfaces.BuildReason.IndividualCI;
                    desiredBuildStatus = azureBuildInterfaces.BuildStatus.Completed;
                    configurations = new EnvironmentConfigurations_1.EnvironmentConfigurations();
                    azureApiFactory = new AzureApiFactory_1.AzureApiFactory();
                    return [4 /*yield*/, azureApiFactory.create(configurations)];
                case 1:
                    azureApi = _a.sent();
                    currentProject = configurations.getProjectName();
                    return [4 /*yield*/, azureApi.getCurrentPipeline(configurations)];
                case 2:
                    currentPipeline = _a.sent();
                    tl.debug("pull request id: " + configurations.getPullRequestId());
                    if (!!configurations.getPullRequestId()) return [3 /*break*/, 3];
                    tl.debug(this.format(user_messages_json_1.default.notInPullRequestMessage, configurations.getHostType()));
                    return [3 /*break*/, 7];
                case 3:
                    if (!!currentPipeline.isFailure()) return [3 /*break*/, 4];
                    tl.debug(this.format(user_messages_json_1.default.noFailureMessage, configurations.getHostType()));
                    return [3 /*break*/, 7];
                case 4: return [4 /*yield*/, configurations.getTargetBranch(azureApi)];
                case 5:
                    targetBranchName = _a.sent();
                    return [4 /*yield*/, azureApi.getMostRecentPipelinesOfCurrentType(currentProject, currentPipeline.getDefinitionId(), desiredBuildReasons, desiredBuildStatus, numberBuildsToQuery, targetBranchName)];
                case 6:
                    retrievedPipelines = _a.sent();
                    targetBranch = new Branch_1.Branch(targetBranchName, retrievedPipelines);
                    if (targetBranch.tooManyPipelinesFailed(pastFailureThreshold)) {
                        postFailuresComment(azureApi, targetBranch, configurations.getPullRequestId(), configurations.getRepository(), configurations.getProjectName(), configurations.getHostType());
                    }
                    _a.label = 7;
                case 7: return [3 /*break*/, 9];
                case 8:
                    err_1 = _a.sent();
                    console.log("error!", err_1);
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    });
}
function postFailuresComment(azureApi, targetBranch, pullRequestId, repository, project, type) {
    var mostRecentTargetFailedPipeline = targetBranch.getMostRecentFailedPipeline();
    if (mostRecentTargetFailedPipeline !== null) {
        var thread = { comments: new Array({ content: format(user_messages_json_1.default.failureComment, mostRecentTargetFailedPipeline.getLink(), String(targetBranch.getPipelineFailStreak()), targetBranch.getName(), type) }) };
        azureApi.postNewCommentThread(thread, pullRequestId, repository, project);
        tl.debug(user_messages_json_1.default.commentCompletedMessage);
    }
}
function format(text) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return text.replace(/{(\d+)}/g, function (match, num) {
        return typeof args[num] !== 'undefined' ? args[num] : match;
    });
}
run();