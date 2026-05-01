import { permanentRedirect } from 'next/navigation'

export default function BuildLegacyRoot() {
  permanentRedirect('/cockpit')
}
