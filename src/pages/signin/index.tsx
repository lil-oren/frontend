import AsyncButton from '@/components/AsyncButton/AsyncButton';
import GoogleButton from '@/components/GoogleButton/GoogleButton';
import { InputWithLabel } from '@/components/InputWithLabel/InputWithLabel';
import { IErrorResponse, ISignIn } from '@/interface/user';
import { withBasePath } from '@/lib/nextUtils';
import { UserClient } from '@/service/user/userClient';
import { Utils } from '@/utils';
import { LogIn } from 'lucide-react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

function SignInPage() {
  const router = useRouter();
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
  });
  const [isDataValid, setIsDataValid] = useState({
    email: true,
    password: true,
  });
  const [errorMessage, setErrorMessage] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleRegisterData = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: string,
  ) => {
    setRegisterData({ ...registerData, [key]: e.target.value });
  };

  const validateEmail = (): boolean => {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/gi;
    if (!emailRegex.test(registerData.email)) {
      setIsDataValid({ ...isDataValid, email: false });
      setErrorMessage({
        ...errorMessage,
        email: 'Please put in a valid email',
      });
      return false;
    }
    setIsDataValid({ ...isDataValid, email: true });
    setErrorMessage({ ...errorMessage, email: '' });
    return true;
  };

  const validatePassword = (): boolean => {
    if (registerData.password.length === 0) {
      setIsDataValid({ ...isDataValid, password: false });
      setErrorMessage({
        ...errorMessage,
        password: 'Please put in your password',
      });
      return false;
    }
    setIsDataValid({ ...isDataValid, password: true });
    setErrorMessage({ ...errorMessage, password: '' });
    return true;
  };

  const validateAll = (): boolean => {
    let isContinue: boolean = true;
    if (!validateEmail()) {
      isContinue = false;
    }
    if (!validatePassword()) {
      isContinue = false;
    }
    return isContinue;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAll()) return;
    setIsLoading(true);
    try {
      const newRegisterData: ISignIn = {
        email: registerData.email.toLowerCase(),
        password: registerData.password,
      };
      const response = await UserClient.postSignIn(registerData);
      Utils.notify('Your sign in is successful', 'success', 'colored');
      if (router.query.prev) {
        router.replace(router.query.prev as string);
      } else {
        router.replace('/');
      }
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        handleErrorAuthResponse(error.response.data.message);
        return;
      }
      Utils.handleGeneralError(error);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleErrorAuthResponse = (message: IErrorResponse | string) => {
    if (message instanceof Object) {
      if (message.email !== undefined) {
        setIsDataValid({ ...isDataValid, email: false });
        setErrorMessage({ ...errorMessage, email: message.email });
      }
      if (message.password !== undefined) {
        setIsDataValid({ ...isDataValid, password: false });
        setErrorMessage({ ...errorMessage, password: message.password });
      }
    } else {
      Utils.notify(message, 'error', 'colored');
    }
  };

  return (
    <>
      <Head>
        <title>Signin - LilOren</title>
        <meta
          data-rh="true"
          name="viewport"
          content="initial-scale=1, minimum-scale=1, maximum-scale=5, user-scalable=no, width=device-width"
        />
        <meta data-rh="true" property="site_name" content="LilOren" />
        <meta
          data-rh="true"
          name="description"
          content="Mal online terbesar Indonesia, tempat berkumpulnya toko / online shop terpercaya se Indonesia. Jual beli online semakin aman dan nyaman di LilOren."
        ></meta>
        <link rel="icon" href={withBasePath('favicon.ico')} />
      </Head>
      <section className="bg-gradient-to-t from-[#FF7337] to-[#F99116] flex flex-col justify-center items-center gap-5 min-h-screen sm:py-6 xl:flex-row xl:justify-between xl:gap-10 xl:px-40 xl:items-start xl:py-20">
        <div className="hidden sm:flex flex-col items-center justify-center xl:justify-start xl:min-h-full xl:flex-1 xl:gap-40">
          <Link
            href="/"
            className="font-bold text-3xl text-primary-foreground lg:text-4xl xl:w-full xl:text-left"
          >
            <h1>LilOren</h1>
          </Link>
          <div className="hidden relative aspect-square w-[470px] xl:block">
            <Image
              src={withBasePath('Logo_.svg')}
              alt="LilOren's logo"
              width="470"
              height="470"
              sizes="40vw"
            />
          </div>
        </div>
        <div className="container pb-16 pt-6 flex flex-col items-center justify-center gap-5 bg-primary-foreground sm:max-w-lg sm:pb-6 sm:rounded-lg xl:my-auto">
          <h1 className="font-bold text-2xl text-primary sm:hidden">LilOren</h1>
          <div className="rounded-lg w-full flex flex-col items-baseline justify-center">
            <h1 className="font-light text-xl w-full text-left lg:text-2xl">
              Sign In
            </h1>
            <form
              className="mt-5 flex flex-col gap-3 w-full"
              onSubmit={handleSubmit}
            >
              <InputWithLabel
                type="email"
                label="Email"
                id="email-input"
                labelStyling="font-light"
                value={registerData.email}
                onChange={(e) => handleRegisterData(e, 'email')}
                isValid={isDataValid.email}
                onBlur={validateEmail}
                validation={errorMessage.email}
                disabled={isLoading}
                required
              />
              <InputWithLabel
                type="password"
                label="Password"
                id="password-input"
                labelStyling="font-light"
                value={registerData.password}
                onChange={(e) => handleRegisterData(e, 'password')}
                isValid={isDataValid.password}
                onBlur={validatePassword}
                validation={errorMessage.password}
                disabled={isLoading}
                required
              />
              <AsyncButton
                className="text-sm lg:text-base"
                type="submit"
                isLoading={isLoading}
              >
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </AsyncButton>
            </form>
            <div className="flex items-center w-full justify-between gap-3 mt-2">
              <div className="w-full h-px bg-gray-300" />
              <p className="text-sm text-gray-300 font-normal">OR</p>
              <div className="w-full h-px bg-gray-300" />
            </div>
            <div className="w-full mt-2">
              <GoogleButton />
            </div>
          </div>
          <p className="font-extralight mt-3 w-full text-center text-base lg:text-lg">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-normal underline">
              Register
            </Link>
          </p>

          <Link href="/forgot-password" className="font-normal underline">
            Forgot Password
          </Link>
        </div>
      </section>
    </>
  );
}

export default SignInPage;
