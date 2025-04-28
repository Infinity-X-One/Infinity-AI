"use client"

import ProofContent from "./proof-content"

export default function ProofInterface() {
  return (
    <div className="pt-12">
      {" "}
      {/* Added padding-top to account for the ticker */}
      <ProofContent />
    </div>
  )
}
