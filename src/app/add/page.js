"use client"

import { createClient } from '@/utils/supabase/client'
import React, { useState } from 'react';

export default function Form() {
    const [inputValue, setInputValue] = useState('');
    async function handleSubmit() {
        const supabase = createClient();
        await supabase.from("Texts").insert({text: inputValue});
    }
  return (
    <form>
        <input value={inputValue} onChange={() => {setInputValue(event.target.value);}}></input>
        <button onClick={handleSubmit}>Submit</button>
    </form>
    )
}
