"use client"

// import { createClient } from '@/utils/supabase/server'
import { createClient } from '@/utils/supabase/client'
// import { cookies } from 'next/headers'
import Link from 'next/link'
import React from 'react'
import { useState, useEffect } from 'react'

// put async here
export default function Home() {
    // const cookieStore = cookies()
    // const supabase = createClient(cookieStore)
    const supabase = createClient()
    const [inserts, setInserts] = useState()
    
    const handleInserts = (payload) => {
        // alert('yey'+String(payload))
        location.reload();
    }
    supabase.channel('texts').on('postgres_changes', {event: 'INSERT', schema: 'public', table: 'texts'}, handleInserts).subscribe()
    async function fetchData() {
        const { data : inserts2 } = await supabase.from('texts').select()
        setInserts(inserts2)
        // alert(String(supabase.from('texts').select()))
    }
    useEffect(() => {
        fetchData()
    }, [])
  
    return (
    <>
        <Link href="/add" className="bg-green-600 hover:bg-green-500 p-3 m-4 flex justify-center rounded-lg text-white text-lg">Submit your own message</Link>
      <ol>
        {inserts?.map((insert) => (
          <li key={insert.id} className="bg-lime-600 p-4 m-3 rounded-md text-white font-semibold text-lg">
            {insert.text.split("\n").map((line, index) => (
            <React.Fragment key={insert.id}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </li>
        ))}
      </ol>
    </>
    )
}