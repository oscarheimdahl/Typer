import React from 'react';
import ReactDOM from 'react-dom';
import Typer from './components/Typer';
// import { createStore, applyMiddleware, compose } from 'redux';
// import rootReducer from './store/reducers/rootReducer';
// import { Provider } from 'react-redux';
// import { reduxFirestore, getFirestore } from 'redux-firestore';
// import { ReactReduxFirebaseProvider, getFirebase } from 'react-redux-firebase';
// import thunk from 'redux-thunk';
// import fbConfig from './config/fbConfig';

// const store = createStore(
// 	rootReducer,
// 	applyMiddleware(thunk.withExtraArgument({ getFirebase }))
// );

//Tut: https://www.youtube.com/watch?v=gf5bVfVlNUM
//Breaking change: http://docs.react-redux-firebase.com/history/v3.0.0/docs/v3-migration-guide.html

// const rrfProps = {
// 	firebase,
// 	config: rrfConfig,
// 	dispatch: store.dispatch
// };

// ReactDOM.render(
// 	<Provider store={store}>
// 		<Typer />
// 	</Provider>,
// 	document.getElementById('root')
// );

ReactDOM.render(<Typer />, document.getElementById('root'));
