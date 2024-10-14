"use client"

import { createClient } from '@/utils/supabase/client'
import React, { useState } from 'react';

export default function Form() {
    const [inputValue, setInputValue] = useState('');
    async function handleSubmit(e) {
        e.preventDefault();
        if (inputValue.replace(/^\s+|\s+$/g, '')) {
        const supabase = createClient();
        await supabase.from("texts").insert({text: inputValue});
        const response = await supabase.from("texts").delete()
        .order('id', { ascending: true }) 
        .limit(1);
        console.log(response)
        }

    }
  return (
    <>
    <form>
        <textarea className="p-2 mt-5 flex justify-center items-center mx-auto my-auto block h-64 w-64 border rounded-md" value={inputValue} onChange={() => {setInputValue(event.target.value);}}></textarea>
        <button onClick={handleSubmit} className="p-3 mt-3 flex justify-center items-center mx-auto my-auto block border h-32 w-32 rounded-full text-2xl bg-lime-500 active:bg-lime-600 text-white font-bold">Submit</button>
    </form>
    <a href="../" className="bg-green-600 hover:bg-green-500 p-3 m-4 flex justify-center rounded-lg text-white text-lg ">See submissions</a>
    </>
    )
}