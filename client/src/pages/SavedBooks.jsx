import { useState, useEffect } from 'react';
import {
  Container,
  Card,
  Button,
  Row,
  Col
} from 'react-bootstrap';

// so we can use query and mutation
import { useQuery, useMutation } from '@apollo/client';

// actual query and mutation
import { GET_ME } from '../utils/queries';
import { DELETE_BOOK } from '../utils/mutations';

// fetch requests; they pass token when they need to to get info from the users/me db
// delete book via bookId (in params), but i dont think we need params, because our api endpoint is just one: graphql
import { getMe, deleteBook } from '../utils/API';
// auth is a class with methods in it:
// getProfile decodes a token within the class of AuthService
// loggedIn checks if token is still in expiration range; if not expired yet, then return the token
// isTokenExpired checks to see if token expired
// getToken gets token from localStroage, login sets token and redirects to root path, logout removes token from localStorage and redirects to root path.
import Auth from '../utils/auth';
// get bookId from localstroage, filter out list to remove specific bookId, then set the updated list back in.
import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {
  const [userData, setUserData] = useState({});
  const { loading, data } = useQuery(GET_ME);
  const [deleteBook, { error }] = useMutation(DELETE_BOOK);

  const getUserData = async () => {
    try {
      // checking if user is logged in, if so we get tokenId from local storage
      const token = Auth.loggedIn() ? Auth.getToken() : null;

      if (!token) {
        return false;
      }

      if (!loading) {
        const user = data?.me || {};
        setUserData(user);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getUserData();
  }, [data]);

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const { data } = await deleteBook({
        variables: { bookId }
      })

      // upon success, remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  // used optional chaining bc savedBooks is coming back as undefined; opt chaining allows us to move forward while that data is still being fetched
  return (
    <>
      <Container fluid className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Container>
      <Container>
        <h2 className='pt-5'>
          {userData?.savedBooks?.length
            ? `Viewing ${userData?.savedBooks?.length} saved ${userData?.savedBooks?.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData?.savedBooks?.map((book) => {
            return (
              <Col key={book.bookId} md="4">
                <Card key={book.bookId} border='dark'>
                  {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
