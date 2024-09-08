import Link from "next/link"

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"
import { CreateSpec } from "@/components/pages/CreateSpec"

export default function IndexPage() {
  return (
    <>
      <CreateSpec />
    </>
  )
}
