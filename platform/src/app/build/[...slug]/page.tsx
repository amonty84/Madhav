import { permanentRedirect } from 'next/navigation'

export default async function BuildLegacyRedirect({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}) {
  const { slug = [] } = await params
  permanentRedirect(`/cockpit/${slug.join('/')}`)
}
