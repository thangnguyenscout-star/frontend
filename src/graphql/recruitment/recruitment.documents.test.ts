import { describe, expect, it } from 'vitest';
import { buildClientSchema, validate, type IntrospectionQuery } from 'graphql';
import introspection from '../../../docs/graphql-schema.local.json';
import * as documents from './recruitment.documents';

const schema = buildClientSchema(introspection as unknown as IntrospectionQuery);
describe('recruitment operations match the local backend schema', () => {
  for (const [name, document] of Object.entries(documents)) {
    it(name, () => {
      expect(validate(schema, document).map((error) => error.message)).toEqual([]);
    });
  }
});
