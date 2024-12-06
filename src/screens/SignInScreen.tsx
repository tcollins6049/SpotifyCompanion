import { useState } from 'react';
import { authorize, refresh } from 'react-native-app-auth';
import { Button } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { StackNavigationProp } from '@react-navigation/stack';

import { app, firestore, auth } from "../authorization/Firebase_config";
import { RootStackParamList } from '../../App';
import { useSpotifyAuth } from '../context/SpotifyAuthContext';


const spotifyAuthConfig = {
    clientId: '8d018c31566f4e87aae3d9ffe6d00d85',
    clientSecret: 'ea3c5450da3a4e5e96765c2dee58348e',
    redirectUrl: 'myapp://auth-callback', // Make sure this matches the redirect URI in Spotify Developer Dashboard
    scopes: ['user-read-email', 'playlist-read-private', 'user-read-playback-state', 'user-modify-playback-state'], // Add more scopes if needed
    serviceConfiguration: {
      authorizationEndpoint: 'https://accounts.spotify.com/authorize',
      tokenEndpoint: 'https://accounts.spotify.com/api/token',
    },
};


type SignInScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SignIn'>;

const SignInScreen = () => {
    const navigation = useNavigation<SignInScreenNavigationProp>();
    const { setAccessToken } = useSpotifyAuth(); // Get function to set accessToken


    /**
     * 
     * @param userId 
     * @param data 
     */
    const saveUserDataToFirebase = async (userId: string, data: any) => {
        try {
            await setDoc(doc(firestore, 'users', userId), data, { merge: true });
            console.log('User data saved successfully');
        } catch (error) {
            console.error('Error saving user data to Firebase:', error);
        }
    };


    const handleSpotifyLogin = async () => {
        const authState = await authorize(spotifyAuthConfig);
        const { accessToken, refreshToken } = authState;
        const accessTokenExpirationDate = new Date(authState.accessTokenExpirationDate).getTime();
    
        // Fetch user info from Spotify
        const userInfoResponse = await fetch('https://api.spotify.com/v1/me', {
            headers: {
                Authorization: `Bearer ${authState.accessToken}`,
            },
        });
        const userInfo = await userInfoResponse.json();
        const email = userInfo.email; // TODO: Get email from Spotify
        console.log(`Email: ${email}`);
        const password = `spotify-${userInfo.id}`;
    
        // Check if user with this email exists in Firestore
        const usersRef = collection(firestore, 'users');
        const q = query(usersRef, where('email', '==', email));
        const querySnapshot = await getDocs(q);
    
        console.log("Q: ", querySnapshot.empty)
        if (!querySnapshot.empty) {
            // User exists, sign them in
            try {
                await signInWithEmailAndPassword(auth, email, password);
                console.log("User signed in successfully");
        
                // Update accessToken and refreshToken in Firebase
                await saveUserDataToFirebase(email, {
                    spotifyAccessToken: accessToken,
                    spotifyRefreshToken: refreshToken,
                    tokenExpiry: accessTokenExpirationDate
                });

                setAccessToken(accessToken);
                navigation.navigate('Main');
    
            } catch (error) {
                console.error('Error signing in: ', error);
            }
        } else {
            // User doesn't exist, create a new account
            try {
                const newUserCredential = await createUserWithEmailAndPassword(auth, email, password);
                const userId = newUserCredential.user.uid;
        
                // Save user data
                saveUserDataToFirebase(email, { 
                    email, 
                    spotifyAccessToken: accessToken,
                    spotifyRefreshToken: refreshToken,
                    tokenExpiry: accessTokenExpirationDate  
                });

                setAccessToken(accessToken);
                navigation.navigate('Main');
                console.log("New user created:", userId);
            } catch (error) {
                console.error(`Error creating user:`, error);
            }
        }
    };


    // Refresh token logic when needed
    /*const refreshSpotifyAccessToken = async (refreshToken: string) => {
        try {
        const refreshedState = await refresh(spotifyAuthConfig, {
            refreshToken: refreshToken,
        });

        const { accessToken, accessTokenExpirationDate } = refreshedState;

        console.log('Access token refreshed:', accessToken);
        
        // Optionally, update the refreshed accessToken in Firestore
        await setDoc(doc(firestore, 'users', 'your-user-id'), {
            spotifyAccessToken: accessToken,
            tokenExpiry: accessTokenExpirationDate,
        }, { merge: true });

        return accessToken;
        } catch (error) {
        console.error('Error refreshing access token:', error);
        }
    };*/


    return (
        // Add your UI button to trigger the Spotify login
        <Button title="Login with Spotify" onPress={handleSpotifyLogin} />
    );
};

export default SignInScreen;
