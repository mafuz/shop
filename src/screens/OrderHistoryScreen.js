import React, {
    useContext,
    useEffect,
    useReducer,
    useState,
    useRef,
  } from 'react';
  import { Helmet } from 'react-helmet-async';
  import axios from 'axios';
  import LoadingBox from '../components/LoadingBox';
  import MessageBox from '../components/MessageBox';
  import { Store } from '../Store';
  import { getError } from '../utils/utils';
  import { Link, useNavigate, useParams } from 'react-router-dom';
  import Button from 'react-bootstrap/esm/Button';
  import {URL} from '../App';
  
  
  import { toast } from 'react-toastify';

  
  const reducer = (state, action) => {
    switch (action.type) {
      case 'FETCH_REQUEST':
        return { ...state, loading: true };
      case 'FETCH_SUCCESS':
        return { ...state, orders: action.payload, loading: false };
      case 'FETCH_FAIL':
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export default function OrderHistoryScreen() {
    const { state } = useContext(Store);
    const { userInfo } = state;
    const navigate = useNavigate();
  
    const [{ loading, error, successDelete, orders }, dispatch] = useReducer(
      reducer,
      {
        loading: true,
        error: '',
      }
    );
  

   // const url = "https://automation-app.onrender.com"
    // const url = http://localhost:4000

    //const { SearchBar, ClearSearchButton } = Search;
    //const { ExportCSVButton } = CSVExport;
  
    const MyExportCSV = (props) => {
      const handleClick = () => {
        props.onExport();
      };
    }
  
    useEffect(() => {
      // if (!loginInfo) {
      //   router.push('/login');
      // }
      const fetchOrders = async () => {
        try {
          dispatch({ type: 'FETCH_REQUEST' });
          const { data } = await axios.get(
            `http://localhost:4000/orders/history`,
            {
              headers: { authorization: 'Bearer ' + userInfo.token },
            }
          );
          dispatch({ type: 'FETCH_SUCCESS', payload: data });
        } catch (err) {
          dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
        }
      };
      fetchOrders();
    }, []);
  
    const deleteHandler = async (chart) => {
      if (window.confirm('Are you sure to delete?')) {
        try {
          await axios.delete(
            `http://localhost:4000/category/delete?id=` + chart.id
          );
          toast.success('Trans Category deleted successfully');
          dispatch({ type: 'DELETE_SUCCESS' });
        } catch (err) {
          toast.error(getError(error));
          dispatch({
            type: 'DELETE_FAIL',
          });
        }
      }
    };
  
    const componentRef = useRef();
  
    return (
      <div>
        {/* <pre>{JSON.stringify(orders)}</pre> */}
        <Helmet>
          <title>Order History</title>
        </Helmet>
        {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.order_id}>
                <td>{order.order_id}</td>
                 <td>{order.paid_at}</td> 
                <td>{order.totalprice.toFixed(2)}</td>
                 <td>{order.ispaid ? order.paid_at : 'No'}</td> 
                 <td>
                  {order.isdelivered
                    ? order.delivered_at
                    : 'No'}
                </td> 
                <td>
                  <Button
                    type="button"
                    variant="light"
                    onClick={() => {
                      navigate(`/order/${order.order_id}`);
                    }}
                  >
                    Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody> 
        </table>
      )}
    </div>
  );
}
