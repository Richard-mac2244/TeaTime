/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateBobaUser = /* GraphQL */ `
  subscription OnCreateBobaUser {
    onCreateBobaUser {
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
export const onUpdateBobaUser = /* GraphQL */ `
  subscription OnUpdateBobaUser {
    onUpdateBobaUser {
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
export const onDeleteBobaUser = /* GraphQL */ `
  subscription OnDeleteBobaUser {
    onDeleteBobaUser {
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
export const onCreateBobaReview = /* GraphQL */ `
  subscription OnCreateBobaReview {
    onCreateBobaReview {
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
export const onUpdateBobaReview = /* GraphQL */ `
  subscription OnUpdateBobaReview {
    onUpdateBobaReview {
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
export const onDeleteBobaReview = /* GraphQL */ `
  subscription OnDeleteBobaReview {
    onDeleteBobaReview {
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
export const onCreateBobaShop = /* GraphQL */ `
  subscription OnCreateBobaShop {
    onCreateBobaShop {
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
export const onUpdateBobaShop = /* GraphQL */ `
  subscription OnUpdateBobaShop {
    onUpdateBobaShop {
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
export const onDeleteBobaShop = /* GraphQL */ `
  subscription OnDeleteBobaShop {
    onDeleteBobaShop {
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
export const onCreateMiscellaneous = /* GraphQL */ `
  subscription OnCreateMiscellaneous {
    onCreateMiscellaneous {
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
export const onUpdateMiscellaneous = /* GraphQL */ `
  subscription OnUpdateMiscellaneous {
    onUpdateMiscellaneous {
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
export const onDeleteMiscellaneous = /* GraphQL */ `
  subscription OnDeleteMiscellaneous {
    onDeleteMiscellaneous {
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
