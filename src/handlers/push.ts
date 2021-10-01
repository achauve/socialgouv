import type { Context } from "probot";
import { insertRun } from "../services/runs";

const handlePush = async (context: Context): Promise<void> => {
  const webhook = await context.octokit.apps.getWebhookConfigForApp();

  const token = await context.octokit.apps.createInstallationAccessToken({
    installation_id: context?.payload?.installation?.id || 0,
    repository_ids: [context.payload.repository.id],
  });

  const push = {
    sha: context.payload.after,
    callback_url: `${webhook.data.url}/app/register`,
    repository: {
      owner: context.payload.repository.owner.login,
      name: context.payload.repository.name,
      full_name: context.payload.repository.full_name,
    },
  } as Push;

  const { id } = await insertRun({ push });

  await context.octokit.repos.createDispatchEvent({
    owner: "gary-van-woerkens",
    repo: "test-workflows",
    event_type: "socialgouv-bot",
    client_payload: {
      id,
      token: token.data.token,
      ...push,
      event: context.payload,
    },
  });
};

export default handlePush;

// // Probot API note: context.repo() => { username: 'hiimbex', repo: 'testing-things' }
// const res = await context.octokit.repos.createDeployment(
//   context.repo({
//     ref: context.payload.pull_request.head.ref, // The ref to deploy. This can be a branch, tag, or SHA.
//     task: "deploy", // Specifies a task to execute (e.g., deploy or deploy:migrations).
//     auto_merge: true, // Attempts to automatically merge the default branch into the requested ref, if it is behind the default branch.
//     required_contexts: [], // The status contexts to verify against commit status checks. If this parameter is omitted, then all unique contexts will be verified before a deployment is created. To bypass checking entirely pass an empty array. Defaults to all unique contexts.
//     payload: {
//       schema: "rocks!",
//     }, // JSON payload with extra information about the deployment. Default: ""
//     environment: "production", // Name for the target deployment environment (e.g., production, staging, qa)
//     description: "My Probot App's first deploy!", // Short description of the deployment
//     transient_environment: false, // Specifies if the given environment is specific to the deployment and will no longer exist at some point in the future.
//     production_environment: true, // Specifies if the given environment is one that end-users directly interact with.
//   })
// );

// const deploymentId = res.data.id;
// await context.octokit.repos.createDeploymentStatus(
//   context.repo({
//     deployment_id: deploymentId,
//     state: "success", // The state of the status. Can be one of error, failure, inactive, pending, or success
//     log_url: "https://example.com", // The log URL to associate with this status. This URL should contain output to keep the user updated while the task is running or serve as historical information for what happened in the deployment.
//     description: "My Probot App set a deployment status!", // A short description of the status.
//     environment_url: "https://example.com", // Sets the URL for accessing your environment.
//     auto_inactive: true, // Adds a new inactive status to all prior non-transient, non-production environment deployments with the same repository and environment name as the created status's deployment. An inactive status is only added to deployments that had a success state.
//   })
// );
