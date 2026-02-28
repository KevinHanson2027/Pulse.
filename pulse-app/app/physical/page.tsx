'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PhysicalRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace('/health'); }, [router]);
  return null;
}
