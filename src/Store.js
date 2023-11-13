import { createContext, useReducer } from 'react';

export const Store = createContext();

const initialState = {
  fullBox: false,

  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,

  loginInfo: localStorage.getItem('loginInfo')
    ? JSON.parse(localStorage.getItem('loginInfo'))
    : null,

  passInfo: localStorage.getItem('passInfo')
    ? JSON.parse(localStorage.getItem('passInfo'))
    : null,

  cart: {
    shippingAddress: localStorage.getItem('shippingAddress')
      ? JSON.parse(localStorage.getItem('shippingAddress'))
      : { location: {} },
    paymentMethod: localStorage.getItem('paymentMethod')
      ? localStorage.getItem('paymentMethod')
      : '',
    cartItems: localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : [],
  },
  pos: {
    posItems: localStorage.getItem('posItems')
      ? JSON.parse(localStorage.getItem('posItems'))
      : [],
  },

  tran: {
    trans: localStorage.getItem('trans')
      ? JSON.parse(localStorage.getItem('trans'))
      : [],
  },

  result: localStorage.getItem('result')
    ? JSON.parse(localStorage.getItem('result'))
    : [],
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_FULLBOX_ON':
      return { ...state, fullBox: true };
    case 'SET_FULLBOX_OFF':
      return { ...state, fullBox: false };

    case 'CART_ADD_ITEM':
      // add to cart
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item) => item.product_id === newItem.product_id
      );
      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item.product_id === existItem.product_id ? newItem : item
          )
        : [...state.cart.cartItems, newItem];
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    case 'CART_REMOVE_ITEM': {
      const cartItems = state.cart.cartItems.filter(
        (item) => item.product_id !== action.payload.product_id
      );
      localStorage.setItem('cartItems', cartItems);
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case 'CART_CLEAR':
      return { ...state, cart: { ...state.cart, cartItems: [] } };

    case 'BATCH_ADD_ITEM':
      // add to cart
      const newItm = action.payload;
      const existTran = state.tran.trans.find((item) => item.id === newItm.id);
      const trans = existTran
        ? state.tran.trans.map((item) =>
            item.id === existTran.id ? newItm : item
          )
        : [...state.tran.trans, newItm];
      localStorage.setItem('trans', JSON.stringify(trans));
      return { ...state, tran: { ...state.tran, trans } };

    case 'BATCH_REMOVE_ITEM': {
      const trans = state.tran.trans.filter(
        (item) => item.id !== action.payload.id
      );
      localStorage.setItem('trans', JSON.stringify(trans));
      return { ...state, tran: { ...state.tran, trans } };
    }

    case 'BATCH_CLEAR':
      return { ...state, tran: { ...state.tran, trans: [] } };

    case 'CVS_ADD_ITEM':
      // add to cart
      const newResult = action.payload;
      const existResult = state.res.result.find(
        (item) => item.id === newResult.id
      );
      const result = existResult
        ? state.res.result.map((item) =>
            item.id === existResult.id ? newResult : item
          )
        : [...state.res.results, newResult];
      localStorage.setItem('result', JSON.stringify(result));
      return { ...state, tran: { ...state.res, result } };

    case 'CVS_REMOVE_ITEM': {
      const result = state.res.result.filter(
        (item) => item.id !== action.payload.id
      );
      localStorage.setItem('result', JSON.stringify(result));
      return { ...state, res: { ...state.res, result } };
    }

    case 'CVS_CLEAR':
      return { ...state, res: { ...state.res, result: [] } };

    case 'POS_ADD_ITEM':
      // add to cart
      const newItems = action.payload;
      const existPosItem = state.pos.posItems.find(
        (item) => item.id === newItems.id
      );
      const posItems = existPosItem
        ? state.pos.posItems.map((item) =>
            item.id === existPosItem.id ? newItems : item
          )
        : [...state.pos.posItems, newItems];
      localStorage.setItem('posItems', JSON.stringify(posItems));
      return { ...state, pos: { ...state.pos, posItems } };

    case 'POS_REMOVE_ITEM': {
      const posItems = state.pos.posItems.filter(
        (item) => item.id !== action.payload.id
      );
      localStorage.setItem('posItems', JSON.stringify(posItems));
      return { ...state, pos: { ...state.pos, posItems } };
    }

    case 'POS_CLEAR':
      return { ...state, pos: { ...state.pos, posItems: [] } };

    case 'SAVE_SHIPPING_ADDRESS':
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: {
            ...state.cart.shippingAddress,
            ...action.payload,
          },
        },
      };
    case 'SAVE_SHIPPING_ADDRESS_MAP_LOCATION':
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: {
            ...state.cart.shippingAddress,
            // location: action.payload,
          },
        },
      };
    case 'SAVE_PAYMENT_METHOD':
      return {
        ...state,
        cart: { ...state.cart, paymentMethod: action.payload },
      };

    case 'USER_LOGIN':
      return { ...state, userInfo: action.payload };
    case 'MY_LOGIN':
      return { ...state, loginInfo: action.payload };

    case 'FORGOT_PASS':
      return { ...state, passInfo: action.payload };

    case 'USER_LOGOUT':
      return {
        ...state,
        userInfo: null,
        //loginInfo: null,
        cart: {
          cartItems: [],
          shippingAddress: {},
          paymentMethod: '',
        },
        batch: {
          batchItems: [],
        },
        pos: {
          posItems: [],
        },
      };

    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}

// import { createContext, useReducer } from 'react';

// export const Store = createContext();

// const initialState = {
//   fullBox: false,

//   userInfo: localStorage.getItem('userInfo')
//     ? JSON.parse(localStorage.getItem('userInfo'))
//     : null,

//   loginInfo: localStorage.getItem('loginInfo')
//     ? JSON.parse(localStorage.getItem('loginInfo'))
//     : null,

//   passInfo: localStorage.getItem('passInfo')
//     ? JSON.parse(localStorage.getItem('passInfo'))
//     : null,

//   cart: {
//     shippingAddress: localStorage.getItem('shippingAddress')
//       ? JSON.parse(localStorage.getItem('shippingAddress'))
//       : { location: {} },
//     paymentMethod: localStorage.getItem('paymentMethod')
//       ? localStorage.getItem('paymentMethod')
//       : '',
//     cartItems: localStorage.getItem('cartItems')
//       ? JSON.parse(localStorage.getItem('cartItems'))
//       : [],
//   },
// };

// function reducer(state, action) {
//   switch (action.type) {
//     case 'SET_FULLBOX_ON':
//       return { ...state, fullBox: true };
//     case 'SET_FULLBOX_OFF':
//       return { ...state, fullBox: false };

//     case 'CART_ADD_ITEM':
//       // add to cart
//       const newItem = action.payload;
//       const existItem = state.cart.cartItems.find(
//         (item) => item.id === newItem.id
//       );
//       const cartItems = existItem
//         ? state.cart.cartItems.map((item) =>
//             item.id === existItem.id ? newItem : item
//           )
//         : [...state.cart.cartItems, newItem];
//       localStorage.setItem('cartItems', JSON.stringify(cartItems));
//       return { ...state, cart: { ...state.cart, cartItems } };

//     case 'CART_REMOVE_ITEM': {
//       const cartItems = state.cart.cartItems.filter(
//         (item) => item.id !== action.payload.id
//       );
//       localStorage.setItem('cartItems', JSON.stringify(cartItems));
//       return { ...state, cart: { ...state.cart, cartItems } };
//     }

//     case 'CART_CLEAR':
//       return { ...state, cart: { ...state.cart, cartItems: [] } };

//     case 'SAVE_SHIPPING_ADDRESS':
//       return {
//         ...state,
//         cart: {
//           ...state.cart,
//           shippingAddress: {
//             ...state.cart.shippingAddress,
//             ...action.payload,
//           },
//         },
//       };
//     case 'SAVE_SHIPPING_ADDRESS_MAP_LOCATION':
//       return {
//         ...state,
//         cart: {
//           ...state.cart,
//           shippingAddress: {
//             ...state.cart.shippingAddress,
//             // location: action.payload,
//           },
//         },
//       };
//     case 'SAVE_PAYMENT_METHOD':
//       return {
//         ...state,
//         cart: { ...state.cart, paymentMethod: action.payload },
//       };

//     case 'USER_LOGIN':
//       return { ...state, userInfo: action.payload };
//     case 'MY_LOGIN':
//       return { ...state, loginInfo: action.payload };

//     case 'FORGOT_PASS':
//       return { ...state, passInfo: action.payload };

//     case 'USER_LOGOUT':
//       return {
//         ...state,
//         userInfo: null,
//         loginInfo: null,
//         cart: {
//           cartItems: [],
//           shippingAddress: { location: {} },
//           paymentMethod: '',
//         },
//       };

//     default:
//       return state;
//   }
// }

// export function StoreProvider(props) {
//   const [state, dispatch] = useReducer(reducer, initialState);
//   const value = { state, dispatch };
//   return <Store.Provider value={value}>{props.children}</Store.Provider>;
// }
