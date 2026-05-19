import { Suspense } from 'react';
import VerifyEmail from '../../../../components/auth/VerifyEmail';
import LoadingSpin from '@/components/LoadingSpin';

const page = () => {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-[#F8F7FC]">
        <LoadingSpin />
      </div>
    }>
      <VerifyEmail />
    </Suspense>
  );
};

export default page;