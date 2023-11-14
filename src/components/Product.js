import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Rating from '../components/Rating';

import axios from 'axios';
import React, {
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react';
import { Store } from '../Store';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
//import MessageBox from '../components/MessageBox';
import { getError } from '../utils/utils';
import { LinkContainer } from 'react-router-bootstrap';
import { URL } from '../App';

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

function Product(props) {
  const { product } = props;
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);

  const { cart, userInfo, loginInfo } = state;

  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    products: [],

    loading: true,
    error: '',
  });

  const [rev, setReviews] = useState([]);
  const [instocks, setInstock] = useState('');
  const ins = instocks[0];
  const quantity = 0;

  //const url = "https://automation-app.onrender.com"
  // const url = http://localhost:4000

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`http://localhost:4000/review/` + product.product_id);
      setReviews(data);
    } catch (err) {
      toast.error(getError(error));
    }
  };
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`http://localhost:4000/products`);
      setInstock(data);
    } catch (err) {
      //console.log(err);
      toast.error(getError(error));
    }
  };
  useEffect(() => {
    fetchProducts();
  }, [product]);

  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find(
      (x) => x.product_id === product.product_id
    );
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get('url/product/' + product.product_id);
    // if (ins?.instock < quantity) {
    //   window.alert('Sorry. Product is out of stock');
    //   return;
    // }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity },
    });
    navigate('/cart');
  };
  // const myid = product.product_id;
  return (
    <Card>
     
      {/* <pre>{JSON.stringify()}</pre>
      <pre>{JSON.stringify(rev)}</pre> */}
      <Link
        to={`/product/${product.product_id}`}
        style={{ textDecoration: 'none' }}
      >
        <img src={product.image} className="card-img-top" alt={product.title} />
      </Link>
      <Card.Body>
        <Link
          to={`/product/${product.product_id}`}
          style={{ textDecoration: 'none' }}
        >
          <Card.Title className="title-text-truncate">
            {product.title}
          </Card.Title>
        </Link>
        {rev?.map((r) => (
          <Rating
            key={product.product_id}
            rating={r.rating}
            num_review={r.num_review}
          ></Rating>
        ))}
        {/* <Rating rating={product.rating} numReviews={product.num_reviews} /> */}
        <Card.Text className="desc-text-truncate">
          {product.description}
        </Card.Text>
        <Card.Text className="">Ghs{product.price}</Card.Text>
        {/* {ins?.instock === 0 || instocks === '' ? (
          <Button className="my-button" variant="light" disabled>
            Out of stock
          </Button>
        ) : ( */}
        <Button className="my-button" onClick={() => addToCartHandler(product)}>
          Add to cart
        </Button>
        {/* )} */}
      </Card.Body>
    </Card>
  );
}
export default Product;
