// The brand in one place: colours, templates and organisation marks.
// Everything in assets/ and tokens/ is generated from this file by scripts/build.mjs.

export const neutrals = {
  ink: '#0B132A',
  paper: '#FBFAF8',
};

// Colour scales. The template hues are Tailwind CSS's palette (MIT licensed); leaf is our own green.
export const scales = {
  slate: { 50: '#F8FAFC', 100: '#F1F5F9', 200: '#E2E8F0', 300: '#CBD5E1', 400: '#94A3B8', 500: '#64748B', 600: '#475569', 700: '#334155', 800: '#1E293B', 900: '#0F172A' },
  leaf: { 50: '#F4F8EE', 100: '#E6F0DA', 200: '#CDE1B5', 300: '#AECD8A', 400: '#8DBA5A', 500: '#6E9A43', 600: '#5B8137', 700: '#4D6B2C', 800: '#3B5222', 900: '#2C3D19' },
  amber: { 50: '#FFFBEB', 100: '#FEF3C7', 200: '#FDE68A', 300: '#FCD34D', 400: '#FBBF24', 500: '#F59E0B', 600: '#D97706', 700: '#B45309', 800: '#92400E', 900: '#78350F' },
  emerald: { 50: '#ECFDF5', 100: '#D1FAE5', 200: '#A7F3D0', 300: '#6EE7B7', 400: '#34D399', 500: '#10B981', 600: '#059669', 700: '#047857', 800: '#065F46', 900: '#064E3B' },
  blue: { 50: '#EFF6FF', 100: '#DBEAFE', 200: '#BFDBFE', 300: '#93C5FD', 400: '#60A5FA', 500: '#3B82F6', 600: '#2563EB', 700: '#1D4ED8', 800: '#1E40AF', 900: '#1E3A8A' },
  pink: { 50: '#FDF2F8', 100: '#FCE7F3', 200: '#FBCFE8', 300: '#F9A8D4', 400: '#F472B6', 500: '#EC4899', 600: '#DB2777', 700: '#BE185D', 800: '#9D174D', 900: '#831843' },
  violet: { 50: '#F5F3FF', 100: '#EDE9FE', 200: '#DDD6FE', 300: '#C4B5FD', 400: '#A78BFA', 500: '#8B5CF6', 600: '#7C3AED', 700: '#6D28D9', 800: '#5B21B6', 900: '#4C1D95' },
  cyan: { 50: '#ECFEFF', 100: '#CFFAFE', 200: '#A5F3FC', 300: '#67E8F9', 400: '#22D3EE', 500: '#06B6D4', 600: '#0891B2', 700: '#0E7490', 800: '#155E75', 900: '#164E63' },
  red: { 50: '#FEF2F2', 100: '#FEE2E2', 200: '#FECACA', 300: '#FCA5A5', 400: '#F87171', 500: '#EF4444', 600: '#DC2626', 700: '#B91C1C', 800: '#991B1B', 900: '#7F1D1D' },
  lime: { 50: '#F7FEE7', 100: '#ECFCCB', 200: '#D9F99D', 300: '#BEF264', 400: '#A3E635', 500: '#84CC16', 600: '#65A30D', 700: '#4D7C0F', 800: '#3F6212', 900: '#365314' },
};

export const org = {
  name: 'Lean Mean Clean Apps',
  handle: 'LeanMeanCleanApps',
  tagline: 'Clean Architecture templates for .NET, minus the ceremony.',
};

// One hue per template. Reserved entries are hue slots held for templates that don't exist yet.
export const templates = [
  { key: 'minimalapi', name: 'Clean Minimal API', repo: 'CleanMinimalApi', package: 'CleanMinimalApi.Template', shortName: 'cleanminimalapi', hue: 'emerald', what: 'ASP.NET Core Minimal APIs' },
  { key: 'mcp', name: 'Clean Model Context Protocol', repo: 'CleanModelContextProtocol', package: 'CleanModelContextProtocol.Template', shortName: 'cleanmodelcontextprotocol', hue: 'violet', what: 'Model Context Protocol servers' },
  { key: 'graphql', name: 'Clean GraphQL API', repo: 'CleanGraphQLApi', package: 'CleanGraphQLApi.Template', shortName: 'cleangraphqlapi', hue: 'pink', what: 'GraphQL on Hot Chocolate' },
  { key: 'webapi', name: 'Clean Web API', repo: 'CleanWebApi', package: 'CleanWebApi.Template', shortName: 'cleanwebapi', hue: 'blue', what: 'ASP.NET Core Web APIs' },
  { key: 'lambda', name: 'Clean Lambda Function', repo: 'CleanLamdaFunction', package: 'CleanLambdaFunction.Template', shortName: 'cleanlambdafunction', hue: 'amber', what: 'AWS Lambda' },
  { key: 'grpc', name: 'Clean gRPC', hue: 'cyan', what: 'gRPC services', reserved: true },
  { key: 'worker', name: 'Clean Worker', hue: 'red', what: 'background workers', reserved: true },
  { key: 'cli', name: 'Clean CLI', hue: 'lime', what: 'command line tools', reserved: true },
];
