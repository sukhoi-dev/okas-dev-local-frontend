import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import svgPaths from '../we-okas/project-managers/assets/svg-auth';
import { initiateGoogleLogin } from './googleAuth';
import bgVideo from '../../assets/bgVideo.gif';
import imgWeOkasLogo from '../../assets/weOkasLogo.png';
import { sendOtp } from './loginAuthService';

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !agreedToTerms) return;
    setError('');
    setIsLoading(true);
    try {
      await sendOtp(email);
      navigate('/auth/otp', { state: { email, keepLoggedIn } });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
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
          <div className="flex flex-col gap-[28px] md:gap-[40px] items-start relative shrink-0 w-full">

            {/* Heading */}
            <div className="flex flex-col gap-[10px] items-start w-full">
              <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-none text-[#0a1e3f] text-[28px] md:text-[40px] tracking-[-1.2px]">Welcome back.</p>
              <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.5] text-[#5c7089] text-[14px] md:text-[16px]">Sign in to continue to your account.</p>
            </div>

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

            {/* Keep me logged in */}
            <motion.button
              type="button"
              onClick={() => setKeepLoggedIn(!keepLoggedIn)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex gap-[10px] items-center shrink-0"
            >
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

            {/* Google */}
            <div className="flex flex-col gap-[16px] items-center w-full">
              <div className="bg-[#e2e2e2] h-px relative shrink-0 w-full" />
              <motion.button
                type="button"
                onClick={() => { setError(''); initiateGoogleLogin(); }}
                disabled={isLoading}
                whileHover={!isLoading ? { scale: 1.03, x: 2 } : {}}
                whileTap={!isLoading ? { scale: 0.97 } : {}}
                className="bg-[rgba(10,30,63,0.1)] flex gap-[8px] items-center px-[8px] py-[9px] rounded-[4px] shrink-0 hover:bg-[rgba(10,30,63,0.15)] transition-colors disabled:opacity-50"
              >
                <svg className="shrink-0 size-[14px]" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path d="M43.611 20.083H42V20H24v8h11.303C33.654 32.657 29.332 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107"/>
                  <path d="M6.306 14.691l6.571 4.819C14.655 15.108 19.001 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00"/>
                  <path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 36c-5.311 0-9.821-3.317-11.419-7.971l-6.522 5.025C9.505 39.556 16.227 44 24 44z" fill="#4CAF50"/>
                  <path d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l6.19 5.238C42.021 35.596 44 30.138 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2"/>
                </svg>
                <p className="font-['Inter:Medium',sans-serif] font-medium leading-[1.4] text-[#0a1e3f] text-[13px] whitespace-nowrap">Continue with Google</p>
              </motion.button>
            </div>

            {/* Terms + Log in */}
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
                disabled={!agreedToTerms || !email || isLoading}
                whileHover={agreedToTerms && email && !isLoading ? { scale: 1.02, y: -2 } : {}}
                whileTap={agreedToTerms && email && !isLoading ? { scale: 0.98 } : {}}
                className="bg-[#0a1e3f] h-[60px] relative rounded-[4px] shrink-0 w-full disabled:opacity-50 hover:bg-[#0a2a5a] transition-all disabled:hover:bg-[#0a1e3f] shadow-sm hover:shadow-lg disabled:shadow-none"
              >
                <div className="flex flex-row items-center justify-center rounded-[inherit] size-full">
                  <div className="flex gap-[14px] items-center justify-center px-[28px] size-full">
                    <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-none text-[16px] text-white tracking-[0.16px] whitespace-nowrap">
                      {isLoading ? 'Sending OTP…' : 'Log in'}
                    </p>
                    {!isLoading && (
                      <motion.svg
                        animate={agreedToTerms && email ? { x: [0, 3, 0] } : {}}
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
