const gql = String.raw;

module.exports = gql `
type User {
    _id: ID
    username: String
    email: String
    password: String
    savedBooks: [Book]
}

type Book {
    _id: ID
    authors: String
    description: String
    bookId: String
    image: String
    link: String
    title: String
}

type Query {
    me: User
}

type Mutation {
    createUser(): User
    saveBook();
    deleteBook();
}

`;