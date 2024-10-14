"use client"

import { createClient } from '@/utils/supabase/client'
import React, { useState } from 'react';

export default function Form() {
    const [inputValue, setInputValue] = useState('');
    async function handleSubmit(e) {
        e.preventDefault();
        const supabase = createClient();
        await supabase.from("texts").insert({text: inputValue});
        const response = await supabase.from("texts").delete()
        .order('id', { ascending: true }) 
        .limit(1);
        console.log(response)

    }
  return (
    <>
    <form>
        <input value={inputValue} onChange={() => {setInputValue(event.target.value);}}></input>
        <button onClick={handleSubmit}>Submit</button>
    </form>
    <a href="../">See your submission</a>
    </>
    )
}