import './style/global.less';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { ConfigProvider } from '@arco-design/web-react';
import zhCN from '@arco-design/web-react/es/locale/zh-CN';
import enUS from '@arco-design/web-react/es/locale/en-US';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { getUserInfo } from './api/user';
import rootReducer from './store';
import PageLayout from './layout';
import { GlobalContext } from './context';
import Login from './pages/login';
import changeTheme from './utils/changeTheme';
import useStorage from './utils/useStorage';
import './mock';

const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

function Index() {
  const [lang, setLang] = useStorage('arco-lang', 'en-US');
  const [theme, setTheme] = useStorage('arco-theme', 'light');

  function getArcoLocale() {
    switch (lang) {
      case 'zh-CN':
        return zhCN;
      case 'en-US':
        return enUS;
      default:
        return zhCN;
    }
  }

  async function fetchUserInfo() {
    store.dispatch({
      type: 'update-userInfo',
      payload: { userLoading: true },
    });
    try {
      const ret: any = await getUserInfo();
      store.dispatch({
        type: 'update-userInfo',
        payload: {
          userInfo: {
            username: ret.username,
            avatar: ret.avatar,
          },
          userLoading: false,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const checkLogin = localStorage.getItem('userStatus') === 'login';
    if (checkLogin) {
      fetchUserInfo();
    } else if (window.location.pathname.replace(/\//g, '') !== 'login') {
      window.location.pathname = '/login';
    }
  }, []);

  useEffect(() => {
    changeTheme(theme);
  }, [theme]);

  const contextValue = {
    lang,
    setLang,
    theme,
    setTheme,
  };

  return (
    <BrowserRouter>
      <ConfigProvider
        locale={getArcoLocale()}
        componentConfig={{
          Card: {
            bordered: false,
          },
          List: {
            bordered: false,
          },
          Table: {
            border: false,
          },
        }}
      >
        <Provider store={store}>
          <GlobalContext.Provider value={contextValue}>
            <Switch>
              <Route path="/login" component={Login} />
              <Route path="/" component={PageLayout} />
            </Switch>
          </GlobalContext.Provider>
        </Provider>
      </ConfigProvider>
    </BrowserRouter>
  );
}

ReactDOM.render(<Index />, document.getElementById('root'));
