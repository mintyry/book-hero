const gql = String.raw;
// define the following types

module.exports = gql`
type User {
    _id: ID!
    username: String!
    email: String
    bookCount: Int
    savedBooks: [Book]
}

type Book {
    bookId: String
    authors: [String]
    description: String
    title: String
    image: String
    link: String
}

type Auth {
    token: ID!
    user: User
}

type Query {
    me: User
}

# bundles all fields together so i dont have to enter each one every time
input SaveBookInput {
    authors: [String]
    description: String
    title: String
    bookId: String
    image: String
    link: String
}

type Mutation {
    # returning data to the classes, whicg follow colon. (eg: createUser takes those arguments, pass them into a variable called user, since Auth expects a token and user)
    login(email: String!, password: String!): Auth
    createUser(username: String!, email: String!, password: String!): Auth
    saveBook(input: SaveBookInput!): User
    deleteBook(bookId: ID): User
}

`;