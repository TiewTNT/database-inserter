"use client"

import { createClient } from '@/utils/supabase/client'
import React, { useState, useEffect } from 'react';

export default function Form() {
    const [inputValue, setInputValue] = useState('');
    const supabase = createClient()
    const [inserts, setInserts] = useState()
    
    const handleInserts = (payload) => {
        setInserts(null)
        fetchData()
    }
    supabase.channel('texts').on('postgres_changes', {event: 'INSERT', schema: 'public', table: 'texts'}, handleInserts).subscribe()
    async function fetchData() {
        const { data : inserts2 } = await supabase.from('texts').select().order('id', { ascending: true })
        setInserts(inserts2)
    }
    useEffect(() => {
        fetchData()
    }, [])

    async function handleSubmit(e) {
        e.preventDefault();
        if (inputValue.replace(/^\s+|\s+$/g, '') && inputValue.length <= 150) {
            const supabase = createClient();
            await supabase.from("texts").insert({text: inputValue.trim()});
            const response = await supabase.from("texts").delete()
            .order('id', { ascending: true }) 
            .limit(1);
            console.log(response)
        }
        if (inputValue.length > 150) {
            alert("Length exceeded limit (max 150 chars)")
        }

    }
  return (
    <>
    <form>
        <textarea className="p-2 mt-5 flex justify-center items-center mx-auto my-auto block h-64 w-64 border rounded-md" value={inputValue} onChange={() => {setInputValue(event.target.value);}}></textarea>
        <button onClick={handleSubmit} className="p-3 mt-3 flex justify-center items-center mx-auto my-auto block h-32 w-32 rounded-full text-2xl bg-lime-500 active:bg-lime-600 text-white font-bold">Submit</button>
    </form>
    <a href="../" className="bg-green-600 hover:bg-green-500 p-3 m-4 flex justify-center rounded-lg text-white text-lg ">See submissions</a>
    
    <p className="bg-lime-600 p-4 m-3 rounded-md text-white font-semibold text-lg">
    {inserts?.at(-1).text.split("\n").map((line, index) => (
            <React.Fragment key={inserts.at(-1).id}>
              {line}
              <br />
            </React.Fragment>
          ))}
    </p>
    </>
    )
}