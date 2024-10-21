"use client";

import LandingIntro from '@/features/login/landing-intro';
import InputText from '@/components/input/input-text';
import ErrorText from '@/components/typography/error-text';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthProvider';
import Link from 'next/link';
import { registerUser } from '../../../features/common/userSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../lib/store';

interface SignupObj {
    emailId: string;
    password: string;
    confirmPassword: string;
}

function Signup(): JSX.Element {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: '' });
    const { login } = useAuth();
    const dispatch = useDispatch<AppDispatch>();

    const [signupObj, setSignupObj] = useState<SignupObj>({
        emailId: '',
        password: '',
        confirmPassword: '',
    });

    const submitForm = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setErrorMessage('');
        if (loading) return;

        if (!formData.name || !signupObj.emailId || !signupObj.password || !signupObj.confirmPassword || !formData.role) {
            setErrorMessage('All fields are required!');
            return;
        }

        // Check if passwords match
        if (signupObj.password !== signupObj.confirmPassword) {
            setErrorMessage('Passwords do not match!');
            return;
        }

        // Dispatch the registerUser thunk
        setLoading(true);
        const { emailId, password } = signupObj; // Extract values for the dispatch
        const resultAction = await dispatch(registerUser({ name: formData.name, email: emailId, password, role: formData.role }));

        // Handle the result
        if (registerUser.fulfilled.match(resultAction)) {
            const { token } = resultAction.payload; // Now this should work
            await loginUser({ token: token! });
        } else {
            // Handle error
            setErrorMessage('Registration failed'); // Update your error handling
        }
        setLoading(false);
    };

    const loginUser = async ({ token }: { token: string }) => {
        await login(token); // Automatically log in the user after signup
        router.push('/dashboard'); // Redirect to dashboard or home page after signup
    };

    const updateFormValue = (updateType: string, value: string): void => {
        setErrorMessage('');
        if (updateType === 'name') {
            setFormData({ ...formData, name: value });
        } else {
            setSignupObj({ ...signupObj, [updateType]: value });
        }
    };

    const updateRole = (role: string) => {
        setErrorMessage('');
        setFormData({ ...formData, role });
    };

    return (
        <div className="min-h-screen bg-base-200 flex items-center">
            <div className="card mx-auto w-full max-w-5xl shadow-xl">
                <div className="grid md:grid-cols-2 grid-cols-1 bg-base-100 rounded-xl">
                    <div>
                        <LandingIntro />
                    </div>
                    <div className="py-24 px-10">
                        <form onSubmit={submitForm}>
                            <div className="mb-4">
                                <p className="text-center text-lg md:mt-0 mt-6 mb-12 font-semibold">Create an Account</p>

                                <InputText
                                    type="text"
                                    value={formData.name} // Pass the value from state
                                    updateType="name"
                                    containerStyle="mt-4"
                                    labelTitle="Enter your Name"
                                    placeholder="Ex - John Doe"
                                    updateFormValue={updateFormValue}
                                />

                                <InputText
                                    type="email"
                                    value={signupObj.emailId} // Pass the value from state
                                    updateType="emailId"
                                    containerStyle="mt-4"
                                    labelTitle="Enter your Email Id"
                                    placeholder="Ex - dashwind@gmail.com"
                                    updateFormValue={updateFormValue}
                                />

                                <InputText
                                    type="password"
                                    value={signupObj.password} // Pass the value from state
                                    updateType="password"
                                    containerStyle="mt-4"
                                    labelTitle="Enter your Password"
                                    placeholder="Enter your password"
                                    updateFormValue={updateFormValue}
                                />

                                <InputText
                                    type="password"
                                    value={signupObj.confirmPassword} // Pass the value from state
                                    updateType="confirmPassword"
                                    containerStyle="mt-4"
                                    labelTitle="Confirm your Password"
                                    placeholder="Confirm your password"
                                    updateFormValue={updateFormValue}
                                />


                                <select
                                    onChange={(e) => updateRole(e.target.value)}
                                    value={formData.role}
                                    className="input input-bordered w-full mt-4 text-white bg-neutral-800 border-gray-600 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="" className="text-gray-500">Select Role</option>
                                    <option value="staff" className="text-white">Staff</option>
                                    <option value="admin" className="text-white">Admin</option>
                                    <option value="supervisor" className="text-white">Supervisor</option>
                                </select>





                            </div>

                            <div className="mt-8">
                                {errorMessage && <ErrorText styleClass="mt-8">{errorMessage}</ErrorText>}
                                <button type="submit" className="btn mt-2 w-full btn-primary">
                                    {loading && <span className="loading loading-spinner"></span>} Sign Up
                                </button>
                            </div>
                        </form>
                        <div className="mt-4 text-center">
                            <p className="text-sm">
                                Already have an account?{' '}
                                <Link href="/login" className="text-primary underline">
                                    Login here
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;
