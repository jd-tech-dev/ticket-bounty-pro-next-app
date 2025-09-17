import Link from 'next/link';
import { CardCompact } from '@/components/card-compact';
import { SignInForm } from '@/features/auth/components/sign-in-form';
import { passwordForgotPath, signUpPath } from '@/paths';

const SignInPage = () => {
  return (
    <div className="h-full flex flex-col justify-center items-center">
      <CardCompact
        title="Sign In"
        description="Sign in to your account"
        className="w-full max-w-[420px] animate-fade-in-from-top"
        content={<SignInForm />}
        footer={
          <>
            <Link className="text-sm text-muted-foreground" href={signUpPath()}>
              No account yet?
            </Link>

            <Link
              className="text-sm text-muted-foreground ml-auto"
              href={passwordForgotPath()}
            >
              Forgot Password?
            </Link>
          </>
        }
      />
    </div>
  );
};

export default SignInPage;
