import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import Link from 'next/link'
import React from 'react'

export default async function Home() {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
  
    const { data: inserts } = await supabase.from('texts').select()
  
    return (
    <>
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
      <Link href="/add" className="bg-green-600 hover:bg-green-500 p-3 m-4 flex justify-center rounded-lg text-white text-lg">Submit your own message</Link>
    </>
    )
}