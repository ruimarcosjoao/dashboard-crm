import { Toaster } from "sonner";

import { PlateEditor } from "@/components/editor/plate-editor";
import { SettingsProvider } from "@/components/editor/settings";

export default function Page() {
  return (
    <div className="container mx-auto h-screen max-w-6xl" data-registry="plate">
      <div className="w-full">
        <SettingsProvider>
          <PlateEditor />
        </SettingsProvider>

        <Toaster />
      </div>
    </div>
  );
}
