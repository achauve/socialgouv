import type { Probot } from "probot";
import { Request, Response } from "express";
import { getRun, updateRun } from "../services/runs";
import { username, workflowRepository } from "../helpers/environment";

const handleRegister = async (
  req: Request,
  res: Response,
  { app }: { app: Probot }
): Promise<Response> => {
  const { id, run_id: runId, name, sha, repo_owner, repo_name } = req.query;

  const run = await getRun({ id });

  if (!run || run.push.sha !== sha) return res.sendStatus(404);

  const data = {
    name: name,
    head_sha: sha,
    repo: repo_name,
    owner: repo_owner,
    status: "in_progress",
    details_url: `https://github.com/${username}/${workflowRepository}/actions/runs/${runId}`,
  };

  try {
    let octokit = await app.auth();
    // const installation = await octokit.apps.getOrgInstallation({ org });
    const installation = await octokit.apps.getUserInstallation({ username });
    octokit = await app.auth(installation.data.id);
    const { data: check } = await octokit.checks.create(data);
    await updateRun({ check, id: String(id), runId: Number(runId) });
  } catch (error) {
    console.log(error);
  }

  return res.sendStatus(200);
};

export default handleRegister;
