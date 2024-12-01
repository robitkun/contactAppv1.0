import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { getUserLogged, putAccessToken } from '../utils/api';
import Navigation from './Navigation';
import HomePage from '../pages/HomePage';
import AddPage from '../pages/AddPage';
import RegisterPage from '../pages/RegisterPage';
import LoginPage from '../pages/LoginPage';
class ContactApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authedUser: null,
      initialize: true,
    };
    this.onLoginSuccess = this.onLoginSuccess.bind(this);
    this.onLogout = this.onLogout.bind(this);
  }
  onLogout() {
    this.setState(() => {
      return {
        authedUser: null,
      };
    });
    putAccessToken('');
  }

  async onLoginSuccess({ accessToken }) {
    putAccessToken(accessToken);
    const { data } = await getUserLogged();
    this.setState(() => {
      return {
        authedUser: data,
      };
    });
  }
  async componentDidMount() {
    const { data } = await getUserLogged();
    this.setState(() => {
      return {
        authedUser: data,
        initialize: false,
      };
    });
  }

  render() {
    if (this.state.initialize) {
      return null;
    }
    if (this.state.authedUser === null) {
      return (
        <div className="contact-app">
          <header className="contact-app__header">
            <h1>Aplikasi Kontak</h1>
          </header>
          <main>
            <Routes>
              <Route
                path="/*"
                element={<LoginPage loginSuccess={this.onLoginSuccess} />}
              />
              <Route path="/register" element={<RegisterPage />} />
            </Routes>
          </main>
        </div>
      );
    }
    return (
      <div className="contact-app">
        <header className="contact-app__header">
          <h1>Aplikasi Kontak</h1>
          <Navigation
            logout={this.onLogout}
            name={this.state.authedUser.name}
          />
        </header>
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/add" element={<AddPage />} />
          </Routes>
        </main>
      </div>
    );
  }
}

export default ContactApp;
