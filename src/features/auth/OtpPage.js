import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import bgVideo from '../../assets/bgVideo.gif';
import imgWeOkasLogo from '../../assets/weOkasLogo.png';
import { verifyOtp, sendOtp } from './loginAuthService';
import useAuthStore from './authStore';
import { ROUTE_PATHS } from '../../config/constants';

function getRoleRedirectPath(user) {
  if (user?.org_type === 'distributor') return '/distributor/dashboard';
  if (user?.org_type === 'si')          return '/dashboard';
  switch (user?.role) {
    case 'admin':            return ROUTE_PATHS.WEOKAS_DASHBOARD;
    case 'Viewer':           return '/user/dashboard';
    case 'Project Manager':
    default:                 return '/dashboard';
  }
}

export default function OtpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const keepLoggedIn = location.state?.keepLoggedIn ?? false;

  const storeLogin = useAuthStore((s) => s.login);

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!email) navigate('/auth/login');
  }, [email, navigate]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value[value.length - 1];
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    e.preventDefault();
    const newOtp = [...otp];
    pasted.split('').forEach((char, i) => { newOtp[i] = char; });
    setOtp(newOtp);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleVerify = async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6 || !email) return;
    setError('');
    setIsLoading(true);
    try {
      const { accessToken, user, permissionsData } = await verifyOtp(email, otpValue);
      storeLogin(user, accessToken, permissionsData?.flat ?? [], permissionsData?.grouped ?? {});
      navigate(getRoleRedirectPath(user));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setError('');
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
    setIsResending(true);
    try {
      await sendOtp(email);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend OTP');
    } finally {
      setIsResending(false);
    }
  };

  const isOtpComplete = otp.every(digit => digit !== '');

  return (
    <div className="bg-white relative h-screen w-full overflow-hidden flex items-center justify-center">
      <div className="flex flex-col h-full items-start overflow-clip p-[24px] md:p-[48px] relative w-full">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={bgVideo} />
        <div className="h-[24px] relative shrink-0 w-[120px] md:w-[160px] z-10 mb-[40px] md:mb-0">
          <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={imgWeOkasLogo} />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative md:absolute bg-white flex flex-col items-start justify-center md:left-auto md:right-[24px] lg:right-[60px] overflow-y-auto px-[24px] md:px-[60px] lg:px-[80px] py-[32px] md:py-[48px] lg:py-[60px] rounded-[16px] md:rounded-[24px] md:top-[24px] md:bottom-[24px] md:max-h-[calc(125vh-48px)] w-full md:w-[480px] lg:w-[546px] z-10 mt-auto md:mt-0"
        >
          <div className="flex flex-col gap-[24px] md:gap-[36px] items-start w-full">
            <motion.button type="button" onClick={() => navigate(ROUTE_PATHS.LOGIN)} whileHover={{ scale: 1.08, x: -2 }} whileTap={{ scale: 0.95 }} className="bg-[#f4f7fb] flex items-center justify-center rounded-[4px] shrink-0 size-[40px] hover:bg-[#e8ecf1] transition-colors">
              <motion.svg whileHover={{ x: -2 }} className="size-[18px]" fill="none" viewBox="0 0 18 18">
                <path d="M14 9H4M8.5 13.5L4 9L8.5 4.5" stroke="#0A1E3F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" />
              </motion.svg>
            </motion.button>

            <div className="flex flex-col gap-[16px] items-start w-full">
              <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.1] text-[#0a1e3f] text-[28px] md:text-[40px] tracking-[-0.8px]">Enter OTP</p>
              <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.5] text-[#5c7089] text-[14px] md:text-[16px]">
                Enter your 6 digit OTP sent to <span className="text-[#0a1e3f] font-medium">{email}</span>
              </p>
            </div>

            <div className="flex items-center gap-[8px] md:gap-[12px] w-full">
              {otp.map((digit, index) => (
                <motion.input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  whileFocus={{ y: -2 }}
                  animate={{ borderColor: digit ? '#0a1e3f' : '#e2e2e2' }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-[4px] flex-1 min-w-0 h-[48px] md:h-[56px] text-center font-['Inter:Semi_Bold',sans-serif] font-semibold text-[20px] md:text-[28px] tracking-[-0.56px] text-[#0a1e3f] border-[1.5px] outline-none shadow-sm focus:shadow-lg transition-shadow"
                />
              ))}
            </div>

            <div className="flex flex-col gap-[20px] items-center w-full">
              <div className="bg-[#e2e2e2] h-px w-full" />
              <div className="flex gap-[6px] items-center text-[14px] whitespace-nowrap">
                <p className="font-['Inter:Regular',sans-serif] font-normal text-[#5c7089]">Didn't receive code?</p>
                <motion.button
                  type="button"
                  onClick={handleResend}
                  disabled={isResending || isLoading}
                  whileHover={!isResending && !isLoading ? { scale: 1.05, x: 2 } : {}}
                  whileTap={!isResending && !isLoading ? { scale: 0.95 } : {}}
                  className="font-['Inter:Medium',sans-serif] font-medium text-[#0a1e3f] hover:underline disabled:opacity-50"
                >
                  {isResending ? 'Sending…' : 'Resend code'}
                </motion.button>
              </div>
            </div>

            {error && <p className="font-['Inter:Regular',sans-serif] text-[13px] text-red-500 w-full">{error}</p>}

            <motion.button
              type="button"
              onClick={handleVerify}
              disabled={!isOtpComplete || isLoading}
              whileHover={isOtpComplete && !isLoading ? { scale: 1.02, y: -2 } : {}}
              whileTap={isOtpComplete && !isLoading ? { scale: 0.98 } : {}}
              className="bg-[#0a1e3f] h-[60px] relative rounded-[4px] shrink-0 w-full disabled:opacity-50 hover:bg-[#0a2a5a] transition-all disabled:hover:bg-[#0a1e3f] shadow-sm hover:shadow-lg disabled:shadow-none"
            >
              <div className="flex flex-row items-center justify-center rounded-[inherit] size-full">
                <div className="flex gap-[14px] items-center justify-center px-[28px] size-full">
                  <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-none text-[16px] text-white tracking-[0.16px] whitespace-nowrap">
                    {isLoading ? 'Verifying…' : 'Verify'}
                  </p>
                  {!isLoading && (
                    <motion.svg animate={isOtpComplete ? { x: [0, 3, 0] } : {}} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} className="shrink-0 size-[22px]" fill="none" viewBox="0 0 22 22">
                      <path d="M3 11H19M13 17L19 11L13 5" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" />
                    </motion.svg>
                  )}
                </div>
              </div>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
