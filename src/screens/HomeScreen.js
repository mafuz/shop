import { useContext, useEffect, useReducer, useState } from 'react';
import axios from 'axios';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Product from '../components/Product';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import {URL} from '../App';
//import { Store } from '../Store';
//import Tree from '../components/Tree';
//import ChatBox from '../components/ChatBox';
// import data from '../data';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, products: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function HomeScreen() {
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    products: [],
    loading: true,
    error: '',
  });

  //const { state, dispatch: ctxDispatch } = useContext(Store);
  //const { cart, userInfo, loginInfo } = state;
   //const [products, setProducts] = useState([]);

   //const url = "https://automation-app.onrender.com"
   // const url = http://localhost:4000

  useEffect(() => {
    const fetchData = async () => {
      // dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`http://localhost:4000/product`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
        //setProducts(result.data);
        const me = result.data;
        //console.log('hhhhhh' + me);
      } catch (err) {
        console.log(err);
        // dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }

      // setProducts(result.data);
    };
    fetchData();
  }, []);

  return (
    <div>
      {/* <pre>{JSON.stringify(products)}</pre>  */}
      <Helmet>
        <title>mafuz</title>
      </Helmet>
      <h1 className="font-bold">Featured Products</h1>
      <div className="products">
         {loading ? (
          // console.log("loading")
            <LoadingBox />
        ) : error ? (
          // console.log(error)
           <MessageBox variant="danger">{error}</MessageBox>
        ) : (
           <Row>
             {products?.map((product) => (
               <Col key={product.product_id} sm={6} md={4} lg={3} className="mb-3">
                 <Product product={product}></Product>
               </Col>
            ))}
           </Row>
          
        )} 
      </div>
      {/* <ChatBox /> */}
    </div>
  );
}
export default HomeScreen;
