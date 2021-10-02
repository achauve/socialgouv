import type { Probot } from "probot";
import { Request, Response } from "express";
import { getRun, updateRun } from "../services/runs";
import { APP_USERNAME, APP_WORKFLOW_REPOSITORY } from "../helpers/environment";

const handleRegister = async (
  req: Request,
  res: Response,
  { app }: { app: Probot }
): Promise<Response> => {
  const { id, name, sha, runId, repoOwner, repoName } = req.query;

  const run = await getRun({ id });

  if (!run || run.push.sha !== sha) return res.sendStatus(404);

  const data = {
    name: name,
    head_sha: sha,
    repo: repoName,
    owner: repoOwner,
    status: "in_progress",
    details_url: `https://github.com/${APP_USERNAME}/${APP_WORKFLOW_REPOSITORY}/actions/runs/${runId}`,
  };

  try {
    let octokit = await app.auth();
    // const installation = await octokit.apps.getOrgInstallation({ org });
    const installation = await octokit.apps.getUserInstallation({
      username: APP_USERNAME,
    });
    octokit = await app.auth(installation.data.id);
    const { data: check } = await octokit.checks.create(data);
    await updateRun({ check, id: String(id), runId: Number(runId) });
  } catch (error) {
    console.log(error);
  }

  return res.sendStatus(200);
};

export default handleRegister;
