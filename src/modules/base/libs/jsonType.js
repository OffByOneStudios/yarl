'use babel'
import {compose} from 'redux';
import Documentable from '../../../configure/libs/documentable'

import Resolvable from '../../../configure/libs/resolvable'

import { GraphQLScalarType } from 'graphql';


function jsonType() {
  return new GraphQLScalarType({
    name: 'JSON',
    description: 'GraphQL JSON Scalar',
    serialize(value) {
      return value;
    },
    parseValue(value) {
      return value;
    },
    parseLiteral(ast) {
      switch (ast.kind) {
        case Kind.STRING:
        case Kind.BOOLEAN:
          return ast.value;
        case Kind.INT:
        case Kind.FLOAT:
          return parseFloat(ast.value);
        case Kind.OBJECT: {
          const value = Object.create(null);
          ast.fields.forEach((field) => {
            value[field.name.value] = parseLiteral(field.value);
          });

          return value;
        }
        case Kind.LIST:
          return ast.values.map(parseLiteral);
        default:
          return null;
      }
    }
  })
}

export default compose (
  Documentable({
  text: `# jsonType`,
  args: {

  }
}),

  Resolvable('JSON')

)(jsonType());
