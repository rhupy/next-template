import { CreateSpec } from "@/components/pages/CreateSpec"

export default function SpecPage() {
  return <CreateSpec />
}

export function generateStaticParams() {
  return [{}]
}
