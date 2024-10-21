"use client";

import LandingIntro from '@/features/login/landing-intro';
import InputText from '@/components/input/input-text';
import ErrorText from '@/components/typography/error-text';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux'; // Import useDispatch
import { AppDispatch } from './../../../lib/store'; // Adjust the import path as necessary
import { loginUser } from '@/features/common/userSlice'; // Import the loginUser thunk
import Link from 'next/link';
import { useAuth } from '@/lib/AuthProvider';

interface LoginObj {
  emailId: string;
  password: string;
}

function Login(): JSX.Element {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>(); // Type the dispatch
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const {login} = useAuth();
  const [loginObj, setLoginObj] = useState<LoginObj>({
    emailId: '',
    password: '',
  });

  const submitForm = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setErrorMessage('');
    if (loading) return;

    if (!loginObj.emailId || !loginObj.password) {
      setErrorMessage('Email and Password are required!');
      return;
    }

    setLoading(true);

    // Dispatch the loginUser thunk
    const resultAction = await dispatch(loginUser({ email: loginObj.emailId, password: loginObj.password }));

    if (loginUser.fulfilled.match(resultAction)) {
      // Redirect to dashboard or home page after successful login
      const { token } = resultAction.payload;
      await loggedInUser({token: token!})
      console.log('Login successful, redirecting to dashboard'); // Debug log
      router.push('/dashboard');
    } else {
      console.error('Login failed:', resultAction.payload); // Debug log
      setErrorMessage(resultAction.payload as string); // Handle error response
    }

    setLoading(false);
  };

  const loggedInUser = async ({ token }: { token: string }) => {
    await login(token); // Automatically log in the user after signup
    router.push('/dashboard'); // Redirect to dashboard or home page after signup
};
  

  const updateFormValue = (updateType: string, value: string): void => {
    setErrorMessage('');
    setLoginObj({ ...loginObj, [updateType]: value });
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center">
      <div className="card mx-auto w-full max-w-5xl shadow-xl">
        <div className="grid md:grid-cols-2 grid-cols-1 bg-base-100 rounded-xl">
          <div>
            <LandingIntro />
          </div>
          <div className="py-24 px-10">
            <form onSubmit={(e) => submitForm(e)}>
              <div className="mb-4">
                <p className="text-center text-lg md:mt-0 mt-6 mb-12 font-semibold">Enter Email and Password to Continue</p>

                <InputText
                  type="email"
                  value={loginObj.emailId}
                  updateType="emailId"
                  containerStyle="mt-4"
                  labelTitle="Enter your Email Id"
                  placeholder="Ex - dashwind@gmail.com"
                  updateFormValue={updateFormValue}
                />

                <InputText
                  type="password"
                  value={loginObj.password}
                  updateType="password"
                  containerStyle="mt-4"
                  labelTitle="Enter your Password"
                  placeholder="Enter your password"
                  updateFormValue={updateFormValue}
                />
              </div>

              <div className="mt-8">
                {errorMessage && <ErrorText styleClass="mt-8">{errorMessage}</ErrorText>}
                <button type="submit" className="btn mt-2 w-full btn-primary" disabled={loading}>
                  {loading && <span className="loading loading-spinner"></span>} Login
                </button>
              </div>
            </form>
            {/* <div className="mt-4 text-center">
              <p className="text-sm">
                Don't have an account?{' '}
                <Link href="/signup" className="text-primary underline">
                  Sign up here
                </Link>
              </p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
