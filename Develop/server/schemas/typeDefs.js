const gql = String.raw;

module.exports = gql`
type User {
    _id: ID
    username: String
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

type Mutation {
    login(email: String!, password: String!): Auth
    # if problematic, make addUser
    createUser(username: String!, email: String!, password: String!): Auth
    saveBook(authors: [String], description: String, title: String, bookId: String, image: String, link: String):
    deleteBook(bookId: ID): User
}

`;