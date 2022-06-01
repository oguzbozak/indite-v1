/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createTranscribe = /* GraphQL */ `
  mutation CreateTranscribe(
    $input: CreateTranscribeInput!
    $condition: ModelTranscribeConditionInput
  ) {
    createTranscribe(input: $input, condition: $condition) {
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
export const updateTranscribe = /* GraphQL */ `
  mutation UpdateTranscribe(
    $input: UpdateTranscribeInput!
    $condition: ModelTranscribeConditionInput
  ) {
    updateTranscribe(input: $input, condition: $condition) {
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
export const deleteTranscribe = /* GraphQL */ `
  mutation DeleteTranscribe(
    $input: DeleteTranscribeInput!
    $condition: ModelTranscribeConditionInput
  ) {
    deleteTranscribe(input: $input, condition: $condition) {
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
