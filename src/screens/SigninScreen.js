import Axios from 'axios';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import { useContext, useEffect, useState } from 'react';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utils/utils';
import Col from 'react-bootstrap/Col';
import {URL} from '../App';
import Row from 'react-bootstrap/Row';

export default function SigninScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  //const url = 'https://automation-app.onrender.com';
  //http://localhost:4000

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await Axios.post(`http://localhost:4000/authentication/login`, {
        username,
        password,
      });

      // console.log(data);
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });

      //ctxDispatch({ type: 'MY_LOGIN', payload: data.jwtToken });

      localStorage.setItem('userInfo', JSON.stringify(data));
      // localStorage.setItem('loginInfo', JSON.stringify(data.jwtToken));
      navigate(redirect || '/');
      // helps refresh
      window.location.href = redirect || '/';
    } catch (err) {
      toast.error(getError(err));
      //toast.error('Invalid username or password');
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <Container className="body">
      
      <div className="box mt-1">
         
        <Helmet>
          <title>Sign In</title>
        </Helmet>

        <Form onSubmit={submitHandler} autoComplete="off" className="for">
          <Row className="head mb-2">
            <h1 as={Col} className="">
              Sign In
            </h1>
          </Row>

          <Form.Group className=" mb-1 inputBox" controlId="username">
            <Form.Label className="form-label text-white">Username</Form.Label>
            <Form.Control
              className="inputlog"
              required
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-5 inputBox" controlId="password">
            <Form.Label className="form-label text-white">Password</Form.Label>
            <Form.Control
              className="inputlog"
              type="password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <div className="mb-3 form-group">
            <Button className="savelogin text-bold" type="submit">
              Sign In
            </Button>
          </div>
          <div className="mb-3 links text-white form-label">
            Forget password?{' '}
            <Link to={`/forgotpassword`} style={{ color: '#45f3ff' }}>
              Reset password
            </Link>
          </div>
          <div className="mb-3 links text-white form-label">
            New User?{' '}
            <Link to={'/newuser'} style={{ color: '#45f3ff' }}>
              Create your account
            </Link>
          </div>
        </Form>
        {/* </Container> */}
      </div>
    </Container>
  );
}
