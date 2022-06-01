/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getTranscribe = /* GraphQL */ `
  query GetTranscribe($id: ID!) {
    getTranscribe(id: $id) {
      id
      state
      speakers
      inputFile
      language
      downloadable
      jobOutputJson
      createdAt
      updatedAt
      owner
    }
  }
`;
export const listTranscribes = /* GraphQL */ `
  query ListTranscribes(
    $filter: ModelTranscribeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTranscribes(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        state
        speakers
        inputFile
        language
        downloadable
        jobOutputJson
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
