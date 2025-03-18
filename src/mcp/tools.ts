import { z } from "zod";
import { escapeSQL, runSQLMCP } from "./utils.js";
import { Tool } from "fastmcp";

export default [
    {
        name: "list_databases",
        description: "List available databases",
        parameters: z.object({}), // Always needs a parameter (even if empty)
        execute: async ({ reportProgress }) => {
            return runSQLMCP("SHOW DATABASES", reportProgress);
        },
    },
    {
        name: "list_tables",
        description: "List available tables from a database",
        parameters: z.object({
            database: z.string() // TODO: Add validation for allowed databases on ClickHouse side (user permissions)
        }),
        execute: async (args, { reportProgress }) => {
            // Filter out backfill tables as well (TODO: could be done with user permissions ?)
            return runSQLMCP(`SHOW TABLES FROM ${escapeSQL(args.database)} NOT LIKE '%backfill%'`, reportProgress);
        },
    },
    {
        name: "describe_table",
        description: "Describe the schema of a table from a database",
        parameters: z.object({
            database: z.string(),
            table: z.string(),
        }),
        execute: async (args, { reportProgress }) => {
            return runSQLMCP(`DESCRIBE ${escapeSQL(args.database)}.${escapeSQL(args.table)}`, reportProgress);
        },
    },
    {
        name: "run_query",
        description: "Run a read-only SQL query",
        parameters: z.object({
            query: z.string()
        }),
        execute: async (args, { reportProgress }) => {
            return runSQLMCP(args.query, reportProgress);
        },
    },
] as Tool<undefined, z.ZodTypeAny>[];