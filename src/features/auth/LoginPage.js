import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import svgPaths from '../we-okas/project-managers/assets/svg-auth';
import bgVideo from '../../assets/bgVideo.gif';
import imgWeOkasLogo from '../../assets/weOkasLogo.png';
import { useGoogleLogin } from '@react-oauth/google';
import { loginWithPassword, sendOtp, loginWithGoogle } from './loginAuthService';
import useAuthStore from './authStore';
import { ROUTE_PATHS } from '../../config/constants';

function getRoleRedirectPath(user) {
  switch (user?.role) {
    case 'admin':        return ROUTE_PATHS.WEOKAS_DASHBOARD;
    case 'distributor':  return '/distributor/dashboard';
    case 'si':           return '/si/dashboard';
    case 'user':         return '/user/dashboard';
    case 'pm':
    default:             return '/dashboard';
  }
}

export default function LoginPage() {
  const navigate = useNavigate();
  const storeLogin = useAuthStore((s) => s.login);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password || !agreedToTerms) return;
    setError('');
    setIsLoading(true);
    try {
      const { token, user } = await loginWithPassword(email, password);
      storeLogin(user, token, null);
      navigate(getRoleRedirectPath(user));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpFlow = async () => {
    if (!email) {
      setError('Please enter your email address first');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await sendOtp(email);
      navigate('/auth/otp', { state: { email, keepLoggedIn } });
      // role-based redirect happens in OtpPage after OTP verification
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setError('');
      setIsLoading(true);
      try {
        const { token, user } = await loginWithGoogle(tokenResponse.access_token, keepLoggedIn);
        storeLogin(user, token, null, keepLoggedIn);
        navigate(getRoleRedirectPath(user));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Google sign-in failed');
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => setError('Google sign-in was cancelled or failed'),
    scope: 'openid email profile',
  });

  const handleGoogleLogin = () => {
    if (!agreedToTerms) {
      setError('Please agree to the Terms of Service first');
      return;
    }
    googleLogin();
  };

  return (
    <div className="bg-white flex items-center justify-center relative h-screen w-full overflow-hidden">
      <div className="flex flex-col h-full items-start overflow-clip p-[24px] md:p-[48px] relative w-full">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-full w-full object-cover" src={bgVideo} />
        </div>
        <div className="h-[24px] relative shrink-0 w-[120px] md:w-[160px] z-10 mb-[40px] md:mb-0">
          <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={imgWeOkasLogo} />
        </div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative md:absolute bg-[#f4f7fb] flex flex-col items-start justify-center md:left-auto md:right-[24px] lg:right-[60px] overflow-y-auto px-[24px] md:px-[60px] lg:px-[80px] py-[32px] md:py-[48px] lg:py-[60px] rounded-[16px] md:rounded-[24px] md:top-[24px] md:bottom-[24px] md:max-h-[calc(125vh-48px)] w-full md:w-[480px] lg:w-[546px] z-10 mt-auto md:mt-0"
        >
          <div className="flex flex-col gap-[24px] md:gap-[36px] items-start relative shrink-0 w-full">
            <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-none text-[#0a1e3f] text-[28px] md:text-[40px] tracking-[-1.2px]">Welcome back.</p>
            <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.5] text-[#5c7089] text-[14px] md:text-[16px]">Sign in to continue to your account.</p>

            {/* Email */}
            <div className="flex flex-col gap-[8px] items-start w-full">
              <p className="font-['Inter:Medium',sans-serif] font-medium leading-[1.2] text-[#0a1e3f] text-[11px] tracking-[2.2px] whitespace-nowrap">EMAIL ADDRESS</p>
              <div className="flex gap-[14px] items-center w-full">
                <div className="overflow-clip relative shrink-0 size-[18px]">
                  <div className="absolute inset-[27.78%_5.56%_16.67%_16.67%]">
                    <div className="absolute inset-[-6%_-4.29%]">
                      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.2 11.2">
                        <path d={svgPaths.p35e0c300} stroke="#5C7089" strokeWidth="1.2" />
                        <path d="M1.1 1.1L7.6 6.1L14.1 1.1" stroke="#5C7089" strokeLinecap="round" strokeWidth="1.2" />
                      </svg>
                    </div>
                  </div>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  placeholder="Enter your email"
                  className="flex-1 font-['Inter:Regular',sans-serif] font-normal leading-[1.3] min-w-px text-[#0a1e3f] text-[18px] bg-transparent border-none outline-none placeholder:text-[#5c7089]"
                />
              </div>
              <div className="bg-[#0a1e3f] h-[1.5px] relative shrink-0 w-full" />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-[12px] items-start w-full">
              <div className="flex flex-col gap-[8px] items-start w-full">
                <p className="font-['Inter:Medium',sans-serif] font-medium leading-[1.2] text-[#0a1e3f] text-[11px] tracking-[2.2px] whitespace-nowrap">PASSWORD</p>
                <div className="flex gap-[14px] items-center w-full">
                  <div className="overflow-clip relative shrink-0 size-[18px]">
                    <div className="absolute inset-[15.28%_16.67%_5.56%_16.67%]">
                      <div className="absolute inset-[-4.21%_-5%]">
                        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.2 15.45">
                          <path d={svgPaths.p30fb4380} stroke="#5C7089" strokeWidth="1.2" />
                          <path d={svgPaths.pf48e480} stroke="#5C7089" strokeLinecap="round" strokeWidth="1.2" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    placeholder="Enter your password"
                    className="flex-1 font-['Inter:Regular',sans-serif] font-normal leading-[1.3] min-w-px text-[#0a1e3f] text-[16px] bg-transparent border-none outline-none placeholder:text-[#5c7089]"
                  />
                  <motion.button type="button" onClick={() => setShowPassword(!showPassword)} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} className="relative shrink-0 size-[18px]">
                    <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
                      <g clipPath="url(#clip0_login)">
                        <path d={svgPaths.p15954c00} stroke="#5C7089" strokeWidth="1.2" />
                        <path d={svgPaths.p39561300} stroke="#5C7089" strokeWidth="1.2" />
                      </g>
                      <defs><clipPath id="clip0_login"><rect fill="white" height="18" width="18" /></clipPath></defs>
                    </svg>
                  </motion.button>
                </div>
                <div className="bg-[#e2e2e2] h-px relative shrink-0 w-full" />
              </div>

              <div className="flex h-[24px] items-center justify-between w-full">
                <motion.button type="button" onClick={() => setKeepLoggedIn(!keepLoggedIn)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex gap-[10px] items-center shrink-0">
                  <motion.div
                    animate={{ backgroundColor: keepLoggedIn ? '#0a1e3f' : '#ffffff', scale: keepLoggedIn ? 1.1 : 1 }}
                    transition={{ duration: 0.2 }}
                    className="relative rounded-[2px] shrink-0 size-[16px] flex items-center justify-center"
                  >
                    {keepLoggedIn && (
                      <motion.svg initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.2 }} className="block size-[10px]" fill="none" viewBox="0 0 10 10">
                        <path d="M2 5.45L4 7.25L8 3.25" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
                      </motion.svg>
                    )}
                    {!keepLoggedIn && <div aria-hidden="true" className="absolute border-[#5c7089] border-[1.2px] border-solid inset-0 pointer-events-none rounded-[2px]" />}
                  </motion.div>
                  <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.4] text-[#5c7089] text-[13px] whitespace-nowrap">Keep me logged in</p>
                </motion.button>
                <motion.button type="button" onClick={() => navigate('/auth/forgot-password')} whileHover={{ scale: 1.05, x: 2 }} whileTap={{ scale: 0.95 }} className="font-['Inter:Medium',sans-serif] font-medium leading-[1.4] text-[#0a1e3f] text-[13px] whitespace-nowrap hover:underline">
                  Forgot password?
                </motion.button>
              </div>
            </div>

            {/* OTP + Google Sign-In */}
            <div className="flex flex-col gap-[12px] items-center relative shrink-0 w-full">
              <div className="bg-[#e2e2e2] h-px relative shrink-0 w-full" />
              <motion.button
                type="button"
                onClick={handleOtpFlow}
                disabled={isLoading}
                whileHover={!isLoading ? { scale: 1.03, x: 2 } : {}}
                whileTap={!isLoading ? { scale: 0.97 } : {}}
                className="bg-[rgba(10,30,63,0.1)] flex gap-[8px] items-center px-[8px] py-[9px] rounded-[4px] shrink-0 hover:bg-[rgba(10,30,63,0.15)] transition-colors disabled:opacity-50"
              >
                <p className="font-['Inter:Medium',sans-serif] font-medium leading-[1.4] text-[#0a1e3f] text-[13px] whitespace-nowrap">or continue with OTP</p>
                <motion.svg animate={{ x: [0, 3, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} className="shrink-0 size-[12px]" fill="none" viewBox="0 0 12 12">
                  <path d="M4.25 9.5L7.75 6L4.25 2.5" stroke="#0A1E3F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" />
                </motion.svg>
              </motion.button>
              <p className="font-['Inter:Regular',sans-serif] font-normal text-[#5c7089] text-[12px]">or</p>
              <motion.button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                whileHover={!isLoading ? { scale: 1.02 } : {}}
                whileTap={!isLoading ? { scale: 0.98 } : {}}
                className="flex gap-[10px] items-center justify-center w-full px-[16px] py-[11px] rounded-[8px] border border-[#e2e2e2] bg-white hover:bg-[#f8f8f8] transition-colors disabled:opacity-50"
              >
                <svg className="shrink-0 size-[18px]" viewBox="0 0 18 18" fill="none">
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                  <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                </svg>
                <p className="font-['Inter:Medium',sans-serif] font-medium leading-[1.4] text-[#0a1e3f] text-[14px] whitespace-nowrap">continue with Google</p>
              </motion.button>
            </div>

            {/* Terms + Login */}
            <div className="flex flex-col gap-[20px] items-start w-full">
              <motion.button type="button" onClick={() => setAgreedToTerms(!agreedToTerms)} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="flex gap-[10px] h-[16px] items-center relative shrink-0 w-full">
                <motion.div
                  animate={{ backgroundColor: agreedToTerms ? '#0a1e3f' : '#ffffff', scale: agreedToTerms ? 1.1 : 1 }}
                  transition={{ duration: 0.2 }}
                  className="relative rounded-[2px] shrink-0 size-[16px] flex items-center justify-center"
                >
                  {agreedToTerms && (
                    <motion.svg initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.2 }} className="block size-[10px]" fill="none" viewBox="0 0 10 10">
                      <path d="M2 5.45L4 7.25L8 3.25" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
                    </motion.svg>
                  )}
                  {!agreedToTerms && <div aria-hidden="true" className="absolute border-[#5c7089] border-[1.2px] border-solid inset-0 pointer-events-none rounded-[2px]" />}
                </motion.div>
                <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.4] text-[#5c7089] text-[13px] whitespace-nowrap text-left">I agree to the Terms of Service and Privacy Policy.</p>
              </motion.button>

              {error && <p className="font-['Inter:Regular',sans-serif] text-[13px] text-red-500 w-full -mt-2">{error}</p>}

              <motion.button
                type="button"
                onClick={handleLogin}
                disabled={!agreedToTerms || !email || !password || isLoading}
                whileHover={agreedToTerms && email && password && !isLoading ? { scale: 1.02, y: -2 } : {}}
                whileTap={agreedToTerms && email && password && !isLoading ? { scale: 0.98 } : {}}
                className="bg-[#0a1e3f] h-[60px] relative rounded-[4px] shrink-0 w-full disabled:opacity-50 hover:bg-[#0a2a5a] transition-all disabled:hover:bg-[#0a1e3f] shadow-sm hover:shadow-lg disabled:shadow-none"
              >
                <div className="flex flex-row items-center justify-center rounded-[inherit] size-full">
                  <div className="flex gap-[14px] items-center justify-center px-[28px] size-full">
                    <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-none text-[16px] text-white tracking-[0.16px] whitespace-nowrap">
                      {isLoading ? 'Signing in…' : 'Log in'}
                    </p>
                    {!isLoading && (
                      <motion.svg
                        animate={agreedToTerms && email && password ? { x: [0, 3, 0] } : {}}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="shrink-0 size-[22px]" fill="none" viewBox="0 0 22 22"
                      >
                        <path d={svgPaths.p27317a00} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" />
                      </motion.svg>
                    )}
                  </div>
                </div>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
