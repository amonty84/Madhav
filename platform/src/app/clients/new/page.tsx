'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export default function NewClientPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '', birth_date: '', birth_time: '', birth_place: '', client_email: '',
    birth_lat: '', birth_lng: '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setLoading(false)
    if (res.ok) {
      const chart = await res.json()
      router.push(`/clients/${chart.id}/build`)
    } else {
      const { error } = await res.json()
      toast.error(error ?? 'Failed to create client')
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle>New Client</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {([
              ['name', 'Full Name', 'text', 'Abhisek Mohanty'],
              ['client_email', 'Client Email', 'email', 'client@example.com'],
              ['birth_date', 'Birth Date', 'date', ''],
              ['birth_time', 'Birth Time (local)', 'time', ''],
              ['birth_place', 'Birth Place', 'text', 'Bhubaneswar, India'],
              ['birth_lat', 'Latitude', 'number', '20.2960'],
              ['birth_lng', 'Longitude', 'number', '85.8246'],
            ] as const).map(([field, label, type, placeholder]) => (
              <div key={field}>
                <Label htmlFor={field}>{label}</Label>
                <Input
                  id={field}
                  type={type}
                  placeholder={placeholder}
                  value={form[field]}
                  onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                  required={field !== 'birth_lat' && field !== 'birth_lng'}
                />
              </div>
            ))}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating…' : 'Create Client'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
