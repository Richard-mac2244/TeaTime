/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createBobaUser = /* GraphQL */ `
  mutation CreateBobaUser(
    $input: CreateBobaUserInput!
    $condition: ModelbobaUserConditionInput
  ) {
    createBobaUser(input: $input, condition: $condition) {
      authenticated
      confirmed
      email
      favorites
      firstName
      secondaryId
      id
      lastName
      phoneNumber
      review
      createdOn
      updatedOn
    }
  }
`;
export const updateBobaUser = /* GraphQL */ `
  mutation UpdateBobaUser(
    $input: UpdateBobaUserInput!
    $condition: ModelbobaUserConditionInput
  ) {
    updateBobaUser(input: $input, condition: $condition) {
      authenticated
      confirmed
      email
      favorites
      firstName
      secondaryId
      id
      lastName
      phoneNumber
      review
      createdOn
      updatedOn
    }
  }
`;
export const deleteBobaUser = /* GraphQL */ `
  mutation DeleteBobaUser(
    $input: DeleteBobaUserInput!
    $condition: ModelbobaUserConditionInput
  ) {
    deleteBobaUser(input: $input, condition: $condition) {
      authenticated
      confirmed
      email
      favorites
      firstName
      secondaryId
      id
      lastName
      phoneNumber
      review
      createdOn
      updatedOn
    }
  }
`;
export const createBobaReview = /* GraphQL */ `
  mutation CreateBobaReview(
    $input: CreateBobaReviewInput!
    $condition: ModelbobaReviewConditionInput
  ) {
    createBobaReview(input: $input, condition: $condition) {
      id
      bobaShopId
      bobaUserId
      rating
      Description
      createdOn
      updatedOn
    }
  }
`;
export const updateBobaReview = /* GraphQL */ `
  mutation UpdateBobaReview(
    $input: UpdateBobaReviewInput!
    $condition: ModelbobaReviewConditionInput
  ) {
    updateBobaReview(input: $input, condition: $condition) {
      id
      bobaShopId
      bobaUserId
      rating
      Description
      createdOn
      updatedOn
    }
  }
`;
export const deleteBobaReview = /* GraphQL */ `
  mutation DeleteBobaReview(
    $input: DeleteBobaReviewInput!
    $condition: ModelbobaReviewConditionInput
  ) {
    deleteBobaReview(input: $input, condition: $condition) {
      id
      bobaShopId
      bobaUserId
      rating
      Description
      createdOn
      updatedOn
    }
  }
`;
export const createBobaShop = /* GraphQL */ `
  mutation CreateBobaShop(
    $input: CreateBobaShopInput!
    $condition: ModelbobaShopConditionInput
  ) {
    createBobaShop(input: $input, condition: $condition) {
      address
      coordinates
      id
      secondaryId
      img
      reviewsCount
      userReviews
      rating
      weeklyRating
      createdOn
      updatedOn
    }
  }
`;
export const updateBobaShop = /* GraphQL */ `
  mutation UpdateBobaShop(
    $input: UpdateBobaShopInput!
    $condition: ModelbobaShopConditionInput
  ) {
    updateBobaShop(input: $input, condition: $condition) {
      address
      coordinates
      id
      secondaryId
      img
      reviewsCount
      userReviews
      rating
      weeklyRating
      createdOn
      updatedOn
    }
  }
`;
export const deleteBobaShop = /* GraphQL */ `
  mutation DeleteBobaShop(
    $input: DeleteBobaShopInput!
    $condition: ModelbobaShopConditionInput
  ) {
    deleteBobaShop(input: $input, condition: $condition) {
      address
      coordinates
      id
      secondaryId
      img
      reviewsCount
      userReviews
      rating
      weeklyRating
      createdOn
      updatedOn
    }
  }
`;
export const createMiscellaneous = /* GraphQL */ `
  mutation CreateMiscellaneous(
    $input: CreateMiscellaneousInput!
    $condition: ModelMiscellaneousConditionInput
  ) {
    createMiscellaneous(input: $input, condition: $condition) {
      id
      new_update
      new_version
      lock
      lock_message
      announcement
      createdOn
      updatedOn
    }
  }
`;
export const updateMiscellaneous = /* GraphQL */ `
  mutation UpdateMiscellaneous(
    $input: UpdateMiscellaneousInput!
    $condition: ModelMiscellaneousConditionInput
  ) {
    updateMiscellaneous(input: $input, condition: $condition) {
      id
      new_update
      new_version
      lock
      lock_message
      announcement
      createdOn
      updatedOn
    }
  }
`;
export const deleteMiscellaneous = /* GraphQL */ `
  mutation DeleteMiscellaneous(
    $input: DeleteMiscellaneousInput!
    $condition: ModelMiscellaneousConditionInput
  ) {
    deleteMiscellaneous(input: $input, condition: $condition) {
      id
      new_update
      new_version
      lock
      lock_message
      announcement
      createdOn
      updatedOn
    }
  }
`;
