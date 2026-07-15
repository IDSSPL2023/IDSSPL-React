import { useForm } from "react-hook-form";
import { ArrowRight, Building2, ChevronDown, Lock, User } from 'lucide-react'
import Image from "@/components/ui/Image"
import { useRouter } from "@/lib/navigation"


type LoginForm = {
  userId: string;
  password: string;
  branchCode: string;
};

const LoginPage = () => {

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = (data: LoginForm) => {
    console.log(data);
    router.push("/otp-verification");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-white to-[#D0E7F6] flex dark:from-slate-950 dark:to-slate-950">
      {/* Left */}
      <div>
        <Image
          src="/login.png"
          alt="Login"
          width={1000}
          height={1000}
          className="h-screen w-auto"
        />      </div>
      {/* Right */}
      <div className="flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-sm">
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Logo */}
            <div className="flex justify-center">
              <Image
                src="/logo.png"
                alt="logo"
                width={250}
                height={250}
                priority
              />
            </div>

            {/* Heading */}
            <h1 className="mt-3 text-center text-[30px] font-serif text-[#2C3193] leading-none">
              CBS Software Bank
            </h1>

            <h2 className=" text-center text-[25px] font-medium text-[#222] dark:text-slate-100">
              Welcome Back
            </h2>

            <p className="mt-1 text-center text-sm text-gray-600 leading-5 dark:text-slate-400">
              Empowering banks with a secure, future-ready platform that keeps
             your customers' trust at the heart of every transaction.
            </p>

            {/* User ID */}
            <div className="mt-6">
              <label className="text-[#2C3193] font-medium text-[15px] dark:text-indigo-300">
                User ID <span className="text-gray-500 dark:text-slate-400">| यूजर आयडी</span>
                <span className="text-red-500 dark:text-red-400">*</span>
              </label>

              <div className={`mt-1 flex items-center border rounded-md h-10 px-4 bg-white dark:bg-slate-900 ${errors.userId ? "border-red-500 dark:border-red-500" : "border-[#5B63C6] dark:border-slate-700"}`}>
                <User size={18} className="text-[#5B63C6] dark:text-slate-400" />

                <input
                  {...register("userId", {
                    required: "User ID is required",
                    minLength: {
                      value: 3,
                      message: "User ID must be at least 3 characters",
                    },
                  })}
                  placeholder="Enter Your User Id"
                  className="ml-3 flex-1 outline-none text-sm placeholder:text-gray-400 dark:text-slate-100 dark:placeholder:text-slate-500"
                />
              </div>
              {errors.userId && (
                <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.userId.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="mt-4">
              <label className="text-[#2C3193] font-medium text-[15px] dark:text-indigo-300">
                Password <span className="text-gray-500 dark:text-slate-400">| पासवर्ड</span>
                <span className="text-red-500 dark:text-red-400">*</span>
              </label>

              <div className={`mt-1 flex items-center border rounded-md h-10 px-4 bg-white dark:bg-slate-900 ${errors.password ? "border-red-500 dark:border-red-500" : "border-[#5B63C6] dark:border-slate-700"}`}>
                <Lock size={18} className="text-[#5B63C6] dark:text-slate-400" />

                <input
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  placeholder="Enter Your Password"
                  className="ml-3 flex-1 outline-none text-sm placeholder:text-gray-400 dark:text-slate-100 dark:placeholder:text-slate-500"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.password.message}</p>
              )}
            </div>

            {/* Branch */}
            <div className="mt-6">
              <label className="text-[#2C3193] font-medium text-[15px] dark:text-indigo-300">
                Branch Code <span className="text-gray-500 dark:text-slate-400">| शाखा कोड</span>
                <span className="text-red-500 dark:text-red-400">*</span>
              </label>

              <div className={`mt-1 flex items-center border rounded-md h-10 px-4 bg-white dark:bg-slate-900 ${errors.branchCode ? "border-red-500 dark:border-red-500" : "border-[#5B63C6] dark:border-slate-700"}`}>
                <Building2 size={18} className="text-[#5B63C6] dark:text-slate-400" />

                <select
                  {...register("branchCode", {
                    required: "Branch code is required",
                  })}
                  className="ml-3 flex-1 outline-none bg-transparent text-sm appearance-none text-gray-500 dark:text-slate-300"
                >
                  <option value="">Select Branch Code</option>
                  <option>001</option>
                  <option>002</option>
                  <option>003</option>
                </select>

                <ChevronDown className="text-[#2C3193] dark:text-indigo-300" size={20} />
              </div>
              {errors.branchCode && (
                <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.branchCode.message}</p>
              )}
            </div>

            {/* Button */}
            <button
              className="mt-10 h-12 w-full rounded-xl bg-[#1668C8] text-white font-medium hover:bg-[#0F5AB3] transition flex items-center justify-center gap-2"
              type="submit"
            >
              Proceed to OTP Verification
              <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage