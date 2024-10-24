import * as React from 'react';
import { AppProvider } from '@toolpad/core/AppProvider';
import { SignInPage } from '@toolpad/core/SignInPage';
import { useTheme } from '@mui/material/styles';

// preview-start
const providers = [
    { id: 'github', name: 'GitHub' },
    { id: 'google', name: 'Google' },
    { id: 'facebook', name: 'Facebook' },
    { id: 'twitter', name: 'Twitter' },
    { id: 'linkedin', name: 'LinkedIn' },
];

// preview-end

const sendTokenToBackend = async (providerId, token) => {
    try {
        const response = await fetch('https://localhost:7064/api/OAuth/callback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                providerId,
                token,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to authenticate user');
        }

        const data = await response.json();
        return data; // Should contain userId and token
    } catch (error) {
        console.error('Error while creating user in the database:', error);
    }
};

const signIn = async (provider) => {
    try {
        const promise = new Promise((resolve) => {
            setTimeout(() => {
                const fakeToken = `fake-token-${provider.id}`;
                console.log(`Sign in with ${provider.id}, token: ${fakeToken}`);
                resolve({ token: fakeToken });
            }, 500);
        });

        const { token } = await promise;

        const result = await sendTokenToBackend(provider.id, token);

        if (result) {
            localStorage.setItem('authToken', result.authToken);
            localStorage.setItem('userId', result.userId);
        }

        return result;
    } catch (error) {
        console.error('Sign-in failed:', error);
    }
};

export default function OAuthSignInPage() {
    const theme = useTheme();

    return (
        <AppProvider theme={theme}>
            <SignInPage signIn={signIn} providers={providers} />
        </AppProvider>
    );
}