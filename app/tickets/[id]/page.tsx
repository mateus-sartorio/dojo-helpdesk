import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamicParams = true;

export async function generateStaticParams() {
  const response = await fetch(`https://dojo-helpdesk-backend.onrender.com/tickets`);
  const tickets = await response.json();

  return tickets.map((ticket) => ({ id: ticket.id }));
}

async function getTicket(id) {
  const response = await fetch(`https://dojo-helpdesk-backend.onrender.com/tickets/${id}`, {
    next: {
      revalidate: 60,
    },
  });

  if (!response.ok) {
    notFound();
  }

  return response.json();
}

export default async function TicketDetails({ params }) {
  const { id } = params;

  const ticket = await getTicket(id);

  return (
    <main>
      <nav>
        <h2>Ticket Details</h2>
      </nav>
      <div className="card">
        <h3>{ticket.title}</h3>
        <small>Created by {ticket.user_email}</small>
        <p>{ticket.body}</p>
        <div className={`pill ${ticket.priority}`}>{ticket.priority} priority</div>
      </div>
    </main>
  );
}
