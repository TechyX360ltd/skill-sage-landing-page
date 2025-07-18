import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://rpexcrwcgdmlfxihdmny.supabase.co/rest/v1/categories?select=name', {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwZXhjcndjZ2RtbGZ4aWhkbW55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzMzA1MzgsImV4cCI6MjA2NjkwNjUzOH0.ojXLqeHrpeKVgXx-NJnzRMXlBj6uKRsWT1TRRcS9ZGs',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwZXhjcndjZ2RtbGZ4aWhkbW55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzMzA1MzgsImV4cCI6MjA2NjkwNjUzOH0.ojXLqeHrpeKVgXx-NJnzRMXlBj6uKRsWT1TRRcS9ZGs',
      },
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      return NextResponse.json([], { status: 200 });
    }
    const data = await res.json();
    return NextResponse.json(Array.isArray(data) ? data.map((c: { name: string }) => c.name) : []);
  } catch (e) {
    return NextResponse.json([], { status: 200 });
  }
} 