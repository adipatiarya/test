import {all, call, fork, put, takeEvery} from "redux-saga/effects";
import {
    auth,
    googleAuthProvider
} from "../firebase/firebase";
import {
    SIGNIN_GOOGLE_USER,
    SIGNIN_USER,
    SIGNOUT_USER,
    SIGNUP_USER
} from "constants/ActionTypes";

import {showAuthMessage, userSignInSuccess, userSignOutSuccess, userSignUpSuccess, userGoogleSignInSuccess,me} from "actions/Auth";


const createUserWithEmailPasswordRequest = async (email, password, name) =>
    await  auth.createUserWithEmailAndPassword(email, password).then(authUser => authUser && authUser.user.updateProfile({displayName:name}) ? authUser: authUser).catch(error => error);

const signInUserWithEmailPasswordRequest = async (email, password) =>
    await  auth.signInWithEmailAndPassword(email, password)
        .then(authUser => authUser)
        .catch(error => error);

const signOutRequest = async () =>
    await  auth.signOut()
        .then(authUser => authUser)
        .catch(error => error);


const signInUserWithGoogleRequest = async () =>
    await  auth.signInWithPopup(googleAuthProvider)
        .then(authUser => authUser)
        .catch(error => error);
const getUserDetail = async () => {
    let data = {};
    return await new Promise((resolve, reject)=> {
        auth.onAuthStateChanged( function(user) {
            if(user) {
                data.idToken = user.getIdToken();
                data.email = user.email;
                data.username = user.displayName;
                resolve(data);
            }
            else {
                resolve(data);
            }
        })
    });
    
    
}

function* createUserWithEmailPassword({payload}) {
    const {email, password, name} = payload;
    try {
        const signUpUser = yield call(createUserWithEmailPasswordRequest, email, password, name);
       // yield call()
        if (signUpUser.message) {
            yield put(showAuthMessage(signUpUser.message));
        } else {
            
            localStorage.setItem('user_id', signUpUser.user.uid);
            
            yield put(userSignUpSuccess(signUpUser.user.uid));

            window.location.reload();
        }
    } catch (error) {
        yield put(showAuthMessage(error));
    }
}


function* signInUserWithGoogle() {
    try {
        const signUpUser = yield call(signInUserWithGoogleRequest);
        if (signUpUser.message) {
            yield put(showAuthMessage(signUpUser.message));
        } else {
            localStorage.setItem('user_id', signUpUser.user.uid);
            yield put(userGoogleSignInSuccess(signUpUser.user.uid));
            window.location.reload();

        }
    } catch (error) {
        yield put(showAuthMessage(error));
    }
}

function* mees() {
    const saya = yield call(getUserDetail);
    yield put(me(saya));

}
function* signInUserWithEmailPassword({payload}) {
    const {email, password} = payload;
    try {
        const signInUser = yield call(signInUserWithEmailPasswordRequest, email, password);
        if (signInUser.message) {
            yield put(showAuthMessage(signInUser.message));
        } else {
            
            localStorage.setItem('user_id', signInUser.user.uid);
            yield put(userSignInSuccess(signInUser.user.uid));
             window.location.reload();
        }
    } catch (error) {
        yield put(showAuthMessage(error));
    }
}

function* signOut() {
    try {
        const signOutUser = yield call(signOutRequest);
        if (signOutUser === undefined) {
            localStorage.removeItem('user_id');
            yield put(userSignOutSuccess(signOutUser));
        } else {
            yield put(showAuthMessage(signOutUser.message));
        }
    } catch (error) {
        yield put(showAuthMessage(error));
    }
}

export function* createUserAccount() {
    yield takeEvery(SIGNUP_USER, createUserWithEmailPassword);
}

export function* signInWithGoogle() {
    yield takeEvery(SIGNIN_GOOGLE_USER, signInUserWithGoogle);
}


export function* signInUser() {
    yield takeEvery(SIGNIN_USER, signInUserWithEmailPassword);
}

export function* signOutUser() {
    yield takeEvery(SIGNOUT_USER, signOut);
}

export default function* rootSaga() {
    yield all([
        fork(signInUser),
        fork(createUserAccount),
        fork(signInWithGoogle),
        fork(signOutUser),
        fork(mees)
        
    ]);
}