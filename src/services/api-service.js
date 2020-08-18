import axios from 'axios';
import {BASE_URL, READ_ALL_URL, READ_ONE_URL, MANAGE_LANGUAGES, MANAGE_SKILLS, LOG_URL} from '../components/constants';

class AccountService {
  register({username, email, password, password_confirm}) {
    axios
      .post(`${BASE_URL}/api/v1/accounts/register/`, {
        username,
        email,
        password,
        password_confirm,
      })
      .then(() => {
        return {status: 200};
      })
      .catch(() => {
        return {status: 400};
      });
  }

  signIn({username, password}) {
    axios
      .post(`${BASE_URL}/api/v1/token-auth/`, {username, password})
      .then(({data: {token}}) => {
        return {token: `Token ${token}`, status: 200};
      })
      .catch(() => {
        return {status: 400};
      });
  }

  getUser({token}) {
    axios
      .get(`${BASE_URL}/api/v1/get-user/`, {
        headers: {Authorization: token},
      })
      .then(({data: {id: user_id, username, email}}) => {
        return {user_id, username, email, status: 200};
      })
      .catch(() => {
        return {status: 400};
      });
  }

  async getUserDetail({user_id, token}) {
    await axios
      .get(`${BASE_URL}/api/v1/user/${user_id}/`, {
        headers: {Authorization: token},
      })
      .then(({data}) => {
        return {...data, status: 200};
      })
      .catch(() => {
        return {status: 400};
      });
  }
}

class ApiService {
  constructor(token) {
    this.token = token;
  }

  getFeeds({url}) {
    axios
      .get(url, {headers: {Authorization: this.token}})
      .then(({data}) => {
        return {...data, status: 200};
      })
      .catch(() => {
        return {status: 400};
      });
  }

  markAllAsRead() {
    axios
      .post(READ_ALL_URL, {param: 'clean'}, {headers: {Authorization: this.token}})
      .then(() => {
        return {status: 200};
      })
      .catch(() => {
        return {status: 400};
      });
  }

  markOneAsRead({item_id}) {
    axios
      .put(`${READ_ONE_URL}${item_id}/`, {is_new: false}, {headers: {Authorization: this.token}})
      .then(() => {
        return {status: 200};
      })
      .catch(() => {
        return {status: 400};
      });
  }

  getFilter({filter_id}) {
    axios
      .get(`${BASE_URL}/api/v1/filter/${filter_id}/`, {
        headers: {Authorization: this.token},
      })
      .then(({data}) => {
        return {data, status: 200};
      })
      .catch(() => {
        return {status: 400};
      });
  }

  manageSkills({filter_id, skill_list}) {
    axios
      .post(
        MANAGE_SKILLS,
        {
          list: skill_list,
          filter_id,
        },
        {headers: {Authorization: this.token}},
      )
      .then(() => {
        return {status: 200};
      })
      .catch(() => {
        return {status: 400};
      });
  }

  updateFilter({filter}) {
    axios
      .put(`${BASE_URL}/api/v1/filter/${filter.id}/`, filter, {
        headers: {Authorization: this.token},
      })
      .then(() => {
        return {status: 200};
      })
      .catch(() => {
        return {status: 400};
      });
  }

  getLanguages = async () => {
    const request = await axios.get(`${BASE_URL}/api/v1/language/`, {
      headers: {Authorization: this.token},
    });
    return request.data;
  };

  getSkills = async () => {
    const request = await axios.get(`${BASE_URL}/api/v1/skill/`, {
      headers: {Authorization: this.token},
    });
    return request.data;
  };
}

const log = (action, state, response, user = '') => {
  axios
    .post(LOG_URL, {action: action, response: response, state: state, user: user})
    .then(({data}) => {
      return {...data, status: 200};
    })
    .catch(() => {
      return {status: 400};
    });
};

export {AccountService, ApiService, log};
