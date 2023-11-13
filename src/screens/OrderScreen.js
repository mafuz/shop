import axios from 'axios';
import React, {
  useContext,
  useState,
  useEffect,
  useReducer,
  useRef,
} from 'react';
import { Document, Page } from 'react-pdf';
import { PaystackButton } from 'react-paystack';
import { Helmet } from 'react-helmet-async';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { getError } from '../utils/utils';
import { toast } from 'react-toastify';
import {URL} from '../App';
//import PdfDownload from '../components/PdfDownload';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'PAY_REQUEST':
      return { ...state, loadingPay: true };
    case 'PAY_SUCCESS':
      return { ...state, loadingPay: false, successPay: true };
    case 'PAY_FAIL':
      return { ...state, loadingPay: false };
    case 'PAY_RESET':
      return { ...state, loadingPay: false, successPay: false };

    case 'DELIVER_REQUEST':
      return { ...state, loadingDeliver: true };
    case 'DELIVER_SUCCESS':
      return { ...state, loadingDeliver: false, successDeliver: true };
    case 'DELIVER_FAIL':
      return { ...state, loadingDeliver: false };
    case 'DELIVER_RESET':
      return {
        ...state,
        loadingDeliver: false,
        successDeliver: false,
      };
    default:
      return state;
  }
}
export default function OrderScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const params = useParams();
  const { id: orderId } = params;
  const navigate = useNavigate();
  //Cannot destructure property 'numPages' of '_ref' as it is undefined.
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

 // const url = "https://automation-app.onrender.com"
  // const url = http://localhost:4000

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  // Cannot destructure property 'numPages' of '_ref' as it is undefined.

  const [
    {
      loading,
      error,
      //orders,
      order,
      successPay,
      loadingPay,
      loadingDeliver,
      successDeliver,
    },
    dispatch,
  ] = useReducer(reducer, {
    //orders: [],

    loading: true,
    error: '',
    order: [],
    error: '',
    successPay: false,
    loadingPay: false,
  });

  // const reportTemplateRef = useRef(null);

  // const handleGeneratePdf = () => {
  // 	const doc = new jsPDF({
  // 		format: 'Landscpe',
  // 		unit: 'px',
  // 	});

  // 	// Adding the fonts.
  // 	doc.setFont('Inter-Regular', 'normal');

  // 	doc.html(reportTemplateRef.current, {
  // 		async callback(doc) {
  // 			await doc.save('document');
  // 		},
  // 	});
  // };

  //   const [
  //     {
  //       loading,
  //       error,
  //       order,
  //       successPay,
  //       loadingPay,
  //       loadingDeliver,
  //       successDeliver,
  //     },
  //     dispatch,
  //   ] = useReducer(reducer, {
  //     loading: true,
  //     order: {},
  //     error: '',
  //     successPay: false,
  //     loadingPay: false,
  //   });
  // const myorder = order[0];
  const {
    shippingaddress,
    paymentmethod,
    orderitems,
    itemsprice,
    taxprice,
    shippingprice,
    totalprice,
    paid,
    paidAt,
    delivered,
    deliveredAt,
  } = order;

  const publicKey = 'pk_test_aec7faae4cacd6913e77044af417de8b82e2eb9c';
  //process.env.PAYSTACK_CLIENT_ID;
  const email = userInfo.email;
  const amount = totalprice * 100;
  const currency = 'GHS';
  const name = userInfo.name;
  const phone = '0501399430';

  const componentProps = {
    email,
    amount,
    currency,
    metadata: {
      name,
      phone,
    },
    publicKey,
    text: 'YOU MAY PAY NOW!!',

    onSuccess: () => onApprove(), //= { onApprove },
    //alert('Thanks for doing business with us! Come back soon!!'),
    onClose: () => alert("Wait! Don't leave :("),
  };

  async function onApprove(data, actions) {
    try {
      dispatch({ type: 'PAY_REQUEST' });
      const { data } = await axios.put(
        `http://localhost:4000/orders/payment/` + orderId,

        {},
        {
          headers: {
            //'Content-Type': 'application/json',
            authorization: 'Bearer ' + userInfo.token,
          },
        }
      );
      dispatch({ type: 'PAY_SUCCESS', payload: data });
      toast.success('Order is paid');
      <Document onLoadSuccess={onDocumentLoadSuccess}></Document>;
      // <Page height="600" pageNumber={pageNumber} ></Page>
    } catch (err) {
      toast.error(getError(err));
    }
  }
  //   function onError(err) {
  //     toast.error(getError(err));
  //   }

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: order.totalPrice },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        // setState({ ...state, loading: true });
        dispatch({ type: 'FETCH_REQUEST' });
        fetch(`http://localhost:4000/order/` + orderId, {
          method: 'GET',
          //headers: new Headers({
          headers: { authorization: 'Bearer ' + userInfo.token },
          //}),
        })
          .then(function (res) {
            return res.json();
          })

          .then(function (data) {
            dispatch({ type: 'FETCH_SUCCESS', payload: data });
            // console.log(data);
          });

        //setState({ ...state, loading: false });
        //dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        //setState({ ...state, loading: false });
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    if (!userInfo) {
      return Navigate('/SIGNIN');
    }

    if (
      !order.id ||
      successPay ||
      successDeliver ||
      (order.id && order.id !== orderId)
    ) {
      fetchOrder();
      if (successPay) {
        dispatch({ type: 'PAY_RESET' });
      }
      if (successDeliver) {
        dispatch({ type: 'DELIVER_RESET' });
      }
    }
  }, [successPay, successDeliver]);

  //const datetime = () => {
    const showdate = new Date();
    const date = showdate.getDate() + '-' + showdate.getMonth() + '-' + showdate.getFullYear();
    
 // };

  async function deliverOrderHandler() {
    try {
      dispatch({ type: 'DELIVER_REQUEST' });
      const { data } = await axios.put(
        `http://localhost:4000/orders/update/` + orderId,
        {
          order_id: orderId,
          ispaid: 'true',
          isdelivered: 'true',
          paid_at: date,
          delivered_at: date,
          users: userInfo.id,
        },
        {
          headers: {
            authorization: 'Bearer ' + userInfo.token,
          },
        }
      );
      dispatch({ type: 'DELIVER_SUCCESS', payload: data });
      toast.success('Order is delivered');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'DELIVER_FAIL' });
    }
  }

  return (
    <div>
      <Helmet>
        <title>Order {orderId}</title>
      </Helmet>

      <h1 className="my-3">Order {orderId}</h1>
      {order?.map((orders) => (
        <Row>
          {/*<pre>{JSON.stringify(order)}</pre>
          <pre>{JSON.stringify(userInfo.token)ref={reportTemplateRef}}</pre> */}
          {/* <pre>{JSON.stringify(order)}</pre> */}
          <Col md={8}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Shipping</Card.Title>

                <Card.Text>
                  <strong>Name:</strong> {orders.shippingaddress.fullName}{' '}
                  <br />
                  <strong>Phone Number:</strong> {orders.shippingaddress.phone}{' '}
                  <br />
                  <strong>Address: </strong> {orders.shippingaddress.address},
                  {orders.shippingaddress.city},{' '}
                  {orders.shippingaddress.postalCode},
                  {orders.shippingaddress.country}
                  {/* &nbsp;
                {order.shippingAddress.location &&
                  order.shippingAddress.location.lat && (
                    <a
                      target="_new"
                      href={`https://maps.google.com?q=${order.shippingAddress.location.lat},${order.shippingAddress.location.lng}`}
                    >
                      Show On Map
                    </a>
                  )} */}
                </Card.Text>

                {orders.isdelivered === 'true' ? (
                  <MessageBox variant="success">
                    Delivered at {orders.delivered_at}
                  </MessageBox>
                ) : (
                  <MessageBox variant="danger">Not Delivered</MessageBox>
                )}
              </Card.Body>
            </Card>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Payment</Card.Title>
                <Card.Text>
                  <strong>Method:</strong> {orders.paymentmethod}
                </Card.Text>
                {orders.ispaid === 'true'? (
                  <MessageBox variant="success">
                    Paid at {orders.paid_at}
                  </MessageBox>
                ) : (
                  <MessageBox variant="danger">Not Paid</MessageBox>
                )}
              </Card.Body>
            </Card>

            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Items</Card.Title>
                <ListGroup variant="flush">
                  {orders.orderitems?.map((item) => (
                    <ListGroup.Item key={item.id}>
                      <Row className="align-items-center">
                        <Col md={2}>
                          <img
                            src={item.image}
                            alt={item.title}
                            className="img-fluid rounded img-thumbnail"
                          ></img>{' '}
                        </Col>
                        <Col md={4}>
                          <Link
                            className="title-text-truncate"
                            to={`/product/${item.product_id}`}
                            style={{ textDecoration: 'none' }}
                          
                          >
                            {item.title}
                          </Link>
                        </Col>
                        <Col md={3}>
                          <span>{item.quantity}</span>
                        </Col>
                        <Col md={3}>Ghs{item.price}</Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Order Summary</Card.Title>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Items</Col>
                      <Col>GHS {orders.itemsprice.toFixed(2)}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Shipping</Col>
                      <Col>GHS {orders.shippingprice.toFixed(2)}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Tax</Col>
                      <Col>GHS {orders.taxprice.toFixed(2)}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>
                        <strong> Order Total</strong>
                      </Col>
                      <Col>
                        <strong>GHS {orders.totalprice.toFixed(2)}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                </ListGroup>
                <ListGroup>
                  {!orders.paid && orders.paymentmethod === 'ElectronicPay' && (
                    <ListGroup.Item>
                      {/* <div className="flex flex-grow  h-10 bg-blue-600 rounded-xl">
                      <Button className="w-25"></Button> */}

                      <PaystackButton
                        {...componentProps}
                        className="my-button"
                      />
                      {/* <Button className=""></Button> */}
                      {/* </div> */}
                    </ListGroup.Item>
                  )}
                  {userInfo.username === 'mafuz' &&
                    orders.isdelivered === 'false' && (
                      <ListGroup.Item>
                        {loadingDeliver && <LoadingBox></LoadingBox>}
                        <Button
                          className="my-button"
                          onClick={deliverOrderHandler}
                        >
                          Deliver Order
                        </Button>
                      </ListGroup.Item>
                   )
                    }
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ))}
    </div>
  );
}

// import axios from 'axios';
// import React, { useContext, useEffect, useReducer } from 'react';
// import { Helmet } from 'react-helmet-async';
// import { useNavigate, useParams } from 'react-router-dom';
// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';
// import Button from 'react-bootstrap/Button';
// import ListGroup from 'react-bootstrap/ListGroup';
// import Card from 'react-bootstrap/Card';
// import { Link } from 'react-router-dom';
// import LoadingBox from '../components/LoadingBox';
// import MessageBox from '../components/MessageBox';
// import { Store } from '../Store';
// import { getError } from '../utils/utils';
// import { toast } from 'react-toastify';

// function reducer(state, action) {
//   switch (action.type) {
//     case 'FETCH_REQUEST':
//       return { ...state, loading: true, error: '' };
//     case 'FETCH_SUCCESS':
//       return { ...state, loading: false, order: action.payload, error: '' };
//     case 'FETCH_FAIL':
//       return { ...state, loading: false, error: action.payload };
//     case 'PAY_REQUEST':
//       return { ...state, loadingPay: true };
//     case 'PAY_SUCCESS':
//       return { ...state, loadingPay: false, successPay: true };
//     case 'PAY_FAIL':
//       return { ...state, loadingPay: false };
//     case 'PAY_RESET':
//       return { ...state, loadingPay: false, successPay: false };

//     case 'DELIVER_REQUEST':
//       return { ...state, loadingDeliver: true };
//     case 'DELIVER_SUCCESS':
//       return { ...state, loadingDeliver: false, successDeliver: true };
//     case 'DELIVER_FAIL':
//       return { ...state, loadingDeliver: false };
//     case 'DELIVER_RESET':
//       return {
//         ...state,
//         loadingDeliver: false,
//         successDeliver: false,
//       };
//     default:
//       return state;
//   }
// }
// export default function OrderScreen() {
//   const { state } = useContext(Store);
//   const { userInfo } = state;

//   const params = useParams();
//   const { id: orderId } = params;
//   const navigate = useNavigate();

//   const [
//     {
//       loading,
//       error,
//       order,
//       successPay,
//       loadingPay,
//       loadingDeliver,
//       successDeliver,
//     },
//     dispatch,
//   ] = useReducer(reducer, {
//     loading: true,
//     order: {},
//     error: '',
//     successPay: false,
//     loadingPay: false,
//   });

//     function createOrder(data, actions) {
//       return actions.order
//         .create({
//           purchase_units: [
//             {
//               amount: { value: order.totalPrice },
//             },
//           ],
//         })
//         .then((orderID) => {
//           return orderID;
//         });
//     }

//     function onApprove(data, actions) {
//       return actions.order.capture().then(async function (details) {
//         try {
//           dispatch({ type: 'PAY_REQUEST' });
//           const { data } = await axios.put(
//             `/api/orders/${order._id}/pay`,
//             details,
//             {
//               headers: { authorization: `Bearer ${userInfo.token}` },
//             }
//           );
//           dispatch({ type: 'PAY_SUCCESS', payload: data });
//           toast.success('Order is paid');
//         } catch (err) {
//           dispatch({ type: 'PAY_FAIL', payload: getError(err) });
//           toast.error(getError(err));
//         }
//       });
//     }
//     function onError(err) {
//       toast.error(getError(err));
//     }

//     useEffect(() => {
//       const fetchOrder = async () => {
//         try {
//           dispatch({ type: 'FETCH_REQUEST' });
//           const { data } = await axios.get(`http://localhost:4000/order/${orderId}`, {
//             headers: { authorization: `Bearer ${userInfo.token}` },
//           });
//           dispatch({ type: 'FETCH_SUCCESS', payload: data });
//         } catch (err) {
//           dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
//         }
//       };

//       if (!userInfo) {
//         return navigate('/login');
//       }
//       if (
//         !order._id ||
//         successPay ||
//         successDeliver ||
//         (order._id && order._id !== orderId)
//       ) {
//         fetchOrder();
//         if (successPay) {
//           dispatch({ type: 'PAY_RESET' });
//         }
//         if (successDeliver) {
//           dispatch({ type: 'DELIVER_RESET' });
//         }
//       }

//     }, [
//       order,
//       userInfo,
//       orderId,
//       navigate,
//      // paypalDispatch,
//       successPay,
//       successDeliver,
//     ]);

//   async function deliverOrderHandler() {
//     try {
//       dispatch({ type: 'DELIVER_REQUEST' });
//       const { data } = await axios.put(
//         `/api/orders/${order._id}/deliver`,
//         {},
//         {
//           headers: { authorization: `Bearer ${userInfo.token}` },
//         }
//       );
//       dispatch({ type: 'DELIVER_SUCCESS', payload: data });
//       toast.success('Order is delivered');
//     } catch (err) {
//       toast.error(getError(err));
//       dispatch({ type: 'DELIVER_FAIL' });
//     }
//   }
//   const myorder = order[0];

//   return (
//     <div>
//         <pre>{JSON.stringify(myorder)}</pre>
//       <Helmet>
//         <title>Order {orderId}</title>
//       </Helmet>
//       <h1 className="my-3">Order {orderId}</h1>
//       <Row>
//          <Col md={8}>
//           <Card className="mb-3">
//             <Card.Body>
//               <Card.Title>Shipping</Card.Title>
//               <Card.Text>
//               <strong>Name:</strong> {myorder && myorder.shippingaddress && myorder.shippingaddress.fullName? myorder.shippingaddress.fullName : ""} <br />
//                   <strong>Address: </strong> {myorder && myorder.shippingaddress && myorder.shippingaddress.address? myorder.shippingaddress.address : ""},
//                      {myorder && myorder.shippingaddress && myorder.shippingaddress.city? myorder.shippingaddress.city : ""} , {myorder && myorder.shippingaddress && myorder.shippingaddress.postalCode? myorder.shippingaddress.postalCode : ""},
//                      {myorder && myorder.shippingaddress && myorder.shippingaddress.country? myorder.shippingaddress.country : ""}
//                 &nbsp;
//                  {/* {myorder.shippingaddress.location &&
//                   myorder.shippingaddress.location.lat && (
//                     <a
//                       target="_new"
//                       href={`https://maps.google.com?q=${myorder.shippingaddress.location.lat},${myorder.shippingaddress.location.lng}`}
//                     >
//                       Show On Map
//                     </a>
//                   )}  */}
//               </Card.Text>
//               {order.isDelivered ? (
//                 <MessageBox variant="success">
//                   Delivered at {order.deliveredAt}
//                 </MessageBox>
//               ) : (
//                 <MessageBox variant="danger">Not Delivered</MessageBox>
//               )}
//             </Card.Body>
//           </Card>
//           <Card className="mb-3">
//             <Card.Body>
//               <Card.Title>Payment</Card.Title>
//               <Card.Text>
//                 <strong>Method:</strong> {order.paymentMethod}
//               </Card.Text>
//               {order.isPaid ? (
//                 <MessageBox variant="success">
//                   Paid at {order.paidAt}
//                 </MessageBox>
//               ) : (
//                 <MessageBox variant="danger">Not Paid</MessageBox>
//               )}
//             </Card.Body>
//           </Card>

//           <Card className="mb-3">
//             <Card.Body>
//               <Card.Title>Items</Card.Title>
//               <ListGroup variant="flush">
//                   {myorder?.orderitems.map((item) => (
//                   <ListGroup.Item key={item.order_id}>
//                     <Row className="align-items-center">
//                       <Col md={6}>
//                         <img
//                           src={item.image}
//                           alt={item.title}
//                           className="img-fluid rounded img-thumbnail"
//                         ></img>{' '}
//                         <Link to={`/product/${item.product_id}`}>{item.title}</Link>
//                       </Col>
//                       <Col md={3}>
//                         <span>{item.quantity}</span>
//                       </Col>
//                       <Col md={3}>${item.price}</Col>
//                     </Row>
//                   </ListGroup.Item>
//                 ))}
//               </ListGroup>
//             </Card.Body>
//           </Card>
//         </Col>
//          <Col md={4}>
//           <Card className="mb-3">
//             <Card.Body>
//               <Card.Title>Order Summary</Card.Title>
//               <ListGroup variant="flush">
//                 <ListGroup.Item>
//                   <Row>
//                     <Col>Items</Col>
//                       <Col>GHS{myorder && myorder.itemsprice.toFixed(2)? myorder.itemsprice.toFixed(2):"" && myorder.itemsprice.toFixed(2)}</Col>
//                   </Row>
//                 </ListGroup.Item>
//                 <ListGroup.Item>
//                   <Row>
//                     <Col>Shipping</Col>
//                     <Col>GHS{myorder && myorder.shippingprice.toFixed(2)? myorder.shippingprice.toFixed(2):"" && myorder.shippingprice.toFixed(2)}</Col>
//                   </Row>
//                 </ListGroup.Item>
//                 <ListGroup.Item>
//                   <Row>
//                     <Col>Tax</Col>
//                       <Col>GHS{myorder && myorder.taxprice.toFixed(2)? myorder.taxprice.toFixed(2):"" && myorder.taxprice.toFixed(2)}</Col>
//                   </Row>
//                 </ListGroup.Item>
//                 <ListGroup.Item>
//                   <Row>
//                     <Col>

//                       <strong> Order Total</strong>
//                     </Col>
//                     <Col>
//                        { <strong>GHS{order.totalPrice}</strong> }
//                     </Col>
//                   </Row>
//                 </ListGroup.Item>
//                 {!order.isPaid && (
//                   <ListGroup.Item>
//                     {/* {isPending ? (
//                       <LoadingBox />
//                     ) : (
//                       <div>
//                         <PayPalButtons
//                           createOrder={createOrder}
//                           onApprove={onApprove}
//                           onError={onError}
//                         ></PayPalButtons>
//                       </div>
//                     )} */}
//                      {loadingPay && <LoadingBox></LoadingBox>}
//                   </ListGroup.Item>
//                 )}
//                 {userInfo.isAdmin && order.isPaid && !order.isDelivered && (
//                   <ListGroup.Item>
//                     {loadingDeliver && <LoadingBox></LoadingBox>}
//                     <div className="d-grid">
//                       <Button type="button" onClick={deliverOrderHandler}>
//                         Deliver Order
//                       </Button>
//                     </div>
//                   </ListGroup.Item>
//                 )}
//               </ListGroup>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </div>
//   );
// }
