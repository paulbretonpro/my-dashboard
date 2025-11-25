'use client'
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ButtonBack() {
  const router = useRouter()
  return (
    <Button variant="outline" onClick={() => router.back()} className="mb-4">
        <ArrowLeft/> Retour
    </Button>
  )
}   