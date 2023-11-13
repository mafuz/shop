import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { Container } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { Controller, useForm } from 'react-hook-form';
import { useContext, useEffect, useReducer, useState } from 'react';
import { URL } from '../App';

function AddCustomerScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/customeradd';

  // const url = "https://automation-app.onrender.com"
  // const url = http://localhost:4000

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [location, setLocation] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(`http://localhost:4000/addCust`, {
        name,
        surname,
        phone,
        email,
        country,
        city,
        location,
      });

      navigate(redirect || '/customeradd');
    } catch (err) {
      // toast.error(getError(err));
    }
  };
  return (
    <>
      <Container className="small-container">
        <Helmet>
          <title>Create Customer</title>
        </Helmet>
        <Row className="mt-5 mb-3 w-auto">
          <h1 as={Col} className="">
            Create Customer
          </h1>
        </Row>
        <Form onSubmit={submitHandler}>
          <Row className="fles flex-row mb-3">
            <Col md={12}>
              <Row className="mb-3">
                <Form.Group as={Col} md="10">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} md="10">
                  <Form.Label>Surame</Form.Label>
                  <Form.Control
                    onChange={(e) => setSurname(e.target.value)}
                    required
                  />
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} md="5">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group as={Col} md="5">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} md="5">
                  <Form.Label>Country</Form.Label>
                  <Form.Control
                    onChange={(e) => setCountry(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group as={Col} md="5">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} md="10">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} md="5">
                  <div className="mt-3">
                    {/* <Button type="submit">Save</Button> */}
                    <Button className="save" type="submit">
                      Create Customer
                    </Button>
                  </div>
                </Form.Group>
                <Form.Group as={Col} md="5">
                  <div className="mt-3">
                    <Link to={`/customer`}>
                      <Button className="back" type="submit">
                        Back
                      </Button>
                    </Link>
                  </div>
                </Form.Group>
              </Row>
            </Col>
          </Row>
        </Form>
      </Container>
    </>
  );
}
export default AddCustomerScreen;
