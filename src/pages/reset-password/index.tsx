import AsyncButton from '@/components/AsyncButton/AsyncButton';
import { InputWithLabel } from '@/components/InputWithLabel/InputWithLabel';
import { withBasePath } from '@/lib/nextUtils';
import { redisClient } from '@/lib/redis';
import { authClient } from '@/service/auth/AuthClient';
import { Utils } from '@/utils';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { FormEventHandler, PropsWithoutRef, useState } from 'react';

type Props = {
  code: string;
};

function SignInPage({ code: reset_code }: PropsWithoutRef<Props>) {
  const [loading, setLoading] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');
  const [passwordValidation, setPasswordValidation] = useState<string>();
  const [passwordConfirmationValidation, setPasswordConfirmationValidation] =
    useState<string>();

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (password !== passwordConfirmation) {
      setPasswordConfirmationValidation(`Password doesn't match`);
      return;
    }

    if (password.length < 8) {
      setPasswordValidation(`Password should be >= 8 character long`);
    }

    setLoading(true);
    await authClient
      .resetPassword({
        password,
        reset_code,
      })
      .then((res) => {
        Utils.notify('Successfully reset password', 'success', 'colored');

        setPassword('');
        setPasswordConfirmation('');
      })
      .catch((err) => {
        Utils.notify(err.request.message, 'error', 'colored');
      });
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Reset Password - LilOren</title>
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
      <section className="bg-gradient-to-t from-[#FF7337] to-[#F99116] flex flex-col justify-center items-center gap-5 sm:min-h-screen sm:py-6 xl:flex-row xl:justify-between xl:gap-10 xl:px-40 xl:items-start xl:py-20">
        <div className="hidden sm:flex flex-col items-center justify-center xl:justify-start xl:min-h-full xl:flex-1 xl:gap-40">
          <h1 className="font-bold text-3xl text-primary-foreground lg:text-4xl xl:w-full xl:text-left">
            LilOren
          </h1>
          <div className="hidden relative aspect-square w-[470px] xl:block">
            <Image
              src={withBasePath('Logo_.svg')}
              alt="Google's logo"
              fill
              sizes="40vw"
            />
          </div>
        </div>
        <div className="container pb-16 pt-6 flex flex-col items-center justify-center gap-5 bg-primary-foreground sm:max-w-lg sm:pb-6 sm:rounded-lg xl:my-auto">
          <h1 className="font-bold text-2xl text-primary sm:hidden">LilOren</h1>
          <div className="rounded-lg w-full flex flex-col items-baseline justify-center">
            <h1 className="font-light text-xl w-full text-left lg:text-2xl">
              Reset Password
            </h1>
            <form
              className="mt-5 flex flex-col gap-3 w-full"
              onSubmit={handleSubmit}
            >
              <InputWithLabel
                type="password"
                label="Password"
                id="password-input"
                labelStyling="font-light"
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
                disabled={loading}
                isValid={!passwordValidation}
                validation={passwordValidation}
                required
              />
              <InputWithLabel
                type="password"
                label="Password Confirmation"
                id="password-confirmation-input"
                labelStyling="font-light"
                value={passwordConfirmation}
                onChange={(ev) => setPasswordConfirmation(ev.target.value)}
                disabled={loading}
                isValid={!passwordConfirmationValidation}
                validation={passwordConfirmationValidation}
                required
              />
              <AsyncButton
                className="text-sm lg:text-base"
                type="submit"
                disabled={loading}
              >
                Reset Password
              </AsyncButton>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

export default SignInPage;

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const code = ctx.query.code;

  if (!code) {
    return {
      notFound: true,
    };
  }

  await redisClient.connect();
  const res = await redisClient.EXISTS(`reset_password:${code}`);
  if (!res) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      code: code as string,
    },
  };
};
