import LoginForm from "@/components/login-form";

export default function Home() {
  return (
    <main className="w-screen h-[100svh] bg-[url('/static/images/authBg2.jpg')] bg-center bg-no-repeat bg-cover flex flex-row items-center justify-center gap-16">
      <div className="w-[30%] rounded-3xl bg-white flex flex-col shadow-md border-[7px] border-black/10 z-10">
        <LoginForm />
      </div>

      <div className="absolute inset-0 bg-black/30 z-0"></div>
    </main>
  );
}
