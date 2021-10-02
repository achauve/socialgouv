import type { Context } from "probot";
import { getRunById } from "../services/runs";
import { APP_WORKFLOW_REPOSITORY } from "../helpers/environment";

const handleCompletedRun = async (context: Context): Promise<void> => {
  if (!context.payload.workflow_run.id) return;
  if (context.payload.repository.name !== APP_WORKFLOW_REPOSITORY) return;

  const {
    check,
    push: { repository },
  } = await getRunById({ runId: context.payload.workflow_run.id });

  const data = {
    name: check.name,
    repo: repository.name,
    check_run_id: check.id,
    owner: repository.owner,
    status: context.payload.workflow_run?.status,
    conclusion: context.payload.workflow_run?.conclusion,
  };

  await context.octokit.checks.update(data);
};

export default handleCompletedRun;
