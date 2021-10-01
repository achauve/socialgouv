import type { Context } from "probot";
import { getRunById } from "../services/runs";

const handleCompletedRun = async (context: Context): Promise<void> => {
  if (!context.payload.workflow_run.id) return;
  if (context.payload.repository.name !== "test-workflows") return;

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
