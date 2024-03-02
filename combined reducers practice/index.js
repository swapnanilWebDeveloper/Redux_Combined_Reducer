import {createStore, applyMiddleware, combineReducers} from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import axios from 'axios';

// action name constants
const inc = 'account/increment';
const dec = 'account/decrement';
const incByAmt = 'account/incrementByAmount';
// const init = 'account/initilaize';
const getAccUserPending = 'account/getUser/pending';
const getAccUserFulfilled= 'account/getUser/fulfilled';
const getAccUserRejected = 'account/getUser/rejected';

const incBonus = 'bonus/increment';
//store
const store = createStore(
    combineReducers({
        account : accountReducer,
        bonus : bonusReducer
    }), 
    applyMiddleware(logger.default, thunk.default));

// reducer
function accountReducer(state={amount : 1}, action){
      switch(action.type){
         case getAccUserFulfilled: 
              return {
                      amount : state.amount, name : action.payload.name, username : action.payload.username,
                      username : action.payload.username, email : action.payload.email,street : action.payload.address.street, 
                      suite : action.payload.address.suite, city : action.payload.address.city, 
                      zipcode : action.payload.address.zipcode,
                      latitude : action.payload.address.geo.lat,
                      longitude : action.payload.address.geo.lng,
                      phone : action.payload.phone,  website : action.payload.website,
                      company_name : action.payload.company.name,
                      company_catchPhrase : action.payload.company.catchPhrase,
                      company_bs : action.payload.company.bs,
                      pending : false
                    };
         case getAccUserRejected: 
              return {...state, error : action.error, pending : false};
         case getAccUserPending: 
              return {...state, pending : true};
        
         case inc: 
              return {amount : state.amount + 1};
         case dec: 
              return {amount : state.amount - 1};
         case incByAmt: 
              return {amount : state.amount + action.payload}; 
         default :
              return state;    
      }
}

function bonusReducer(state={points : 0}, action){
    switch(action.type){ 
        case incBonus:
             return {points : state.points + 1}
        case incByAmt: 
             if(action.payload >= 100)
                 return {points : state.points + 1};
        default :
              return state; 
    }
}
// Action creators
function getUserAccount(id){
        return async (dispatch,getState) => {
                dispatch(getAccountUserPending());
              //  const {data} = await axios.get(`http://localhost:3000/accounts/${id}`);
              fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
              .then((response) => {
                return response.json();
               })
              .then((data) => {
                dispatch(getAccountUserFulFilled(data))
                })
              .catch((error) => {
                     dispatch(getAccountUserRejected(error.message));
              })
        }
}

function getAccountUserFulFilled(value){
     return {type : getAccUserFulfilled, payload : value}
}

function getAccountUserRejected(error){
    return {type : getAccUserRejected, error : error}
}

function getAccountUserPending(){
    return {type : getAccUserPending }
}

function increment(){
    return {type : inc }
}

function decrement(){
    return {type : dec}
}

function incrementByAmount(value){
    return {type : incByAmt, payload : value}
}

function incrementBonus(){
    return {type : incBonus}
}

/* setInterval(() => {
    store.dispatch(incrementByAmount(5));
},2000) */

setTimeout(() => {
    store.dispatch(getUserAccount(6));
 //   store.dispatch(increment());
 //   store.dispatch(incrementByAmount(150));
 //    store.dispatch(incrementBonus());
},2000)