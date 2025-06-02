import LoginForm from "@/components/login-form";

export default function Home() {
  return (
    <main className="w-screen h-[100svh] bg-[url('/static/images/authBg2.jpg')] bg-center bg-no-repeat bg-cover flex flex-row items-center justify-center gap-16">
      <div className="w-[30%] rounded-3xl bg-white flex flex-col shadow-md border-[7px] border-black/10 z-10">
        <LoginForm />
      </div>

      {/* <div className="w-[30%] flex flex-col gap-24 z-10">
        <span className="w-52 block text-white">
          <svg
            width="100%"
            viewBox="0 0 427 162"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M59.9656 0.669922L64.7336 15.3442H80.163L67.6804 24.4134L72.4483 39.0877L59.9656 30.0185L47.483 39.0877L52.2509 24.4134L39.7682 15.3442H55.1977L59.9656 0.669922Z"
              fill="currentColor"
            />
            <path
              d="M46.1157 40.8352V130.399C46.1157 141.479 59.9658 153.483 59.9658 153.483C59.9658 153.483 74.2776 141.941 74.2776 130.399V40.8352L120.445 74.0754C120.445 74.0754 120.444 111.471 120.445 130.399C120.445 149.328 98.6948 161.331 83.0493 161.331C67.4038 161.331 59.9658 153.483 59.9658 153.483C59.9658 153.483 50.7836 161.331 36.8823 161.331C22.981 161.331 1.33398 151.174 0.410457 130.399C-0.513071 109.624 0.410457 74.0754 0.410457 74.0754L46.1157 40.8352Z"
              fill="currentColor"
            />
            <path
              d="M161.713 75.3736H177.683V120.841C177.683 131.522 182.362 136.302 192.636 136.302C203.824 136.302 207.69 131.522 207.69 120.841V75.3736H223.659V120.841C223.659 138.947 213.183 149.729 192.636 149.729C171.58 149.729 161.713 138.947 161.713 120.841V75.3736ZM261.011 93.9879C274.336 93.9879 280.134 100.498 280.134 115.247V148H265.69V118.197C265.69 109.551 263.147 105.38 256.434 105.38C247.483 105.38 245.245 111.28 245.245 120.638V148H230.801V95.412H244.533V102.736H244.838C248.297 97.1412 254.196 93.9879 261.011 93.9879ZM286.418 75.3736H300.862V87.2746H286.418V75.3736ZM286.418 95.412H300.862V148H286.418V95.412ZM341.224 73.6444C357.499 73.6444 370.722 83.4093 372.553 99.7858H357.092C355.973 92.6656 349.158 87.0711 341.224 87.0711C328.205 87.0711 321.491 97.3446 321.491 111.992C321.491 125.622 327.899 136.302 341.224 136.302C350.379 136.302 356.38 130.403 357.703 120.028H373.164C371.536 138.337 359.025 149.729 341.224 149.729C319.05 149.729 305.521 133.251 305.521 111.992C305.521 90.5295 318.745 73.6444 341.224 73.6444ZM377.457 95.412H391.901V125.215C391.901 133.251 394.037 138.032 401.158 138.032C409.092 138.032 412.346 133.454 412.346 123.079V95.412H426.79V148H413.058V140.676H412.753C409.092 146.576 402.988 149.424 396.58 149.424C382.848 149.424 377.457 142.507 377.457 128.063V95.412Z"
              fill="currentColor"
            />
          </svg>
        </span>
        <div className="flex flex-col gap-2">
          <h1 className="text-white text-4xl font-semibold tracking-tight">
            Welcome to the future of sales
          </h1>
          <p className="text-white/80 text-lg tracking-tight">
            Our intuitive platform centralizes all your customer interactions,
            automates tedious tasks, and provides powerful insights - so you can
            focus on what truly matters: growing your business and delighting
            your customers.
          </p>
        </div>
      </div> */}

      <div className="absolute inset-0 bg-black/30 z-0"></div>
    </main>
  );
}
