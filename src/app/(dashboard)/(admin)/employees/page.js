// import { Payment, columns } from "./columns"
// import { DataTable } from "./data-table"

import { columns } from "./_components/EmployeeTabel/columns"
import { DataTable } from "./_components/EmployeeTabel/data-tabel"

async function getData() {
  // Simulate fetching data from your API here.
  return [
    { id: "id1", amount: 100, status: "pending", email: "a@example.com" },
    { id: "id2", amount: 200, status: "completed", email: "b@example.com" },
    { id: "id3", amount: 300, status: "failed", email: "c@example.com" },
    { id: "id4", amount: 400, status: "pending", email: "d@example.com" },
    { id: "id5", amount: 500, status: "completed", email: "e@example.com" },
    { id: "id6", amount: 600, status: "failed", email: "f@example.com" },
    { id: "id7", amount: 700, status: "pending", email: "g@example.com" },
    { id: "id8", amount: 800, status: "completed", email: "h@example.com" },
    { id: "id9", amount: 900, status: "failed", email: "i@example.com" },
    { id: "id10", amount: 1000, status: "pending", email: "j@example.com" },
    { id: "id11", amount: 1100, status: "completed", email: "a@example.com" },
    { id: "id12", amount: 1200, status: "failed", email: "b@example.com" },
    { id: "id13", amount: 1300, status: "pending", email: "c@example.com" },
    { id: "id14", amount: 1400, status: "completed", email: "d@example.com" },
    { id: "id15", amount: 1500, status: "failed", email: "e@example.com" },
    { id: "id16", amount: 1600, status: "pending", email: "f@example.com" },
    { id: "id17", amount: 1700, status: "completed", email: "g@example.com" },
    { id: "id18", amount: 1800, status: "failed", email: "h@example.com" },
    { id: "id19", amount: 1900, status: "pending", email: "i@example.com" },
    { id: "id20", amount: 2000, status: "completed", email: "j@example.com" },
    { id: "id21", amount: 2100, status: "failed", email: "a@example.com" },
    { id: "id22", amount: 2200, status: "pending", email: "b@example.com" },
    { id: "id23", amount: 2300, status: "completed", email: "c@example.com" },
    { id: "id24", amount: 2400, status: "failed", email: "d@example.com" },
    { id: "id25", amount: 2500, status: "pending", email: "e@example.com" },
    { id: "id26", amount: 2600, status: "completed", email: "f@example.com" },
    { id: "id27", amount: 2700, status: "failed", email: "g@example.com" },
    { id: "id28", amount: 2800, status: "pending", email: "h@example.com" },
    { id: "id29", amount: 2900, status: "completed", email: "i@example.com" },
    { id: "id30", amount: 3000, status: "failed", email: "j@example.com" },
    { id: "id31", amount: 3100, status: "pending", email: "a@example.com" },
    { id: "id32", amount: 3200, status: "completed", email: "b@example.com" },
    { id: "id33", amount: 3300, status: "failed", email: "c@example.com" },
    { id: "id34", amount: 3400, status: "pending", email: "d@example.com" },
    { id: "id35", amount: 3500, status: "completed", email: "e@example.com" },
    { id: "id36", amount: 3600, status: "failed", email: "f@example.com" },
    { id: "id37", amount: 3700, status: "pending", email: "g@example.com" },
    { id: "id38", amount: 3800, status: "completed", email: "h@example.com" },
    { id: "id39", amount: 3900, status: "failed", email: "i@example.com" },
    { id: "id40", amount: 4000, status: "pending", email: "j@example.com" },
    { id: "id41", amount: 4100, status: "completed", email: "a@example.com" },
    { id: "id42", amount: 4200, status: "failed", email: "b@example.com" },
    { id: "id43", amount: 4300, status: "pending", email: "c@example.com" },
    { id: "id44", amount: 4400, status: "completed", email: "d@example.com" },
    { id: "id45", amount: 4500, status: "failed", email: "e@example.com" },
    { id: "id46", amount: 4600, status: "pending", email: "f@example.com" },
    { id: "id47", amount: 4700, status: "completed", email: "g@example.com" },
    { id: "id48", amount: 4800, status: "failed", email: "h@example.com" },
    { id: "id49", amount: 4900, status: "pending", email: "i@example.com" },
    { id: "id50", amount: 5000, status: "completed", email: "j@example.com" },
    { id: "id51", amount: 5100, status: "failed", email: "a@example.com" },
    { id: "id52", amount: 5200, status: "pending", email: "b@example.com" },
    { id: "id53", amount: 5300, status: "completed", email: "c@example.com" },
    { id: "id54", amount: 5400, status: "failed", email: "d@example.com" },
    { id: "id55", amount: 5500, status: "pending", email: "e@example.com" },
    { id: "id56", amount: 5600, status: "completed", email: "f@example.com" },
    { id: "id57", amount: 5700, status: "failed", email: "g@example.com" },
    { id: "id58", amount: 5800, status: "pending", email: "h@example.com" },
    { id: "id59", amount: 5900, status: "completed", email: "i@example.com" },
    { id: "id60", amount: 6000, status: "failed", email: "j@example.com" },
  ];
}


export default async function DemoPage() {
  const data = await getData()

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
