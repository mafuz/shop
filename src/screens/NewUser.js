import Axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import { useContext, useState } from 'react';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utils/utils';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import {URL} from '../App';
//import bcrypt from 'bcryptjs-react';
//import DatePicker from '../components/DatePicker';

export default function NewUser() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  const [username, setUsername] = useState('');
  //const [customerId, setCustomerId] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  // // const [approvalAuthority, setApprovalAuthority] = useState('');
  //  const [usertype, setUsertype] = useState('');
  const [roles, setRole] = useState('');
  //const [branchDescription, setBranchDescription] = useState('');
  const [active, setActive] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');


  //const password = bcrypt.hashSync(pass, 10);
  const { dispatch: ctxDispatch } = useContext(Store);
  //const { userInfo } = state;

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      const { data } = await Axios.post(`http://localhost:4000/authentication/register`, {
        username,
        //customerId,
        firstname,
        lastname,
        phone,
        email,
        // usertype,
        //branchDescription,
        active,
        roles,
        // approvalAuthority,
        password,
      });
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success('User created successful');
      navigate(redirect || '/');
    } catch (err) {
      toast.error(getError(err));
    }
  };

  //   useEffect(() => {
  //     if (userInfo) {
  //       navigate(redirect);
  //     }
  //   }, [navigate, redirect, userInfo]);

  return (
    <Container className="small-container">
      
      <Helmet>
        <title>Create User</title>
      </Helmet>
      <Row className="mt-5 ">
        <h1 as={Col} className="">
          Create User
        </h1>
      </Row>

      <Form onSubmit={submitHandler}>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group as={Col} controlId="customerId">
            <Form.Label>Customer Id</Form.Label>
            <Form.Control

            // required
            />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="firstname" className="mb-2">
            <Form.Label>Firsname</Form.Label>
            <Form.Control
              onChange={(e) => setFirstname(e.target.value)}
              required
            />
          </Form.Group>
          {/* <Form.Group className="mb-2" controlId="firstname">
          <Form.Label>Date</Form.Label>

          <DatePicker />
        </Form.Group> */}
          <Form.Group className="mb-2" as={Col} controlId="lastname">
            <Form.Label>Lastname</Form.Label>
            <Form.Control
              onChange={(e) => setLastname(e.target.value)}
              required
            />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group className="mb-2" as={Col} controlId="telephone">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="phone"
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-2" as={Col} controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
        </Row>
        {/* <Form.Group className="mb-2" controlId="usertype">
          <Form.Label>Role</Form.Label>
          <Form.Control
            as="select"
            onChange={(e) => setUsertype(e.target.value)}
            required
          >
            <option>User type</option>
            <option value="SU">Super User</option>
            <option value="MG">Managers</option>
            <option value="SP">Support</option>
            <option value="AD">Admin</option>
            <option value="TG">Test Group</option>
            <option value="ST">Staff</option>
          </Form.Control>
        </Form.Group> */}
        <Row className="mb-3">
          <Form.Group className="mb-2" as={Col} controlId="roles">
            <Form.Label>Role</Form.Label>
            <Form.Control
              as="select"
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option></option>
              <option value="admin">Admin</option>
              <option value="supper user">Super User</option>
              <option value="managers">Managers</option>
              <option value="support">Support</option>
              <option value="test group">Test Group</option>
              <option value="staff">Staff</option>
            </Form.Control>
          </Form.Group>

          {/* <Form.Group className="mb-2" as={Col} controlId="branchDescription">
            <Form.Label>Branch Desc</Form.Label>
            <Form.Control
              as="select"
              onChange={(e) => setBranchDescription(e.target.value)}
              required
            >
              <option></option>
              <option value="admin">Admin</option>
              <option value="supper user">Super User</option>
              <option value="managers">Managers</option>
              <option value="support">Support</option>
              <option value="test group">Test Group</option>
              <option value="staff">Staff</option>
            </Form.Control>
          </Form.Group> */}

          <Form.Group className="mb-2" as={Col} controlId="active">
            <Form.Label>Active</Form.Label>
            <Form.Control
              as="select"
              onChange={(e) => setActive(e.target.value)}
              required
            >
              <option></option>
              <option value="N">N</option>
              <option value="Y">Y</option>
            </Form.Control>
          </Form.Group>

          {/* <Form.Group className="mb-2" as={Col} controlId="active">
            <Form.Label>Active</Form.Label>
            <Form.Control
              as="select"
              onChange={(e) => setActive(e.target.value)}
              required
            >
              <option></option>
              <option value="N" select>
                N
              </option>
              <option value="Y">Y</option>
            </Form.Control>
          </Form.Group> */}
        </Row>
        {/* <Form.Group className="mb-3" controlId="role"> 
        <Form.Label>Role</Form.Label>
        <Form.Select className="mb-3" controlId="role">
          <option>Role</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
          <Form.Control onChange={(e) => setRole(e.target.value)} required />
        </Form.Select>
         </Form.Group> */}

        <Form.Group className="mb-2" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-2" controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>

        <div className="mb-2">
          <Button className="save" type="submit">
            Create user
          </Button>
        </div>
        <div className="mb-2">
          Already have account?{' '}
          <Link to={`/signin?redirect=${redirect}`}>Sign In</Link>
        </div>
      </Form>
    </Container>
  );
}
