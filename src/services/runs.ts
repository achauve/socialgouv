import { GraphQLClient, gql } from "graphql-request";
import { getJwt } from "../utils/jwt";

const token = getJwt();

const client = new GraphQLClient("http://localhost:8080/v1/graphql", {
  headers: {
    authorization: `Bearer ${token}`,
  },
});

export const getRun = async (params: Record<string, unknown>): Promise<Run> => {
  const query = gql`
    query GetRun($id: uuid!) {
      runs_by_pk(id: $id) {
        id
        push
        runId: run_id
      }
    }
  `;

  const { runs_by_pk } = await client.request(query, params);

  return runs_by_pk;
};

export const getRunById = async (
  params: Record<string, unknown>
): Promise<Run> => {
  const query = gql`
    query GetRunById($runId: numeric!) {
      runs(limit: 1, where: { run_id: { _eq: $runId } }) {
        id
        push
        check
        runId: run_id
      }
    }
  `;

  const { runs } = await client.request(query, params);

  return runs.pop();
};

export const insertRun = async (
  params: Record<string, unknown>
): Promise<Run> => {
  const query = gql`
    mutation InsertRun($push: jsonb!) {
      insert_runs_one(object: { push: $push }) {
        id
      }
    }
  `;

  const { insert_runs_one } = await client.request(query, params);

  return insert_runs_one;
};

export const updateRun = async ({
  id,
  runId,
  check,
}: {
  id: string;
  runId: number;
  check: Record<string, unknown>;
}): Promise<Record<string, unknown>> => {
  const query = gql`
    mutation UpdateRun($id: uuid!, $runId: numeric!, $check: jsonb!) {
      update_runs_by_pk(
        pk_columns: { id: $id }
        _set: { run_id: $runId, check: $check }
      ) {
        id
      }
    }
  `;

  const result = await client.request(query, { id, runId, check });

  return result;
};
