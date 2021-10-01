import type { Probot, Context, ApplicationFunctionOptions } from "probot";
import type { Request, Response } from "express";

import proxy from "./helpers/proxy";
import handlePush from "./handlers/push";
import handleRegister from "./handlers/register";
import handleCompletedRun from "./handlers/completed-run";

export default async (
  app: Probot,
  { getRouter }: ApplicationFunctionOptions
): Promise<void> => {
  if (!getRouter) {
    throw new Error("getRouter() is required");
  }

  const router = getRouter("/app");

  router.get("/register", (req: Request, res: Response) =>
    handleRegister(req, res, { app })
  );

  app.on("workflow_run.completed", handleCompletedRun);
  app.on("push", (context: Context) => handlePush(context));

  if (process.env.NODE_ENV !== "production") {
    await proxy();
  }
};
