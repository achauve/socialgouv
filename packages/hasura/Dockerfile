FROM hasura/graphql-engine:v2.0.9.cli-migrations-v3

ENV HASURA_GRAPHQL_ENABLE_CONSOLE=false
ENV HASURA_GRAPHQL_ENABLE_TELEMETRY=false

COPY ./packages/hasura/migrations /hasura-migrations
COPY ./packages/hasura/metadata /hasura-metadata
