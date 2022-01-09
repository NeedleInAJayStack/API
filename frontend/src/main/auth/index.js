import React from "react";
import base64 from "base-64";


const authProvider = {
	signin(username, password, callback) {
		fetch('http://localhost:8080/auth/token', {
      method: 'GET',
      headers: {
        'Authorization': 'Basic ' + base64.encode(username + ":" + password)
      }
    }).then(response => {
      if (response.ok) {
        response.json().then(result => {
					let token = result.token;
					setTimeout(callback(token), 100);
					// console.log(token);
				})
      } else {
        alert("User or password not recognized")
      }
    });
	},
	signout(callback) {
		setTimeout(callback, 100);
	}
};
  
let AuthContext = React.createContext(null); // Of type { state, signin, signout }

export function AuthProvider({ children }) {
  let [state, setState] = React.useState({
		user: null,
		token: null
	});

  let signin = (username, password, callback) => {
    return authProvider.signin(username, password, (token) => {
      setState({
				user: username,
				token: token
			});
      callback();
    });
  };

  let signout = (callback) => {
    return authProvider.signout(() => {
      setState({
				user: null,
				token: null
			});
      callback();
    });
  };

  let value = { state, signin, signout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return React.useContext(AuthContext);
}
