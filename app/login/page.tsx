import LoginForm from "./LoginForm";

export default async function Login() {
  return (
    <div className="min-h-screen px-4 pt-32 pb-4">
      <h1 className="my-6 text-5xl font-semibold underline">Login</h1>
      <LoginForm />
    </div>
  );
}
