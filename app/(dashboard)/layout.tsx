import { DashboardProviders } from "./dashboard/_components/dashboard-providers";
import { AppShell } from "@/components/layout/app-shell";
// import { MissionControlSheet } from "@/components/ai/MissionControlSheet";
import "@/app/globals.css";

export default function V2Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <DashboardProviders>
            <AppShell>
                {children}
                {/* <MissionControlSheet /> */}
            </AppShell>
        </DashboardProviders>
    );
}
