import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Store } from '../Store';
import { getError } from '../utils/utils';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import Col from 'react-bootstrap/Col';
//import Dropzone from 'react-dropzone';
import Row from 'react-bootstrap/Row';
import {URL} from '../App';

const reducer = (state, action) => {
  switch (action.type) {
    case 'PRODUCT_SUCCESS':
      return { ...state, loading: true };
    case 'CREATE_SUCCESS':
      return { ...state, loading: false };
    case 'CREATE_FAIL':
      return { ...state, loading: false, error: action.payload };

    case 'UPLOAD_REQUEST':
      return {
        ...state,
        selectedFile: null,
        loadingUpload: true,
        errorUpload: '',
      };
    case 'UPLOAD_SUCCESS':
      return {
        ...state,
        selectedFile: null,
        loadingUpload: false,
        errorUpload: '',
      };
    case 'UPLOAD_FAIL':
      return { ...state, loadingUpload: false, errorUpload: action.payload };
    default:
      return state;
  }
};

function ProductCreateScreen() {
  const params = useParams(); // /product/:id
  const { id: productId } = params;
  const navigate = useNavigate();
  const obj = {};
  // const { state1 } = useContext(Store);
  // const { userInfo, loginInfo } = state1;
  const [{ loading, error, loadingUpload }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  const [state, setState] = useState({
    loading: false,
    loadingUpload: false,

    // contact: {
    //   name: '',
    //   image: '',
    //   phone: '',
    //   email: '',
    //   business: '',
    //   title: '',
    //   groupId: '',
    //   purchase: '',
    //   paid: '',
    //   due: '',
    //},
    errorMessage: '',
    groups: {},
  });

  //const url = "https://automation-app.onrender.com"
  //http://localhost:4000

  const pro_id = Date.now();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [images, setImages] = useState([]);
  //const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');

  const [stocks, setStocks] = useState([]);
  const [stock_brands, setStockBrands] = useState([]);

  const re = /, ?|\n/gm;
  const tit = title.split(re);
  const bra = brand.split(re);

  //const obj = Object.assign({}, images);

  //converting array tp object with keys
  // images.forEach((elem, i) => {
  //   obj[`image${i}`] = elem;
  // });

  const [file, setFile] = useState();
  // const [fileName, setFileName] = useState('');

  //   useEffect(() => {
  //     const fetchStock = async () => {
  //       try {
  //         const { data } = await axios.get(
  //           'http://localhost:8025/stock/findByAll'
  //         );
  //         setStocks(data);
  //       } catch (err) {
  //         toast.error(getError(err));
  //       }
  //     };
  //     fetchStock();
  //   }, []);

  //   useEffect(() => {
  //     const fetchBrands = async () => {
  //       try {
  //         const { data } = await axios.get(
  //           'http://localhost:8025/brand/findByAll'
  //         );
  //         setStockBrands(data);
  //       } catch (err) {
  //         toast.error(getError(err));
  //       }
  //     };
  //     fetchBrands();
  //   }, []);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(`http://localhost:4000/newproduct`, {
        title,
        price,
        image,
        images,
        brand,
        description,
      });
      dispatch({ type: 'PRODUCT_SUCCESS', payload: data });

      toast.success('Product created successful');
      navigate('/products');
    } catch (err) {
      toast.error(getError(err));
    }
  };

  const uploadFileHandler = async (e, forImages) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    bodyFormData.append('upload_preset', 'gqfesdmu');
    try {
      setState({ ...state, loadingUpload: true });
      const { data } = await axios.post(
        'https://api.cloudinary.com/v1_1/mafuz-enterprise/image/upload',
        bodyFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setState({ ...state, loadingUpload: false });
      //console.log(data.secure_url);
      //imageField
      if (forImages) {
        setImages([...images, data.secure_url]);
      } else {
        setImage(data.secure_url);
      }
      toast.success('Image uploaded successfully. click Create to apply it');

      //enqueueSnackbar('File uploaded successfully', { variant: 'success' });
    } catch (err) {
      setState({
        ...state,
        loadingUpload: false,
        errorMessage: err.message,
      });
      //dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
      // enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  // const uploadFileHandler = async (e) => {
  //   console.log(e.target.files[0]);
  //   const file = e.target.files[0];
  //   const bodyFormData = new FormData();
  //   bodyFormData.append('file', file);
  //   try {
  //     dispatch({ type: 'UPLOAD_REQUEST' });
  //     const { data } = await axios.post(
  //       'http://localhost:4000/upload',
  //       bodyFormData,
  //       {
  //         headers: {
  //           'Content-Type': 'multipart/form-data',
  //           // authorization: `Bearer ${loginInfo.token}`,
  //         },
  //         upload_preset: 'gqfesdmu',
  //       }
  //     );
  //     dispatch({ type: 'UPLOAD_SUCCESS' });

  //     toast.success('Image uploaded successfully');
  //     setImage(data.secure_url);
  //   } catch (err) {
  //     toast.error(getError(err));
  //     dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
  //   }
  // };

  const deleteFileHandler = async (fileName, f) => {
    console.log(fileName, f);
    // console.log(images);
    console.log(images.filter((x) => x !== fileName));
    setImages(images.filter((x) => x !== fileName));
    toast.success('Image removed successfully. click Update to apply it');
  };

  return (
    <Container className="small-container">
      <Helmet>
        <title>Create Product</title>
      </Helmet>
      <h1>Create Product</h1>
      {/* <pre>{JSON.stringify(images)}</pre> */}
      {/* {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox> 
      ) :  */}

      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            // as="select"
            required
            onChange={(e) => setTitle(e.target.value)}
          >
            {/* {stocks.map((stock) => (
              <option key={stock.id} value={stock.description + ',' + stock.id}>
                {stock.description}
              </option>
            ))} */}
          </Form.Control>
        </Form.Group>
        <Form.Group className="mb-3" controlId="price">
          <Form.Label>Price</Form.Label>
          <Form.Control onChange={(e) => setPrice(e.target.value)} required />
        </Form.Group>
        <Form.Group className="mb-3" controlId="image">
          <Form.Label>Image File</Form.Label>
          <Form.Control
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="file">
          <Form.Label>Upload Image</Form.Label>
          <Form.Control
            type="file"
            accept="image/png, image/jpeg, image/jpg, image/jfif"
            onChange={uploadFileHandler}
          />
          {loadingUpload && <LoadingBox></LoadingBox>}
        </Form.Group>

        <Form.Group className="mb-3" controlId="additionalImage">
          <Form.Label>Additional Images</Form.Label>
          {images.length === 0 && <MessageBox>No image</MessageBox>}
          <ListGroup variant="flush">
            {images.map((x) => (
              <ListGroup.Item key={x}>
                {x}
                <Button variant="light" onClick={() => deleteFileHandler(x)}>
                  <i className="fa fa-times-circle"></i>
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Form.Group>
        <Form.Group className="mb-3" controlId="additionalImageFile">
          <Form.Label>Upload Aditional Image</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => uploadFileHandler(e, true)}
          />
          {loadingUpload && <LoadingBox></LoadingBox>}
        </Form.Group>

        {/* <img src={image} alt="" /> */}
        {/* <Form.Group className="mb-3" controlId="category">
          <Form.Label>Category</Form.Label>
          <Form.Control
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </Form.Group> */}
        <Form.Group className="mb-3" controlId="brand">
          <Form.Label>Brand</Form.Label>
          <Form.Control
            as="select"
            onChange={(e) => setBrand(e.target.value)}
            required
          >
            <option>Brand</option>
            <option value="men , 1">Men</option>
            <option value="women , 2">Women</option>
            <option value="watch , 3">Watch</option>
            {/* {stock_brands.map((brand) => (
              <option key={brand.id} value={brand.brandName + ',' + brand.id}>
                {brand.brandName}
              </option> 
            ))} */}
          </Form.Control>
        </Form.Group>
        <Form.Group className="mb-3" controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <Row className="mb-3">
            <Form.Group as={Col} className="">
              <div className="mt-3">
                <Button className="save" type="submit">
                  Create
                </Button>
              </div>
            </Form.Group>
            <Form.Group as={Col}>
              <div className="mt-3">
                <Link to={`/products`}>
                  <Button className="back" type="submit">
                    Back
                  </Button>
                </Link>
              </div>
            </Form.Group>
          </Row>
        </Form.Group>
        {/* <div className="mb-3">
          <Button type="submit">Create</Button>
        </div> */}
      </Form>
      {/* } */}
    </Container>
  );
}

export default ProductCreateScreen;
