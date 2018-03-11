import PatientNotesContract from '../../build/contracts/PatientNotes.json';

/**
 * INITIAL STATE
 */
const defaultContract = {}

/**
 * ACTION TYPES
 */
const GET_CONTRACT = 'GET_CONTRACT';

/**
 * ACTION CREATORS
 */
const setContract = contract => ({type: GET_CONTRACT, contract})

/**
 * THUNK CREATORS
 */
export const fetchContract = web3  => {
  const contract = require('truffle-contract');
  const patientNotes = contract(PatientNotesContract);
  patientNotes.setProvider(web3.currentProvider)
  return dispatch => patientNotes.deployed().then(contract => dispatch(setContract(contract)))
}

/**
 * REDUCER
 */
export default function (state = defaultContract, action) {
  switch (action.type) {
    case GET_CONTRACT:
      return action.contract;
    default:
      return state
  }
}
