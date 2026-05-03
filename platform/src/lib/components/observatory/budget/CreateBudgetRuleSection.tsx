'use client'

// Thin client wrapper that re-renders the page on successful create.

import { useRouter } from 'next/navigation'

import { CreateBudgetRuleForm } from './CreateBudgetRuleForm'

export function CreateBudgetRuleSection() {
  const router = useRouter()
  return <CreateBudgetRuleForm onCreated={() => router.refresh()} />
}
