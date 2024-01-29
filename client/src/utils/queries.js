import { gql } from '@apollo/client';

// structure for me query

export const GET_ME = gql`
query getMe {
  me {
    _id
    username
    email
    bookCount
    savedBooks {
      bookId
      authors
      description
      title
      image
      link
    }
  }
}`;