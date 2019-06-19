import * as azureGitInterfaces from "azure-devops-node-api/interfaces/GitInterfaces";
import messages from "./user_messages.json"
import { AbstractAzureApi } from "./AbstractAzureApi.js";
import tl = require('azure-pipelines-task-lib/task');

export class PullRequest {

    private id: number;
    private repository: string;
    private projectName: string;
    private static readonly COMMENT =  messages.newIterationCommentHeading;

    constructor(id: number, repository: string, projectName: string) {
        this.id = id;
        this.repository = repository;
        this.projectName = projectName;    
    }

    public async addNewComment(apiCaller: AbstractAzureApi, commentContent: string): Promise<azureGitInterfaces.GitPullRequestCommentThread>{
        let thread: azureGitInterfaces.CommentThread = {comments: new Array({content: commentContent})};
        tl.debug(messages.commentCompletedMessage);
        return apiCaller.postNewCommentThread(thread, this.id, this.repository, this.projectName);
    }

    public async deactivateOldComments(apiCaller: AbstractAzureApi, serviceComments: azureGitInterfaces.GitPullRequestCommentThread[], currentIterationCommentId: number): Promise<void> {
        for (let commentThread of serviceComments) {
            if (commentThread.id != currentIterationCommentId && (commentThread.status === azureGitInterfaces.CommentThreadStatus.Active || commentThread.status === undefined)) {
                tl.debug("comment thread id to be deactivated: " + commentThread.id);
                apiCaller.updateCommentThread({status: azureGitInterfaces.CommentThreadStatus.Closed}, this.id, this.repository, this.projectName, commentThread.id);
            }
        }
    }

    public editMatchingCommentInThread(apiCaller: AbstractAzureApi, thread: azureGitInterfaces.GitPullRequestCommentThread, contentToAdd: string, currentBuildIteration: string): void {
        for (let comment of thread.comments) {
            if (this.commentIsFromService(comment.content, PullRequest.COMMENT) && this.getBuildIterationFromServiceComment(comment.content) === currentBuildIteration) {
                let updatedContent: string = comment.content + contentToAdd;
                tl.debug("comment to be updated: thread id = " + thread.id + ", comment id = " + comment.id);
                apiCaller.updateComment({content: updatedContent}, this.id, this.repository, this.projectName, thread.id, comment.id);
                break;
            }
        }
    }

    public async getCurrentIterationCommentThread(apiCaller: AbstractAzureApi, serviceComments: azureGitInterfaces.GitPullRequestCommentThread[], currentBuildIteration: string): Promise<azureGitInterfaces.GitPullRequestCommentThread | null> {
        for (let commentThread of serviceComments) {
            for (let comment of commentThread.comments){
                if (this.getBuildIterationFromServiceComment(comment.content) === currentBuildIteration){
                    tl.debug("comment thread id of thread of current build iteration " + currentBuildIteration + ": thread id = " + commentThread.id + ", comment id = " + comment.id);
                    return commentThread;
                }
            }
        }
        tl.debug("no comment was found for build iteration " + currentBuildIteration);
        return null;
    }

    private getBuildIterationFromServiceComment(serviceCommentContent: string){
        let splitContent = serviceCommentContent.split("\_\_");
        splitContent.shift();
        if (splitContent.length > 0){
            return (splitContent[0].split(" ").slice(2)).join(" ");  
        }
        tl.debug("no build iteration was found in comment content: " + serviceCommentContent);
        return null;
    }

    public async getCurrentServiceComments(apiCaller: AbstractAzureApi) {
        let commentThreads: azureGitInterfaces.GitPullRequestCommentThread[] = await apiCaller.getCommentThreads(this.id, this.repository, this.projectName);
        let serviceThreads: azureGitInterfaces.GitPullRequestCommentThread[] = [];
        for (let commentThread of commentThreads) {
            for (let comment of commentThread.comments) {
                if (this.commentIsFromService(comment.content, PullRequest.COMMENT)) {
                    serviceThreads.push(commentThread);
                }
                else {
                    tl.debug("the comment: thread id = " + commentThread.id + ", comment id = " + comment.id + " is not from service");
                }
            }
        }
        return serviceThreads;
    }

    private commentIsFromService(commentContent: string, commentFormatString: string): boolean {
        tl.debug("checking " + commentContent + " against " + commentFormatString)
        tl.debug("comment is from service " +  this.convertCommentFormatToRegex(commentFormatString).test(commentContent));
       return this.convertCommentFormatToRegex(commentFormatString).test(commentContent);
    }

    private convertCommentFormatToRegex(commentFormatString: string): RegExp {
        let regex: string = commentFormatString.split("\n")[0];
        regex = regex.replace(/{(\d+)}/g, ".*").replace(/\|/g, '\\|'); 
        return new RegExp(regex);
    }
}