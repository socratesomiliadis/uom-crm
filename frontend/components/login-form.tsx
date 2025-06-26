"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function LoginForm() {
  const router = useRouter();
  const { login, isLoading: authLoading } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(username, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full p-12 text-black">
      <span className="w-44 block text-black">
        <svg
          width="100%"
          viewBox="0 0 509 162"
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
            d="M194.568 73.6444C210.843 73.6444 224.066 83.4093 225.897 99.7858H210.436C209.317 92.6656 202.502 87.0711 194.568 87.0711C181.548 87.0711 174.835 97.3446 174.835 111.992C174.835 125.622 181.243 136.302 194.568 136.302C203.723 136.302 209.724 130.403 211.046 120.028H226.508C224.88 138.337 212.369 149.729 194.568 149.729C172.394 149.729 158.865 133.251 158.865 111.992C158.865 90.5295 172.089 73.6444 194.568 73.6444ZM230.801 95.412H245.245V125.215C245.245 133.251 247.381 138.032 254.501 138.032C262.435 138.032 265.69 133.454 265.69 123.079V95.412H280.134V148H266.402V140.676H266.097C262.435 146.576 256.332 149.424 249.924 149.424C236.192 149.424 230.801 142.507 230.801 128.063V95.412ZM316.729 93.9879C318.154 93.9879 319.171 94.2931 319.883 94.4965V107.923C318.459 107.618 316.729 107.415 314.695 107.415C304.218 107.415 300.455 114.637 300.455 124.3V148H286.011V95.412H299.743V105.177H299.946C302.692 98.5652 309.508 93.9879 316.729 93.9879ZM342.982 93.9879C359.562 93.9879 368.615 107.008 368.615 122.571C368.615 123.384 368.513 125.215 368.513 125.215H330.573C330.98 134.268 335.15 138.54 343.389 138.54C348.882 138.54 353.764 135.387 354.883 131.725H367.598C363.733 143.626 355.595 149.424 342.982 149.424C326.3 149.424 316.129 137.93 316.129 121.757C316.129 105.889 327.114 93.9879 342.982 93.9879ZM330.573 116.061H354.069C352.645 108.127 349.187 104.872 342.474 104.872C335.455 104.872 331.183 109.144 330.573 116.061ZM402.306 93.9879C410.138 93.9879 415.224 97.2429 417.665 102.736C421.53 97.1412 427.227 93.9879 433.635 93.9879C446.655 93.9879 452.758 101.108 452.758 112.704V148H438.314V117.586C438.314 110.67 437.297 105.38 429.464 105.38C422.649 105.38 419.801 110.161 419.801 118.604V148H405.357V116.976C405.357 110.161 404.34 105.38 396.61 105.38C393.253 105.38 386.845 107.72 386.845 117.383V148H372.401V95.412H386.031V102.532H386.234C390.303 96.7343 395.796 93.9879 402.306 93.9879ZM483.299 93.9879C498.658 93.9879 506.287 99.1755 506.287 108.94V136.811C506.287 140.981 506.795 145.864 508.118 148H493.47C492.962 146.373 492.555 144.643 492.453 142.914C488.384 147.186 482.18 149.424 474.754 149.424C463.972 149.424 456.852 143.83 456.852 133.658C456.852 128.572 458.479 125.012 461.429 122.469C464.786 119.621 469.668 118.095 478.416 117.18C487.774 116.162 491.843 115.349 491.843 110.67C491.843 104.668 487.469 103.651 482.586 103.651C476.585 103.651 473.432 106.092 472.923 111.585H458.479C459.09 100.091 468.549 93.9879 483.299 93.9879ZM471.296 133.048C471.296 137.218 473.839 139.761 480.145 139.761C487.876 139.761 491.843 135.59 491.843 127.86V122.265C490.52 123.486 487.978 124.198 483.095 124.808C475.67 125.724 471.296 127.351 471.296 133.048Z"
            fill="currentColor"
          />
        </svg>
      </span>
      <span className="uppercase tracking-tight mt-10">Welcome Back</span>
      <span className="text-3xl text-black font-medium tracking-tight">
        Login to your account
      </span>
      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col gap-6 mt-8 relative"
      >
        <div className="w-full flex flex-col gap-2 relative">
          <label className="absolute text-base bg-white -top-2.5 px-3 left-3">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="text-black border-[1px] border-black/60 rounded-xl px-4 py-4 text-lg focus:outline-none"
          />
        </div>
        <div className="w-full flex flex-col gap-2 relative">
          <label className="absolute text-base bg-white -top-2.5 px-3 left-3">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="text-black border-[1px] border-black/60 rounded-xl px-4 py-4 text-lg focus:outline-none"
          />
          <button
            type="button"
            className="absolute top-1/2 -translate-y-1/2 right-4 w-6 cursor-pointer"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {!showPassword ? (
              <svg
                width="100%"
                viewBox="0 0 22 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M11 2.97044e-10C14.9517 -2.99997e-05 18.7906 2.27233 21.3567 6.5831C21.8762 7.4558 21.8762 8.5441 21.3567 9.4168C18.7906 13.7276 14.9517 16 11 16C7.04829 16 3.20943 13.7277 0.643287 9.4169C0.123787 8.5442 0.123787 7.4559 0.643287 6.5832C3.20943 2.27243 7.04828 3.00003e-05 11 2.97044e-10ZM7.5 8C7.5 6.067 9.067 4.5 11 4.5C12.933 4.5 14.5 6.067 14.5 8C14.5 9.933 12.933 11.5 11 11.5C9.067 11.5 7.5 9.933 7.5 8Z"
                  fill="black"
                />
              </svg>
            ) : (
              <svg
                width="100%"
                viewBox="0 0 22 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M1.29289 0.29289C1.68342 -0.09763 2.31658 -0.09763 2.70711 0.29289L6.34782 3.93361L6.35069 3.93647L17.064 14.6498L17.0666 14.6524L20.7071 18.2929C21.0976 18.6834 21.0976 19.3166 20.7071 19.7071C20.3166 20.0976 19.6834 20.0976 19.2929 19.7071L16.2031 16.6173C13.684 18.0218 10.8704 18.3633 8.19337 17.6109C5.27083 16.7896 2.59188 14.6896 0.6441 11.4181C0.12514 10.5464 0.12292 9.4581 0.64298 8.5844C1.63082 6.92468 2.8063 5.56632 4.10844 4.52265L1.29289 1.70711C0.90237 1.31658 0.90237 0.68342 1.29289 0.29289ZM7.00024 10.0002C7.00024 9.2588 7.20253 8.5639 7.5542 7.96842L9.0678 9.482C9.0237 9.6472 9.0002 9.8209 9.0002 10.0002C9.0002 11.1048 9.8957 12.0002 11.0002 12.0002C11.1796 12.0002 11.3532 11.9768 11.5184 11.9326L13.0321 13.4463C12.4366 13.7979 11.7416 14.0002 11.0002 14.0002C8.79111 14.0002 7.00024 12.2094 7.00024 10.0002Z"
                  fill="black"
                />
                <path
                  d="M21.3562 11.4168C20.7539 12.4285 20.0816 13.3279 19.3541 14.112L7.76172 2.51959C8.81578 2.17487 9.9033 2.00001 10.9995 2C14.9512 1.99997 18.79 4.27233 21.3562 8.5831C21.8757 9.4558 21.8757 10.5441 21.3562 11.4168Z"
                  fill="black"
                />
              </svg>
            )}
          </button>
        </div>
        <button
          type="submit"
          disabled={isLoading || authLoading}
          className="w-full cursor-pointer py-4 text-white bg-[#131313] rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading || authLoading ? "Signing in..." : "Continue"}
        </button>
        {error && <p className="text-red-500 absolute -bottom-8">{error}</p>}
      </form>
      <p className="text-black tracking-tight mt-12 text-lg">
        Don't have an account?{" "}
        <Link href="/register" className="text-blue-500">
          Register
        </Link>
      </p>
    </div>
  );
}
