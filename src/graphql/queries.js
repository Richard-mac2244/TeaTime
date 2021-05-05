/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getBobaUser = /* GraphQL */ `
  query GetBobaUser($id: ID!) {
    getBobaUser(id: $id) {
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
export const listBobaUsers = /* GraphQL */ `
  query ListBobaUsers(
    $filter: ModelbobaUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listBobaUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const getBobaReview = /* GraphQL */ `
  query GetBobaReview($id: ID!) {
    getBobaReview(id: $id) {
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
export const listBobaReviews = /* GraphQL */ `
  query ListBobaReviews(
    $filter: ModelbobaReviewFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listBobaReviews(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        bobaShopId
        bobaUserId
        rating
        Description
        createdOn
        updatedOn
      }
      nextToken
    }
  }
`;
export const getBobaShop = /* GraphQL */ `
  query GetBobaShop($id: ID!) {
    getBobaShop(id: $id) {
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
export const listBobaShops = /* GraphQL */ `
  query ListBobaShops(
    $filter: ModelbobaShopFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listBobaShops(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const getMiscellaneous = /* GraphQL */ `
  query GetMiscellaneous($id: ID!) {
    getMiscellaneous(id: $id) {
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
export const listMiscellaneouss = /* GraphQL */ `
  query ListMiscellaneouss(
    $filter: ModelMiscellaneousFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMiscellaneouss(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        new_update
        new_version
        lock
        lock_message
        announcement
        createdOn
        updatedOn
      }
      nextToken
    }
  }
`;
