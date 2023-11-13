import axios from 'axios';
import React, {
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Rating from '../components/Rating';
import Product from '../components/Product';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError } from '../utils/utils';
import { Store } from '../Store';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { toast } from 'react-toastify';
import {URL} from '../App';

const reducer = (state, action) => {
  switch (action.type) {
    case 'REFRESH_PRODUCT':
      return { ...state, product: action.payload };
    case 'CREATE_REQUEST':
      return { ...state, loadingCreateReview: true };
    case 'CREATE_SUCCESS':
      return { ...state, loadingCreateReview: false };
    case 'CREATE_FAIL':
      return { ...state, loadingCreateReview: false };
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false };

    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function ProductScreen() {
  let reviewsRef = useRef();
  // const { product } = props;
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : ``;

  const [rev, setReviews] = useState([]);
  //const [product, setProduct] = useState([]);
  const [rating, setRating] = useState(0);
  const [comments, setComment] = useState('');
  const [selectedImage, setSelectedImage] = useState('');

  //   const [instocks, setInstock] = useState({});

  //   const ins = instocks[0];

  // const navigate = useNavigate();
  const params = useParams();
  const { id } = params;

  const [{ loading, error, product, loadingCreateReview }, dispatch] =
    useReducer(reducer, {
      product: [],

      loading: true,
      error: '',
    });
    //const url = "https://automation-app.onrender.com"
    //http://localhost:4000

  //   const fetchReviews = async () => {
  //     try {
  //       const { data } = await axios.get('http://localhost:4000/review/' + id);
  //       setReviews(data);
  //     } catch (err) {
  //       toast.error(getError(error));
  //     }
  //   };
  //   useEffect(() => {
  //     fetchReviews();
  //   }, []);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`http://localhost:4000/product/` + id);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
        // console.log(result.data);
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }

      //setProducts(result.data);
    };
    fetchData();
  }, []);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo, loginInfo } = state;
  
  //---taken out array count ----
  const prod = product[0];

  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find(
      (x) => x.product_id === prod.product_id
    );
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(
      `http://localhost:4000/product/` + prod.product_id
    );
    // if (ins?.instock < quantity) {
    //   window.alert('Sorry. Product is out of stock');
    //   return;
    // }

    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...prod, quantity },
    });
    navigate('/cart');
  };

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      {/* <pre>{JSON.stringify(prod)}</pre> */}
      {/* <pre>{JSON.stringify(id)}</pre> */}
      <div>
        <Row>
          <Col md={6}>
            {product?.map((prod) => (
              <img
                key={prod.product_id}
                className="img-large"
                src={selectedImage || prod.image}
                alt={prod.title}
              ></img>
            ))}
          </Col>
          <Col md={3}>
            {product?.map((prod) => (
              <ListGroup key={prod.product_id} variant="flush">
                <ListGroup.Item>
                  <Helmet>
                    <title>{prod.title}</title>
                  </Helmet>
                  <h1>{prod.title}</h1>
                </ListGroup.Item>

                <ListGroup.Item>
                  {rev?.map((r) => (
                    <Rating
                      key={r.id}
                      rating={r.rating}
                      num_review={r.num_review}
                    ></Rating>
                  ))}
                </ListGroup.Item>

                <ListGroup.Item>Price : Ghs {prod.price}</ListGroup.Item>
                <ListGroup.Item>
                  <Row xs={1} md={2} className="g-2">
                    {[
                      prod.image,
                      ...Object.values(prod.images).filter((n) => n),
                    ].map((x) => (
                      <Col key={x}>
                        <Card>
                          <Button
                            className="thumbnail"
                            type="button"
                            variant="light"
                            onClick={() => setSelectedImage(x)}
                          >
                            <Card.Img variant="top" src={x} alt="product" />
                          </Button>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  Description:
                  <p>{prod.description}</p>
                </ListGroup.Item>
              </ListGroup>
            ))}
          </Col>
          <Col md={3}>
            {product?.map((prod) => (
              <Card>
                <Card.Body>
                  <ListGroup key={prod.product_id} variant="flush">
                    <ListGroup.Item>
                      <Row>
                        <Col>Price:</Col>
                        <Col>Ghs {prod.price}</Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col>Status:</Col>
                        <Col>
                          {prod?.countinstock > 0 ? (
                            <Badge bg="success">In Stock</Badge>
                          ) : (
                            <Badge bg="danger">Unavailable</Badge>
                          )}
                        </Col>
                      </Row>
                    </ListGroup.Item>

                    {/* {product.countinstock > 0 && (  */}
                    <ListGroup.Item>
                      <div className="d-grid">
                        <Button onClick={addToCartHandler} variant="primary">
                          Add to Cart
                        </Button>
                      </div>
                    </ListGroup.Item>
                    {/* )}  */}
                  </ListGroup>
                </Card.Body>
              </Card>
            ))}
          </Col>
        </Row>
        <h2 ref={reviewsRef}>Reviews</h2>

        {/* {rev?.map((r) => (
          <div key={product.id} className="mb-3">
            {r?.nunReview === 0 && <MessageBox>There is no review</MessageBox>}
          </div>
        ))} */}

        {rev?.map((r) => (
          <div className="my-3" key={r.id}>
            <ListGroup>
              <ListGroup.Item>
                <strong>{r?.name}</strong>
                <Rating rating={r.rating} caption=" "></Rating>
                <p>{r.created_at.substring(0, 10)}</p>
                <p>{r.comments}</p>
              </ListGroup.Item>
            </ListGroup>
          </div>
        ))}
      </div>

      <div className="my-3">
        {/* {userInfo ? ( onSubmit={submitHandler} */}
        <form>
          <h2>Write a customer review</h2>
          <Form.Group className="mb-3" controlId="rating">
            <Form.Label>Rating</Form.Label>
            <Form.Select
              aria-label="Rating"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            >
              <option value="">Select...</option>
              <option value="1">1- Poor</option>
              <option value="2">2- Fair</option>
              <option value="3">3- Good</option>
              <option value="4">4- Very good</option>
              <option value="5">5- Excelent</option>
            </Form.Select>
          </Form.Group>
          <FloatingLabel
            controlId="floatingTextarea"
            label="Comments"
            className="mb-3"
          >
            <Form.Control
              as="textarea"
              placeholder="Leave a comment here"
              value={comments}
              onChange={(e) => setComment(e.target.value)}
            />
          </FloatingLabel>

          <div className="mb-3">
            <Button disabled={loadingCreateReview} type="submit">
              Submit
            </Button>
            {loadingCreateReview && <LoadingBox></LoadingBox>}
          </div>
        </form>
        {/* ) : (
        <MessageBox>
          Please{' '}
          <Link to={`/signin?redirect=/product/${product.id}`}>Sign In</Link> to
          write a review
        </MessageBox>
        ) }  */}
      </div>
    </div>
  );
}
export default ProductScreen;
