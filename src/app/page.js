import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import Link from 'next/link'

export default async function Home() {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
  
    const { data: inserts } = await supabase.from('texts').select()
  
    return (
    <>
      <ul>
        {inserts?.map((insert) => (
          <li key={insert.id}>{insert.text}</li>
        ))}
      </ul>
      <Link href="/add">Sumbit your own message</Link>
    </>
    )
}