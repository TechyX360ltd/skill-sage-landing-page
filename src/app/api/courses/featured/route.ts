import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://rpexcrwcgdmlfxihdmny.supabase.co/rest/v1/courses?select=id,title,description,price,category,featured&featured=eq.true&limit=3', {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwZXhjcndjZ2RtbGZ4aWhkbW55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzMzA1MzgsImV4cCI6MjA2NjkwNjUzOH0.ojXLqeHrpeKVgXx-NJnzRMXlBj6uKRsWT1TRRcS9ZGs',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwZXhjcndjZ2RtbGZ4aWhkbW55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzMzA1MzgsImV4cCI6MjA2NjkwNjUzOH0.ojXLqeHrpeKVgXx-NJnzRMXlBj6uKRsWT1TRRcS9ZGs',
      },
      next: { revalidate: 60 },
    });
    
    if (!res.ok) {
      // Return fallback data if API fails
      return NextResponse.json([
        {
          id: 1,
          title: "Content creation for total beginners (4 Weeks)",
          description: "The Launchpad program is riddled with in-depth insights and knowledge into the many career paths available to you within the tech landscape.",
          price: 0,
          category: "Content Creation",
          featured: true
        },
        {
          id: 2,
          title: "Content Mastery for African Creators (6 Weeks)",
          description: "The program is designed to teach you how to start and boost your content creation career regardless of your niche interest.",
          price: 99,
          category: "Content Creation",
          featured: true
        },
        {
          id: 3,
          title: "High-Impact Selling: From Prospecting to Closing (6 Weeks)",
          description: "Invest in your professional growth and equip yourself with the essential skills and strategies to excel in the competitive sales landscape.",
          price: 149,
          category: "Sales Mastery",
          featured: true
        }
      ], { status: 200 });
    }
    
    const data = await res.json();
    return NextResponse.json(Array.isArray(data) ? data : []);
  } catch {
    // Return fallback data on error
    return NextResponse.json([
      {
        id: 1,
        title: "Content creation for total beginners (4 Weeks)",
        description: "The Launchpad program is riddled with in-depth insights and knowledge into the many career paths available to you within the tech landscape.",
        price: 0,
        category: "Content Creation",
        featured: true
      },
      {
        id: 2,
        title: "Content Mastery for African Creators (6 Weeks)",
        description: "The program is designed to teach you how to start and boost your content creation career regardless of your niche interest.",
        price: 99,
        category: "Content Creation",
        featured: true
      },
      {
        id: 3,
        title: "High-Impact Selling: From Prospecting to Closing (6 Weeks)",
        description: "Invest in your professional growth and equip yourself with the essential skills and strategies to excel in the competitive sales landscape.",
        price: 149,
        category: "Sales Mastery",
        featured: true
      }
    ], { status: 200 });
  }
} 