import { Settings } from "lucide-react";

export default function SettingsSection() {
  return (
    <div className="bg-secondary flex-grow rounded-sm p-1 flex flex-col w-full">
      <div className="flex w-full justify-between gap-2 border-b border-b-white/5 py-1">
        <aside className="flex items-start gap-1 flex-shrink-0 text-primary ">
          <Settings className="h-5 w-5" />
          <p>Space Settings</p>
        </aside>
      </div>

      <div>
        
      </div>
    </div>
  );
}
