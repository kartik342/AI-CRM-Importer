"use client";

import { useState } from "react";
import { UploadDialog } from "@/components/upload/upload-dialog";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [open, setOpen] = useState(false);

  return (
    <main className="min-h-screen flex items-center justify-center">

      <Button onClick={() => setOpen(true)}>
        Import CSV
      </Button>

      <UploadDialog
        open={open}
        onOpenChange={setOpen}
      />
      
    </main>
  );
}