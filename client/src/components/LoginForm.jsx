// see SignupForm.js for comments
import { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
// import useMutation hook so we can literally use the mutation we wrote later
import { useMutation } from '@apollo/client';
// import LOGIN mutation
import { LOGIN } from '../utils/mutations';

// import the AuthService function
import Auth from '../utils/auth';

const LoginForm = () => {
  // setting initial state of userFormData to be these blank fields...
  const [userFormData, setUserFormData] = useState({ email: '', password: '' });
  const [validated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  // registering the login mutation
  const [login, { error }] = useMutation(LOGIN);

  // if there's an error, state is true, thus will show alert; if false, it won't show alert. Effect will change based on error.
  useEffect(() => {
    if (error) {
      setShowAlert(true)
    } else {
      setShowAlert(false)
    }
  }, [error]);

  // handle when value of input changes. When it does, we change the values to userFormData to email, password, plus name property
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  // preventing default action of submit button
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // check if form has everything (as per react-bootstrap docs)
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      // awaiting retrieval of response from login mutation (ie: if this were sandbox, we would be setting variables to the properties set for this mutation and await the response of the entry of those variables)
      const { data } = await login({
        variables: {
          ...userFormData
          // email: userFormData.email, password: userFormData.password
        }
      })
      console.log(data);
      // setting login token to local storage (first login here is a method of Auth)
      Auth.login(data.login.token);
    } catch (err) {
      console.error(err);
    }
    // if error, set values of formData back to empty
    setUserFormData({
      email: '',
      password: '',
    });
  };

  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
          Something went wrong with your login credentials!
        </Alert>
        <Form.Group className='mb-3'>
          <Form.Label htmlFor='email'>Email</Form.Label>
          <Form.Control
            type='text'
            placeholder='Your email'
            name='email'
            onChange={handleInputChange}
            value={userFormData.email}
            required
          />
          <Form.Control.Feedback type='invalid'>Email is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label htmlFor='password'>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Your password'
            name='password'
            onChange={handleInputChange}
            value={userFormData.password}
            required
          />
          <Form.Control.Feedback type='invalid'>Password is required!</Form.Control.Feedback>
        </Form.Group>
        <Button
          disabled={!(userFormData.email && userFormData.password)}
          type='submit'
          variant='success'>
          Submit
        </Button>
      </Form>
    </>
  );
};

export default LoginForm;
