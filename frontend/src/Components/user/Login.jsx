import React, { useEffect, useState } from 'react';
import SetupAxiosInstances from '../Instances/SetupAxiosInstances';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [obj, setObj] = useState({});
  let navigate = useNavigate();
  const axiosInstances = SetupAxiosInstances(navigate);
  function handleSubmit(e) {
    e.preventDefault();
    const obj1 = {
      userName: e.target.username.value,
      password: e.target.password.value,
    };
    setObj({ ...obj, ...obj1 });
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axiosInstances.post("http://localhost:8080/login", obj);
        console.log(res.data.uid);
        const token = res.data.uid;
        localStorage.setItem("token",token);
        let date = new Date();
        let expire = date.setTime(date.getTime()+3600000);
        document.cookie=`uid=${res.data.uid},expires=${expire}`
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData(); // Call the async function
  }, [obj]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <input id="username" name="username" type="text" autoComplete="username" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Username" />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input id="password" name="password" type="password" autoComplete="current-password" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Password" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input id="remember_me" name="remember_me" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
              <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
