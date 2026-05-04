import { readData } from "@/lib/api/local-db";
import type { ChurchEvent, GivingRecord, ContactSubmission } from "@/lib/types/resources";

interface Sermon { id?: string; slug?: string; }

export async function GET() {
  const events = readData<ChurchEvent[]>("events.json");
  const sermons = readData<Sermon[]>("sermons.json");
  const giving = readData<GivingRecord[]>("giving.json");
  const contacts = readData<ContactSubmission[]>("contacts.json");
  const prayers = contacts.filter((c) => c.subject === "Prayer Request");
  const givingTotal = giving.filter((g) => g.status === "PAID").reduce((sum, g) => sum + g.amount, 0);

  return Response.json({
    success: true,
    data: {
      members: 0,
      events: events.length,
      sermons: sermons.length,
      givingTotal,
      givingRecords: giving.length,
      openPrayers: prayers.filter((p) => !p.read).length,
      totalMembers: 0,
      totalEvents: events.length,
      totalSermons: sermons.length,
      monthlyGiving: givingTotal,
    },
  });
}
