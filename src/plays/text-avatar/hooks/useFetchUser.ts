import axios from 'axios';
import { useEffect, useReducer } from 'react';
import {
  ActionFailureReturnType,
  ActionRequestReturnType,
  ActionsReturnType,
  ActionSuccessReturnType,
  Arguments,
  State,
  User
} from '../types';

const fetchUserSuccess = (users: User[]): ActionSuccessReturnType => ({
  type: 'success',
  payload: users
});

const fetchUserRequest = (): ActionRequestReturnType => ({
  type: 'request',
  payload: undefined
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fetchUserFailure = (error: any): ActionFailureReturnType => ({
  type: 'failure',
  payload: error
});

const initialState: State = {
  users: [],
  error: undefined,
  fetching: false
};

function reducer(state: State, action: ActionsReturnType): State {
  switch (action.type) {
    case 'request':
      return {
        ...state,
        fetching: true
      };
    case 'success':
      return {
        ...state,
        users: action.payload as User[],
        fetching: false
      };
    case 'failure':
      return {
        ...state,
        fetching: false,
        error: action.payload
      };
    default:
      return state;
  }
}

export function useFetchUser({ url, options }: Arguments) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (!url || url === '') return;

    async function fetchUser() {
      dispatch(fetchUserRequest());

      try {
        const response = await axios.get(url, options);
        const { results } = response.data;
        dispatch(fetchUserSuccess(results));
      } catch (error) {
        dispatch(fetchUserFailure(error));
      }
    }

    fetchUser();
  }, [url, options]);

  return state;
}
